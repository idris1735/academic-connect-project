const { NextResponse } = require('next/server');
const { auth, db } = require('@/lib/firebase-admin');
const { handleError } = require('@/lib/error-utils');

export const runtime = 'nodejs';
// GET /api/connections/[userId]/status
exports.GET = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const targetUserId = params.userId;

    const userSnapshot = await db.collection('profiles')
      .where('pid', '==', currentUserId)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const connections = userData.connections || {};

    // Check if the target user is in the accepted connections
    const isConnected = connections.connected?.includes(targetUserId);
    
    // Check for pending requests sent by the current user to the target user
    const pendingRequestsSent = await db.collection('connections')
      .where('senderId', '==', currentUserId)
      .where('receiverId', '==', targetUserId)
      .where('status', '==', 'pending')
      .get();

    const isPendingSent = !pendingRequestsSent.empty;

    // Check for pending requests received by the current user from the target user
    const pendingRequestsReceived = await db.collection('connections')
      .where('senderId', '==', targetUserId)
      .where('receiverId', '==', currentUserId)
      .where('status', '==', 'pending')
      .get();

    const isPendingReceived = !pendingRequestsReceived.empty;

    return NextResponse.json({ 
      connected: isConnected || false, // Ensure it returns false if undefined
      pendingSent: isPendingSent, // Return if the current user has sent a request
      pendingReceived: isPendingReceived
     });

  } catch (error) {
    console.error('Error getting connection status:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500, message: 'Failed to get connection status',
      error: error.message  });
  }
}; 