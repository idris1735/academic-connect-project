const { NextResponse } = require('next/server');
const { admin } = require('@/lib/firebase-admin');
const { getUserRoleInRoom, getUserNameByUid, getProfilePhotoURl } = require('@/lib/utils/user');

export const runtime = 'nodejs';

// GET /api/messages/rooms/[roomId]/members - Get room members
exports.GET = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = params;
    const roomRef = admin.db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();
    const members = await Promise.all(
      roomData.participants.map(async (uid) => ({
        uid,
        displayName: await getUserNameByUid(uid),
        photoURL: await getProfilePhotoURl(uid),
        role: await getUserRoleInRoom(uid, roomId)
      }))
    );

    return NextResponse.json({ members });

  } catch (error) {
    console.error('Error getting room members:', error);
    return NextResponse.json({
      message: 'Failed to get room members',
      error: error.message
    }, { status: 500 });
  }
};

// DELETE /api/messages/rooms/[roomId]/members - Remove member or leave room
exports.DELETE = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = params;
    const { memberId } = await req.json();
    const userId = session.user.id;
    const isLeaving = !memberId || memberId === userId;

    const roomRef = admin.db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();
    const userRole = await getUserRoleInRoom(userId, roomId);

    // Check permissions for removing others
    if (!isLeaving && !['admin', 'channel_moderator'].includes(userRole)) {
      return NextResponse.json({ message: 'Not authorized to remove members' }, { status: 403 });
    }

    const targetId = isLeaving ? userId : memberId;
    const targetRole = await getUserRoleInRoom(targetId, roomId);

    // Prevent removing admins
    if (!isLeaving && targetRole === 'admin') {
      return NextResponse.json({ message: 'Cannot remove an admin' }, { status: 403 });
    }

    // Update room participants
    await roomRef.update({
      participants: admin.firestore.FieldValue.arrayRemove(targetId)
    });

    // Update user profile
    const userProfileRef = admin.db.collection('profiles').doc(targetId);
    await userProfileRef.update({
      'messageRooms.researchRooms': admin.firestore.FieldValue.arrayRemove({
        room: roomId,
        role: targetRole
      })
    });

    return NextResponse.json({
      message: isLeaving ? 'Successfully left the room' : 'Member removed successfully'
    });

  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({
      message: 'Failed to remove member',
      error: error.message
    }, { status: 500 });
  }
}; 