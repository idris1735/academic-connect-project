const { db } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

exports.createWorkflow = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creatorId = req.user.uid;

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

    return res.status(201).json({
      message: 'Workflow created successfully',
      workflow: {
        ...workflowData,
        createdAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      }
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

    return res.status(201).json({
      message: 'Task added successfully',
      task: taskData
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
    const userId = req.user.uid;

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
    const taskIndex = workflowData.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Use current timestamp instead of FieldValue.serverTimestamp()
    const now = new Date().toISOString();
    
    // Update the task status
    const updatedTasks = [...workflowData.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      status,
      lastUpdate: now
    };

    await workflowRef.update({
      tasks: updatedTasks,
      lastUpdate: FieldValue.serverTimestamp() // This is fine as it's not in an array
    });

    return res.status(200).json({
      message: 'Task status updated successfully',
      task: {
        ...updatedTasks[taskIndex],
        lastUpdate: now
      }
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
