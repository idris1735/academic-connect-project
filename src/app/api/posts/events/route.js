import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';

// GET /api/posts/events - SSE endpoint for post updates
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

    // Set up Firestore listener
    const unsubscribe = db.collection('posts')
      .where('uid', '==', userId)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const post = {
            id: change.doc.id,
            ...change.doc.data(),
            createdAt: change.doc.data().createdAt?.toDate()?.toISOString(),
            updatedAt: change.doc.data().updatedAt?.toDate()?.toISOString()
          };

          const eventData = {
            type: change.type.toUpperCase(),
            post
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
    console.error('Error in post events:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
} 