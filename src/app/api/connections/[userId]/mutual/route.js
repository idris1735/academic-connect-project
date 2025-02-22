const { NextResponse } = require('next/server');
const { auth, db } = require('@/lib/firebase-admin');
const { handleError } = require('@/lib/error-utils');
const { getUserNameByUid, getProfilePhotoURl } = require('@/lib/utils/user');

export const runtime = 'nodejs';

// GET /api/connections/[userId]/mutual
exports.GET = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const targetUserId = params.userId;

     // Get both users' connections
     const [currentUserDoc, targetUserDoc] = await Promise.all([
      db.collection('users').doc(currentUserId).get(),
      db.collection('users').doc(targetUserId).get()
    ]);

    if (!currentUserDoc.exists || !targetUserDoc.exists) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    const currentUserConnections = currentUserDoc.data().connections?.accepted || [];
    const targetUserConnections = targetUserDoc.data().connections?.accepted || [];

    // Find mutual connections
    const mutualConnectionIds = currentUserConnections.filter(id => 
      targetUserConnections.includes(id)
    );

    // Get full user details for mutual connections
    const mutualConnections = await Promise.all(
      mutualConnectionIds.map(async (uid) => {
        const userDoc = await db.collection('users').doc(uid).get();
        return {
          uid,
          ...userDoc.data()
        };
      })
    );



    return NextResponse.json({
      mutualConnections,
      count: mutualConnections.length
    });

  } catch (error) {
    console.error('Error getting mutual connections:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500, message: 'Failed to get mutual connections',
      error: error.message });
  }
}; 