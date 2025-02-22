import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';

// POST /api/workflows/[workflowId]/tasks/[taskId]/comments
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId, taskId } = params;
    const { content } = await req.json();
    const userId = session.user.id;

    if (!content) {
      return NextResponse.json({ 
        message: 'Comment content is required' 
      }, { status: 400 });
    }

    const workflowRef = db.collection('workflows').doc(workflowId);
    const workflow = await workflowRef.get();

    if (!workflow.exists) {
      return NextResponse.json({ message: 'Workflow not found' }, { status: 404 });
    }

    const workflowData = workflow.data();
    const taskIndex = workflowData.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    const comment = {
      id: db.collection('_').doc().id,
      content,
      createdBy: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add comment to task
    const updatedTasks = [...workflowData.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      comments: [...(updatedTasks[taskIndex].comments || []), comment],
      lastUpdate: admin.firestore.FieldValue.serverTimestamp()
    };

    await workflowRef.update({
      tasks: updatedTasks,
      lastUpdate: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({
      message: 'Comment added successfully',
      comment: {
        ...comment,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ 
      message: 'Failed to add comment', 
      error: error.message 
    }, { status: 500 });
  }
} 