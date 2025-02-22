import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { getUserNameByUid } from '@/lib/utils/user';

export const runtime = 'nodejs';

// GET /api/events/room/[roomId]
export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = params;

    const eventsRef = db.collection('messageRooms').doc(roomId).collection('events');
    const eventsSnapshot = await eventsRef.orderBy('date', 'asc').get();

    const events = await Promise.all(eventsSnapshot.docs.map(async (doc) => {
        const eventData = doc.data();
        const creatorName = await getUserNameByUid(eventData.createdBy);
        
        return {
            id: doc.id,
            ...eventData,
            creatorName
        };
    }));

   
    return NextResponse.json({
      message: 'Events retrieved successfully',
      events
    });
  } catch (error) {
    console.error('Error retrieving events:', error);
    return NextResponse.json({
      message: 'Failed to retrieve events',
      error: error.message
    }, { status: 500 });
  }
}

// POST /api/events/room/[roomId]
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = params;
    const { title, description, date, time } = await req.json();
    const userId = session.user.id;

    if (!title || !date || !time) {
      return NextResponse.json({
        message: 'Missing required fields'
      }, { status: 400 });
    }

    const eventRef = db.collection('messageRooms').doc(roomId).collection('events').doc();
    const eventData = {
      id: eventRef.id,
      title,
      description,
      date: admin.firestore.Timestamp.fromDate(new Date(date)),
      time,
      createdBy: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      attendees: [userId]
    };

    await eventRef.set(eventData);

    const creatorName = await getUserNameByUid(userId);

    return NextResponse.json({
      message: 'Event created successfully',
      event: {
        ...eventData,
        creatorName
      }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({
      message: 'Failed to create event',
      error: error.message
    }, { status: 500 });
  }
} 