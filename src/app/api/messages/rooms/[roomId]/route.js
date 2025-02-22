import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { getUserRoleInRoom } from '@/lib/utils/user';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
// PUT /api/messages/rooms/[roomId]
export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const roomId = params.roomId;
    const userId = session.user.id;
    const { name, description, isPublic, inviteLink } = await req.json();

    const roomRef = db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();

    const userRole = await getUserRoleInRoom(userId, roomId);
    if (!['admin', 'channel_moderator'].includes(userRole)) {
      return NextResponse.json({ message: 'Not authorized to edit room details' }, { status: 403 });
    }

    if (inviteLink) {
      await roomRef.update({ 'inviteLink': inviteLink });
      return NextResponse.json({
        message: 'Room details updated successfully',
      });
    }

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(typeof isPublic !== 'undefined' && { 
        'settings.isPublic': isPublic 
      }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: userId
    };

    await roomRef.update(updateData);

    const updatedRoom = {
      ...roomData,
      ...updateData,
      id: roomId
    };

    return NextResponse.json({
      message: 'Room details updated successfully',
      room: updatedRoom
    });

  } catch (error) {
    console.error('Error updating room details:', error);
    return NextResponse.json({
      message: 'Failed to update room details',
      error: error.message
    }, { status: 500 });
  }
}; 


// DELETE /api/messages/rooms/[roomId]
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const roomId = params.roomId;
    const userId = session.user.id;

    const roomRef = db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();

    const userRole = await getUserRoleInRoom(userId, roomId);
    if (!['admin', 'channel_moderator'].includes(userRole)) {
      return NextResponse.json({ message: 'Not authorized to delete room' }, { status: 403 });
    }

    await roomRef.delete();
    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json({ message: 'Failed to delete room', error: error.message }, { status: 500 });
  }
}