import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { getUserNameByUid } from '@/lib/utils/user';

export const runtime = 'nodejs';

// GET /api/events/[eventId] - Get event details
export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { eventId } = params;
    // Find the event
    const eventRef = await db.collectionGroup('events').where('id', '==', eventId).get();
        
    if (eventRef.empty) {
        return res.status(404).json({
            message: 'Event not found'
        });
    }

    const eventDoc = eventRef.docs[0];
    const eventData = eventDoc.data();

    // Get creator's name
    const creatorName = await getUserNameByUid(eventData.createdBy);

    // Get attendees' names
    const attendeeNames = await Promise.all(
        eventData.attendees.map(uid => getUserNameByUid(uid))
    );

    return NextResponse.json({
      message: 'Event details retrieved successfully',
      event: {
          ...eventData,
          creatorName,
          attendeeNames
      }
    });

  } catch (error) {
    console.error('Error getting event details:', error);
    return NextResponse.json({
      message: 'Failed to get event details',
      error: error.message
    }, { status: 500 });
  }
}

// PUT /api/events/[eventId] - Update event
export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { eventId } = params;
    const { title, description, date, time } = await req.json();
    const userId = session.user.id;

     // Find the event
     const eventRef = await db.collectionGroup('events').where('id', '==', eventId).get();
        
     if (eventRef.empty) {
         return res.status(404).json({
             message: 'Event not found'
         });
     }

     const eventDoc = eventRef.docs[0];
     const eventData = eventDoc.data();

     // Check if user has permission to update
     if (eventData.createdBy !== userId) {
         return res.status(403).json({
             message: 'Not authorized to update this event'
         });
     }

     // Update the event
     const updateData = {
         ...(title && { title }),
         ...(description && { description }),
         ...(date && { date: admin.firestore.Timestamp.fromDate(new Date(date)) }),
         ...(time && { time }),
         updatedAt: admin.firestore.FieldValue.serverTimestamp()
     };

     await eventDoc.ref.update(updateData);
   return NextResponse.json({
    message: 'Event updated successfully',
    event: {
        ...eventData,
        ...updateData
    }
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({
      message: 'Failed to update event',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE /api/events/[eventId] - Delete event
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { eventId } = params;
    const userId = session.user.id;

    c // Find the event
    const eventRef = await db.collectionGroup('events').where('id', '==', eventId).get();
    
    if (eventRef.empty) {
        return res.status(404).json({
            message: 'Event not found'
        });
    }

    const eventDoc = eventRef.docs[0];
    const eventData = eventDoc.data();

    // Check if user has permission to delete
    if (eventData.createdBy !== userId) {
        return res.status(403).json({
            message: 'Not authorized to delete this event'
        });
    }

    await eventDoc.ref.delete();

    return NextResponse.json({
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({
      message: 'Failed to delete event',
      error: error.message
    }, { status: 500 });
  }
} 