import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';

// PATCH /api/workflows/[workflowId]/tasks/[taskId]/status
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId, taskId } = params;
    const { status } = await req.json();
    const userId = session.user.id;

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

    const updatedTasks = [...workflowData.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      status,
      lastUpdate: new Date().toISOString()
    };

   

    // Force a document update with multiple fields
    const updateData = {
      tasks: updatedTasks,
      lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
      _lastModified: admin.firestore.FieldValue.serverTimestamp(),
      _updateCount: admin.firestore.FieldValue.increment(1) // Add this to force an update
    };

    await workflowRef.update(updateData);
   
    // Get the latest data
    const updatedWorkflow = await workflowRef.get();
    const updatedWorkflowData = {
      id: updatedWorkflow.id,
      ...updatedWorkflow.data(),
      createdAt: updatedWorkflow.data().createdAt.toDate().toISOString(),
      lastUpdate: new Date().toISOString()
    };
   

    const eventData = {
      type: 'WORKFLOW_UPDATED',
      changeType: 'task_updated',
      workflow: updatedWorkflowData
    };
    
    return NextResponse.json({
      message: 'Task status updated successfully',
      task: updatedTasks[taskIndex],
      workflow: updatedWorkflowData
    });

  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json({ 
      message: 'Failed to update task status', 
      error: error.message 
    }, { status: 500 });
  }
} 