import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';

// GET /api/workflows/[workflowId] - Get workflow details
export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId } = params;
    const workflowRef = db.collection('workflows').doc(workflowId);
    const workflow = await workflowRef.get();

    if (!workflow.exists) {
      return NextResponse.json({ message: 'Workflow not found' }, { status: 404 });
    }

    const workflowData = workflow.data();

    // Format dates
    const formattedWorkflow = {
      ...workflowData,
      createdAt: workflowData.createdAt?.toDate()?.toISOString() || null,
      lastUpdate: workflowData.lastUpdate?.toDate()?.toISOString() || null,
      tasks: workflowData.tasks?.map(task => ({
        ...task,
        createdAt: task.createdAt?.toDate?.()?.toISOString() || task.createdAt,
        lastUpdate: task.lastUpdate?.toDate?.()?.toISOString() || task.lastUpdate,
        dueDate: task.dueDate?.toDate?.()?.toISOString() || task.dueDate
      }))
    };

    return NextResponse.json({
      message: 'Workflow retrieved successfully',
      workflow: formattedWorkflow
    });

  } catch (error) {
    console.error('Error getting workflow:', error);
    return NextResponse.json({ 
      message: 'Failed to get workflow', 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE /api/workflows/[workflowId] - Delete workflow
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId } = params;
    const userId = session.user.id;

    const workflowRef = db.collection('workflows').doc(workflowId);
    const workflow = await workflowRef.get();

    if (!workflow.exists) {
      return NextResponse.json({ message: 'Workflow not found' }, { status: 404 });
    }

    const workflowData = workflow.data();
    if (workflowData.createdBy !== userId) {
      return NextResponse.json({ message: 'Not authorized to delete this workflow' }, { status: 403 });
    }

    await workflowRef.delete();

    return NextResponse.json({
      message: 'Workflow deleted successfully',
      workflowId
    });

  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json({ 
      message: 'Failed to delete workflow', 
      error: error.message 
    }, { status: 500 });
  }
} 