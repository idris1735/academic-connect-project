import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';

// POST /api/workflows/[workflowId]/tasks - Add task
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId } = params;
    const { title, description, assignedTo, dueDate } = await req.json();
    const creatorId = session.user.id;

    if (!title) {
      return NextResponse.json({ 
        message: 'Task title is required' 
      }, { status: 400 });
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
      lastUpdate: admin.firestore.FieldValue.serverTimestamp()
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

    return NextResponse.json({
      message: 'Task added successfully',
      task: taskData,
      workflow: workflowData
    });

  } catch (error) {
    console.error('Error adding task:', error);
    return NextResponse.json({ 
      message: 'Failed to add task', 
      error: error.message 
    }, { status: 500 });
  }
} 