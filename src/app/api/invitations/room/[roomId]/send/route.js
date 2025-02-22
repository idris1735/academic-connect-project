import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { getUserNameByUid } from '@/lib/utils/user';
import { createNotification } from '@/services/notificationService';

export const runtime = 'nodejs';

// POST /api/invitations/respond - Respond to invitation
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = params;
    const { userId } = await req.json();
    const senderId = session.user.uid;

    console.log('Here', roomId, userId, senderId);

    // Check if room exists
    const roomRef = db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({
        message: 'Room not found',
      }, { status: 404 });
    }

    // Check if user is already a member
    const roomData = roomDoc.data();
    if (roomData.participants.includes(userId)) {
        return NextResponse.json({
          message: 'User is already a member',
      }, { status: 400 });
    }

    // Check if invitation already exists
    const existingInvite = await db.collection('invitations')
      .where('roomId', '==', roomId)
      .where('userId', '==', userId)
      .where('status', '==', 'pending')
      .get();

    if (!existingInvite.empty) {
      return NextResponse.json({
        message: 'Invitation already sent',
      }, { status: 400 });
    }

    // Create invitation
    const invitationRef = db.collection('invitations').doc();
    const invitationData = {
      id: invitationRef.id,
      roomId,
      roomName: roomData.name,
      userId,
      senderId,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await invitationRef.set(invitationData);

    // Create notification
    const senderName = await getUserNameByUid(senderId);
    await createNotification(userId, 'ROOM_INVITATION', {
      senderId,
      senderName,
      roomId,
      roomName: roomData.name,
      invitationId: invitationRef.id,
      message: `invited you to join ${roomData.name}`,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    invitationData['senderName'] = senderName;
    invitationData['userName'] = await getUserNameByUid(invitationData.userId);
    invitationData['createdAt'] = 'Just now'



    return NextResponse.json({
      message: 'Invitation sent successfully',
      invitation: invitationData
    });

  } catch (error) {
    console.error('Error responding to invitation:', error);
    return NextResponse.json({
      message: 'Failed to respond to invitation',
      error: error.message
    }, { status: 500 });
  }
} 