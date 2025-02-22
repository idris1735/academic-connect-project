import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { createNotification } from '@/services/notificationService';

export const runtime = 'nodejs';

// POST /api/connections/[userId]/request
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const requesterId = session.user.id;
    const targetUserId = params.userId;

     // Check profiles exist
     const [senderProfile, receiverProfile] = await Promise.all([
      db.collection('profiles').doc(currentUserId).get(),
      db.collection('profiles').doc(targetUserId).get()
    ]);

    if (!senderProfile.exists || !receiverProfile.exists) {
      return res.status(404).json({ message: 'One or both profiles not found' });
    }


    // Check if the current user has already sent a request to the target user
    const existingSentRequest = await db.collection('connections')
      .where('senderId', '==', currentUserId)
      .where('receiverId', '==', targetUserId)
      .where('status', '==', 'pending')
      .get();

    if (!existingSentRequest.empty) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    // Check if the target user has already sent a request to the current user
    const existingReceivedRequest = await db.collection('connections')
      .where('senderId', '==', targetUserId)
      .where('receiverId', '==', currentUserId)
      .where('status', '==', 'pending')
      .get();

    if (!existingReceivedRequest.empty) {
      return res.status(400).json({ message: 'You have already received a connection request from this user' });
    }

    // Check if the users are already connected
    const existingConnection = await db.collection('connections')
      .where('senderId', 'in', [currentUserId, targetUserId])
      .where('receiverId', 'in', [currentUserId, targetUserId])
      .where('status', '==', 'accepted')
      .get();

    if (!existingConnection.empty) {
      return res.status(400).json({ message: 'You are already connected with this user' });
    }

    // Proceed with creating the connection request
    const connectionRef = db.collection('connections').doc();
    const connectionData = {
      id: connectionRef.id,
      senderId: currentUserId,
      receiverId: targetUserId,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Update sender's profile
    const senderUpdate = {
      'connections.pending.sent': admin.firestore.FieldValue.arrayUnion(targetUserId),
      'connectionStats.pendingRequests': admin.firestore.FieldValue.increment(1)
    };

    // Update receiver's profile
    const receiverUpdate = {
      'connections.pending.received': admin.firestore.FieldValue.arrayUnion(currentUserId),
      'connectionStats.pendingRequests': admin.firestore.FieldValue.increment(1)
    };

    // Perform batch write
    const batch = db.batch();
    batch.set(connectionRef, connectionData);
    batch.update(senderProfile.ref, senderUpdate);
    batch.update(receiverProfile.ref, receiverUpdate);
    await batch.commit();

    // Create notification
    await createNotification(targetUserId, 'CONNECTION_REQUEST', {
      senderId: currentUserId,
      senderName: senderProfile.data().displayName || 'A user',
      message: 'sent you a connection request',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });


    return NextResponse.json({
      message: 'Connection request sent successfully',
      connectionId: connectionRef.id
    });

  } catch (error) {
    console.error('Error sending connection request:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500,  message: 'Failed to send connection request',
      error: error.message });
  }
} 