const { NextResponse } = require('next/server');
const { admin } = require('@/lib/firebase-admin');
const { getUserRoleInRoom } = require('@/lib/utils/user');

export const runtime = 'nodejs';
// PUT /api/messages/rooms/[roomId]/members/[memberId]/role
exports.PUT = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, memberId } = params;
    const userId = session.user.id;
    const { newRole } = await req.json();

    const validRoles = ['channel_member', 'channel_moderator', 'admin'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ 
        message: 'Invalid role. Must be one of: ' + validRoles.join(', ') 
      }, { status: 400 });
    }

    const roomRef = admin.db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    const userRole = await getUserRoleInRoom(userId, roomId);
    if (!['admin', 'channel_moderator'].includes(userRole)) {
      return NextResponse.json({ message: 'Not authorized to change member roles' }, { status: 403 });
    }

    const memberProfileRef = admin.db.collection('profiles').doc(memberId);
    const memberProfile = await memberProfileRef.get();

    if (!memberProfile.exists) {
      return NextResponse.json({ message: 'Member profile not found' }, { status: 404 });
    }

    await memberProfileRef.update({
      'messageRooms.researchRooms': admin.firestore.FieldValue.arrayRemove({
        room: roomId,
        role: await getUserRoleInRoom(memberId, roomId)
      })
    });

    await memberProfileRef.update({
      'messageRooms.researchRooms': admin.firestore.FieldValue.arrayUnion({
        room: roomId,
        role: newRole
      })
    });

    return NextResponse.json({
      message: 'Member role updated successfully',
      memberId,
      newRole
    });

  } catch (error) {
    console.error('Error updating member role:', error);
    return NextResponse.json({
      message: 'Failed to update member role',
      error: error.message
    }, { status: 500 });
  }
}; 