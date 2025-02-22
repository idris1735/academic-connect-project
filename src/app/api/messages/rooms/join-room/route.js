const { NextResponse } = require('next/server');
const { admin } = require('@/lib/firebase-admin');
const { addMembersToChannel } = require('@/lib/chat');

export const runtime = 'nodejs';
exports.POST = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, uid } = await req.json();
    const userId = uid || session.user.id;

    const roomRef = admin.db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();

    if (roomData.participants.includes(userId)) {
      return NextResponse.json({ message: 'User is already a participant' });
    }

    await roomRef.update({
      participants: admin.firestore.FieldValue.arrayUnion(userId),
    });

    const profileRef = admin.db.collection('profiles').doc(userId);
    await profileRef.update({
      'messageRooms.researchRooms': admin.firestore.FieldValue.arrayUnion({
        'room': roomId, 
        'role': 'channel_member'
      })
    });

    try {
      await addMembersToChannel(`research_${roomId}`, [userId]);
    } catch (error) {
      await roomRef.update({
        participants: admin.firestore.FieldValue.arrayRemove(userId),
      });
      await profileRef.update({
        'messageRooms.researchRooms': admin.firestore.FieldValue.arrayRemove({
          'room': roomId, 
          'role': 'channel_member'
        })
      });

      console.error('Error adding members to channel:', error);
      return NextResponse.json({
        message: 'Failed to add members to channel',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({ message: 'User has been added to the discussion room' });

  } catch (error) {
    console.error('Error joining discussion:', error);
    return NextResponse.json({ 
      message: 'Failed to join discussion',
      error: error.message 
    }, { status: 500 });
  }
}; 