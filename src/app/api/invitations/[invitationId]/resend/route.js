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

    const { invitationId } = params;
    const userId = session.user.uid;

    const invitationRef = db.collection('invitations').doc(invitationId);
    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return NextResponse.json({
        message: 'Invitation not found',
      }, { status: 404 });
    }

    const invitationData = invitationDoc.data();

    if (invitationData.senderId !== userId) {
      return NextResponse.json({
        message: 'Not authorized to resend this invitation',
      }, { status: 403 });
    }

    // Check if invitation already exists
    const existingInvite = await db.collection('invitations')
      .where('roomId', '==', invitationData.roomId)
      .where('userId', '==', invitationData.userId)
      .where('status', '==', 'pending')
      .get();

    if (!existingInvite.empty && invitationData.status === 'cancelled') {
      return NextResponse.json({
        message: 'Invitation already sent',
      }, { status: 400 });
    }


    if (invitationData.status === 'cancelled') {
      await invitationRef.update({ status: 'pending' });
    }

    // Create new notification
    await createNotification(invitationData.userId, 'ROOM_INVITATION', {
      senderId: userId,
      senderName: await getUserNameByUid(userId),
      roomId: invitationData.roomId,
      roomName: invitationData.roomName,
      invitationId,
      message: `invited you to join ${invitationData.roomName} (resent)`,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });


    return NextResponse.json({
      message: 'Invitation resent successfully'
    });

  } catch (error) {
    console.error('Error responding to invitation:', error);
    return NextResponse.json({
      message: 'Failed to resend invitation',
      error: error.message
    }, { status: 500 });
  }
} 