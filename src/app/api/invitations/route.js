import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { getUserNameByUid } from '@/lib/utils/user';
import { createNotification } from '@/services/notificationService';

export const runtime = 'nodejs';


// POST /api/invitations - Create invitation
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, invitedUsers } = await req.json();
    const senderId = session.user.id;

    // Validate room exists
    const roomRef = db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    // Create invitations in batch
    const batch = db.batch();
    const invitations = [];

    for (const userId of invitedUsers) {
      const invitationRef = db.collection('invitations').doc();
      const invitationData = {
        id: invitationRef.id,
        roomId,
        senderId,
        receiverId: userId,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      batch.set(invitationRef, invitationData);
      invitations.push(invitationData);

      // Create notification for each invited user
      await createNotification(userId, 'ROOM_INVITATION', {
        senderId,
        senderName: await getUserNameByUid(senderId),
        roomId,
        roomName: roomDoc.data().name,
        invitationId: invitationRef.id,
        message: 'invited you to join a research room',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await batch.commit();

    return NextResponse.json({
      message: 'Invitations sent successfully',
      invitations
    });

  } catch (error) {
    console.error('Error creating invitations:', error);
    return NextResponse.json({
      message: 'Failed to create invitations',
      error: error.message
    }, { status: 500 });
  }
} 