import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';

// GET /api/workflows - Get user workflows
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('Fetching workflows for user:', userId);

    const workflowsRef = db.collection('workflows');
    
    const workflowsSnapshot = await workflowsRef
      .where('participants', 'array-contains', userId)
      .get();

    if (workflowsSnapshot.empty) {
      return NextResponse.json({
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

    return NextResponse.json({
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

    return NextResponse.json({
      message: 'Failed to get workflows',
      error: error.message
    }, { status: 500 });
  }
}

// POST /api/workflows - Create new workflow
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await req.json();
    const creatorId = session.user.id;

    if (!name) {
      return NextResponse.json({ 
        message: 'Workflow name is required' 
      }, { status: 400 });
    }

    const workflowRef = db.collection('workflows').doc();
    const workflowData = {
      id: workflowRef.id,
      name,
      description: description || null,
      status: 'To do',
      createdBy: creatorId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
      participants: [creatorId],
      tasks: []
    };

    await workflowRef.set(workflowData);

    const formattedWorkflow = {
      ...workflowData,
      members: workflowData.participants,
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Workflow created successfully',
      workflow: formattedWorkflow
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json({ 
      message: 'Failed to create workflow', 
      error: error.message 
    }, { status: 500 });
  }
} 