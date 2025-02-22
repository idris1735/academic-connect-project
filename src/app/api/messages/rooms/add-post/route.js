const { NextResponse } = require('next/server');
const { admin } = require('@/lib/firebase-admin');

export const runtime = 'nodejs';
exports.POST = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, postId } = await req.json();
    const userId = session.user.id;

    const roomRef = admin.db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    const roomData = roomDoc.data();

    if (roomData.roomType !== 'RR') {
      return NextResponse.json({ message: 'Only research rooms can be linked to posts' }, { status: 400 });
    }

    if (!roomData.participants.includes(userId)) {
      return NextResponse.json({ message: 'Not authorized to modify this room' }, { status: 403 });
    }

    await roomRef.update({
      postIds: admin.firestore.FieldValue.arrayUnion(postId)
    });

    const postRef = admin.db.collection('posts').doc(postId);
    await postRef.update({
      discussion: {
        id: roomId,
        type: 'RR'
      }
    });

    return NextResponse.json({
      message: 'Post successfully linked to research room',
      roomId,
      postId
    });

  } catch (error) {
    console.error('Error adding post to room:', error);
    return NextResponse.json({ 
      message: 'Failed to add post to room', 
      error: error.message 
    }, { status: 500 });
  }
}; 