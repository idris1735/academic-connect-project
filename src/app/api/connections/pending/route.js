const { NextResponse } = require('next/server');
import { db } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
const { handleError } = require('@/lib/error-utils');
const { getUserNameByUid, getProfilePhotoURl } = require('@/lib/utils/user');

export const runtime = 'nodejs';
// GET /api/connections/pending
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
      
    const userDoc = await db.collection('profiles').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const pendingReceived = userData.connections?.pending?.received || [];
    const pendingSent = userData.connections?.pending?.sent || [];

    // Get full user details for received pending requests
    const receivedRequests = await Promise.all(
      pendingReceived.map(async (senderId) => {
        const senderDoc = await db.collection('users').doc(senderId).get();
        const connectionDoc = await db.collection('connections')
          .where('senderId', '==', senderId)
          .where('receiverId', '==', userId)
          .where('status', '==', 'pending')
          .get();

        const connectionData = connectionDoc.empty ? null : connectionDoc.docs[0].data(); // Get the connection data

        return {
          uid: senderId,
          ...senderDoc.data(),
          connectionId: connectionDoc.empty ? null : connectionDoc.docs[0].id, // Include connection ID
          connectionData, // Include connection data
          requestType: 'received'
        };
      })
    );

    // Get full user details for sent pending requests
    const sentRequests = await Promise.all(
      pendingSent.map(async (receiverId) => {
        const receiverDoc = await db.collection('users').doc(receiverId).get();
        const connectionDoc = await db.collection('connections')
          .where('senderId', '==', userId)
          .where('receiverId', '==', receiverId)
          .where('status', '==', 'pending')
          .get();

        const connectionData = connectionDoc.empty ? null : connectionDoc.docs[0].data(); // Get the connection data

        return {
          uid: receiverId,
          ...receiverDoc.data(),
          connectionId: connectionDoc.empty ? null : connectionDoc.docs[0].id, // Include connection ID
          connectionData, // Include connection data
          requestType: 'sent'
        };
      })
    );


    return NextResponse.json({
        received: receivedRequests,
      sent: sentRequests
    });

  } catch (error) {
    console.error('Error getting pending requests:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500,  message: 'Failed to get pending requests',
      error: error.message
    });
  }
}; 