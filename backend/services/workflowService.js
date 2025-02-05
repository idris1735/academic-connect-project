const { db } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

// Keep track of connected clients
const clients = new Set();

exports.createWorkflow = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creatorId = req.user.uid;
    console.log('Creating workflow:', { name, creatorId });

    if (!name) {
      return res.status(400).json({ 
        message: 'Workflow name is required' 
      });
    }

    const workflowRef = db.collection('workflows').doc();
    const workflowData = {
      id: workflowRef.id,
      name,
      description: description || null,
      status: 'To do',
      createdBy: creatorId,
      createdAt: FieldValue.serverTimestamp(),
      lastUpdate: FieldValue.serverTimestamp(),
      participants: [creatorId],
      tasks: []
    };

    await workflowRef.set(workflowData);
    console.log('Workflow created:', workflowData);

    // Get the created workflow with proper timestamps
    const createdWorkflow = await workflowRef.get();
    const formattedWorkflow = {
      ...workflowData,
      members: workflowData.participants,
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };

    console.log('Returning formatted workflow:', formattedWorkflow);

    return res.status(201).json({
      message: 'Workflow created successfully',
      workflow: formattedWorkflow
    });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return res.status(500).json({ 
      message: 'Failed to create workflow', 
      error: error.message 
    });
  }
};

