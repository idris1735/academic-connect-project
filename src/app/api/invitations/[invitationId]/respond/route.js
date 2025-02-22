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

    const { response } = await req.json();
    const { invitationId } = params;
    const userId = session.user.id;

    const invitationRef = db.collection('invitations').doc(invitationId);
    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return NextResponse.json({
        message: 'Invitation not found',
      }, { status: 404 });
    }

    const invitationData = invitationDoc.data();

    if (invitationData.userId !== userId) {
      return NextResponse.json({
        message: 'Not authorized',
      }, { status: 403 });
    }

    if (invitationData.status !== 'pending') {
      return NextResponse.json({
        message: 'Invitation already processed',
      }, { status: 400 });
    }

    if (response === 'accept') {
      // Add user to room members
      const roomRef = db.collection('messageRooms').doc(invitationData.roomId);
      await roomRef.update({
        members: admin.firestore.FieldValue.arrayUnion(userId)
      });
    }

    // Update invitation status
    await invitationRef.update({
      status: response,
      respondedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Notify sender
    await reateNotification(invitationData.senderId, 'INVITATION_RESPONSE', {
      userId,
      userName: await getUserNameByUid(userId),
      roomId: invitationData.roomId,
      roomName: invitationData.roomName,
      response,
      message: `${response}ed your invitation to ${invitationData.roomName}`,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({
      message: `Invitation ${response}ed successfully`
    });

  } catch (error) {
    console.error('Error responding to invitation:', error);
    return NextResponse.json({
      message: 'Failed to respond to invitation',
      error: error.message
    }, { status: 500 });
  }
} 