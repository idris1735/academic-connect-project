import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { getUserNameByUid } from '@/lib/utils/user';

export const runtime = 'nodejs';

// GET /api/workflows/events - SSE endpoint for workflow updates
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Write initial connection message
    writer.write(encoder.encode('data: {"type":"connected"}\n\n'));

    // Set up Firestore listener for workflow events
    const unsubscribe = db.collection('workflows')
      .where('participants', 'array-contains', userId)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const workflow = {
            id: change.doc.id,
            ...change.doc.data(),
            createdAt: change.doc.data().createdAt?.toDate()?.toISOString(),
            updatedAt: change.doc.data().updatedAt?.toDate()?.toISOString()
          };

          const eventData = {
            type: change.type.toUpperCase(),
            workflow
          };

          writer.write(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
        });
      });

    // Handle connection close
    req.signal.addEventListener('abort', () => {
      unsubscribe();
      writer.close();
    });

    return new Response(stream.readable, { headers });

  } catch (error) {
    console.error('Error in workflow events:', error);
    return NextResponse.json({
      message: 'Failed to setup workflow events stream',
      error: error.message
    }, { status: 500 });
  }
} 