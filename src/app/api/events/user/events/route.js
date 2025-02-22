import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { getUserNameByUid } from '@/lib/utils/user';

export const runtime = 'nodejs';

// GET /api/events/user/events - Get user's events
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    
    // Get all events where user is an attendee
    const eventsRef = await db.collectionGroup('events')
        .where('attendees', 'array-contains', userId)
        .orderBy('date', 'asc')
        .get();

    const events = await Promise.all(eventsRef.docs.map(async (doc) => {
        const eventData = doc.data();
        const creatorName = await getUserNameByUid(eventData.createdBy);
        eventData.date = eventData.date.toDate().toISOString() || null;
        
        return {
            ...eventData,
            creatorName
        };
    }));
    return res.status(200).json({
      message: 'User events retrieved successfully',
      events
  });

  } catch (error) {
    console.error('Error retrieving user events:', error);
    return NextResponse.json({
      message: 'Failed to retrieve user events',
      error: error.message
    }, { status: 500 });
  }
} 