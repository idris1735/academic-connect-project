import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { getUserRoleInRoom } from '@/lib/utils/user';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
// PUT /api/messages/rooms/[roomId]/settings
export async function PUT(req, { params }) {
  try { 
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const roomId = params.roomId;
    const userId = session.user.id;
    const {
      fileSharingEnabled,
      messageRetention,
      readReceipts,
      typingIndicators,
      notificationSettings,
      canParticipantsAdd,
      canParticipantsRemove,
      disableInviteLinks,
      disableInvitations,
      joinSettings
    } = await req.json();

    const roomRef = db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    const userRole = await getUserRoleInRoom(userId, roomId);
    if (!['admin', 'channel_moderator'].includes(userRole)) {
      return NextResponse.json({ message: 'Not authorized to edit room settings' }, { status: 403 });
    }

    const updateData = {
      ...(typeof fileSharingEnabled !== 'undefined' && { 
        fileSharingEnabled 
      }),
      ...(messageRetention && { 
        messageRetention 
      }),
      ...(typeof readReceipts !== 'undefined' && { 
        'features.readReceipts': readReceipts 
      }),
      ...(typeof typingIndicators !== 'undefined' && { 
        'features.typingIndicators': typingIndicators 
      }),
      ...(notificationSettings && { 
        notificationSettings 
      }),
      ...(typeof canParticipantsAdd !== 'undefined' && { 
        'settings.canParticipantsAdd': canParticipantsAdd 
      }),
      ...(typeof canParticipantsRemove !== 'undefined' && { 
        'settings.canParticipantsRemove': canParticipantsRemove 
      }),
      ...(typeof disableInviteLinks !== 'undefined' && {
        'settings.disableInviteLinks': disableInviteLinks
      }),
      ...(typeof disableInvitations !== 'undefined' && {
        'settings.disableInvitations': disableInvitations
      }),
      ...(typeof joinSettings !== 'undefined' && {
        'settings.joinSettings': joinSettings
      }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: userId
    };

    await roomRef.update(updateData);

    return NextResponse.json({
      message: 'Room settings updated successfully',
      settings: updateData
    });

  } catch (error) {
    console.error('Error updating room settings:', error);
    return NextResponse.json({
      message: 'Failed to update room settings',
      error: error.message
    }, { status: 500 });
  }
}; 