exports.getUserWorkflows = async (req, res) => {
  try {
    const userId = req.user.uid;

    console.log('Fetching workflows for user:', userId);

    const workflowsRef = db.collection('workflows');
    
    const workflowsSnapshot = await workflowsRef
      .where('participants', 'array-contains', userId)
      .get();

    console.log('Workflows snapshot:', workflowsSnapshot.empty ? 'empty' : 'has data');

    if (workflowsSnapshot.empty) {
      return res.status(200).json({
        message: 'No workflows found',
        workflows: []
      });
    }

    const workflows = workflowsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate()?.toISOString() || null,
        lastUpdate: data.lastUpdate?.toDate()?.toISOString() || null
      };
    });

    console.log('Processed workflows:', workflows.length);

    return res.status(200).json({
      message: 'Workflows retrieved successfully',
      workflows
    });

  } catch (error) {
    console.error('Error in getUserWorkflows:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      message: 'Failed to get workflows',
      error: error.message
    });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { title, description, assignedTo, dueDate } = req.body;
    const creatorId = req.user.uid;

    if (!title) {
      return res.status(400).json({ 
        message: 'Task title is required' 
      });
    }

    const workflowRef = db.collection('workflows').doc(workflowId);
    const workflow = await workflowRef.get();

    if (!workflow.exists) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    const now = new Date().toISOString();
    const taskData = {
      id: db.collection('_').doc().id,
      title,
      description: description || null,
      status: 'To do',
      createdBy: creatorId,
      createdAt: now,
      lastUpdate: now,
      assignedTo: assignedTo || creatorId,
      dueDate: dueDate || null,
      comments: []
    };

    await workflowRef.update({
      tasks: FieldValue.arrayUnion(taskData),
      lastUpdate: FieldValue.serverTimestamp()
    });

    // After successfully adding the task, notify all clients
    const updatedWorkflow = await workflowRef.get();
    const workflowData = {
      id: updatedWorkflow.id,
      ...updatedWorkflow.data(),
      createdAt: updatedWorkflow.data().createdAt.toDate().toISOString(),
      lastUpdate: updatedWorkflow.data().lastUpdate.toDate().toISOString()
    };

    const eventData = {
      type: 'WORKFLOW_UPDATED',
      changeType: 'task_added',
      workflow: workflowData
    };

    return res.status(201).json({
      message: 'Task added successfully',
      task: taskData,
      workflow: workflowData
    });
  } catch (error) {
    console.error('Error adding task:', error);
    return res.status(500).json({ 
      message: 'Failed to add task', 
      error: error.message 
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { workflowId, taskId } = req.params;
    const { status } = req.body;
    console.log('Updating task status:', { workflowId, taskId, status });

    if (!['To do', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be "To do", "In Progress", or "Done"' 
      });
    }

    const workflowRef = db.collection('workflows').doc(workflowId);
    const workflow = await workflowRef.get();

    if (!workflow.exists) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    const workflowData = workflow.data();
    console.log('Current workflow data:', workflowData);

    const taskIndex = workflowData.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTasks = [...workflowData.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      status,
      lastUpdate: new Date().toISOString()
    };

    console.log('Updated task:', updatedTasks[taskIndex]);

    // Force a document update with multiple fields
    const updateData = {
      tasks: updatedTasks,
      lastUpdate: FieldValue.serverTimestamp(),
      _lastModified: FieldValue.serverTimestamp(),
      _updateCount: FieldValue.increment(1) // Add this to force an update
    };

    await workflowRef.update(updateData);
    console.log('Update operation completed');

    // Get the latest data
    const updatedWorkflow = await workflowRef.get();
    const updatedWorkflowData = {
      id: updatedWorkflow.id,
      ...updatedWorkflow.data(),
      createdAt: updatedWorkflow.data().createdAt.toDate().toISOString(),
      lastUpdate: new Date().toISOString()
    };
    console.log('Final workflow data:', updatedWorkflowData);

    const eventData = {
      type: 'WORKFLOW_UPDATED',
      changeType: 'task_updated',
      workflow: updatedWorkflowData
    };

    return res.status(200).json({
      message: 'Task status updated successfully',
      task: updatedTasks[taskIndex],
      workflow: updatedWorkflowData
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    return res.status(500).json({ 
      message: 'Failed to update task status', 
      error: error.message 
    });
  }
};

exports.addTaskComment = async (req, res) => {
  try {
    const { workflowId, taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.uid;

    if (!content) {
      return res.status(400).json({ 
        message: 'Comment content is required' 
      });
    }

    const workflowRef = db.collection('workflows').doc(workflowId);
    const workflow = await workflowRef.get();

    if (!workflow.exists) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    const workflowData = workflow.data();
    const taskIndex = workflowData.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = {
      id: db.collection('_').doc().id,
      content,
      createdBy: userId,
      createdAt: FieldValue.serverTimestamp()
    };

    // Add comment to task
    const updatedTasks = [...workflowData.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      comments: [...(updatedTasks[taskIndex].comments || []), comment],
      lastUpdate: FieldValue.serverTimestamp()
    };

    await workflowRef.update({
      tasks: updatedTasks,
      lastUpdate: FieldValue.serverTimestamp()
    });

    return res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        ...comment,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ 
      message: 'Failed to add comment', 
      error: error.message 
    });
  }
};

exports.subscribeToWorkflowEvents = (req, res) => {
  // Set headers for SSE and CORS
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  });

  // Send initial connection message
  res.write('data: {"type":"connected"}\n\n');

  // Set up Firestore listener for the user's workflows
  const userId = req.user.uid;
  console.log('Setting up SSE connection for user:', userId);

  const unsubscribe = db.collection('workflows')
    .where('participants', 'array-contains', userId)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        console.log('Document change detected:', change.type, change.doc.id);
        
        if (change.type === 'added' || change.type === 'modified') {
          const workflow = { id: change.doc.id, ...change.doc.data() };
          
          // Format dates
          if (workflow.createdAt) {
            workflow.createdAt = workflow.createdAt.toDate().toISOString();
          }
          if (workflow.lastUpdate) {
            workflow.lastUpdate = workflow.lastUpdate.toDate().toISOString();
          }

          // Format tasks dates and ensure proper task data structure
          if (workflow.tasks) {
            workflow.tasks = workflow.tasks.map(task => ({
              ...task,
              createdAt: task.createdAt?.toDate?.()?.toISOString() || task.createdAt,
              lastUpdate: task.lastUpdate?.toDate?.()?.toISOString() || task.lastUpdate,
              dueDate: task.dueDate?.toDate?.()?.toISOString() || task.dueDate,
              status: task.status || 'To do'  // Ensure status is always present
            }));
          }

          // Determine if this is a task update
          const isTaskUpdate = workflow._lastModified && workflow.tasks;
          const changeType = isTaskUpdate ? 'task_updated' : change.type;

          const eventData = {
            type: 'WORKFLOW_UPDATED',
            changeType,
            workflow
          };
          console.log('Sending event data:', eventData);

          res.write(`data: ${JSON.stringify(eventData)}\n\n`);
        }

        if (change.type === 'removed') {
          const eventData = {
            type: 'WORKFLOW_REMOVED',
            workflowId: change.doc.id
          };
          res.write(`data: ${JSON.stringify(eventData)}\n\n`);
        }
      });
    }, error => {
      console.error('Firestore listener error:', error);
      res.write(`data: ${JSON.stringify({ type: 'ERROR', error: error.message })}\n\n`);
    });

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);

  // Clean up listener and interval when connection closes
  req.on('close', () => {
    unsubscribe();
    clearInterval(keepAlive);
  });
};
