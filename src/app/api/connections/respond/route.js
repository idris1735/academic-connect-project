import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { createNotification } from '@/services/notificationService';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { connectionId, accept } = await req.json();
    const currentUserId = session.user.id;

    const connectionRef = db.collection('connections').doc(connectionId);
    const connectionDoc = await connectionRef.get();

    if (!connectionDoc.exists) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    const connectionData = connectionDoc.data();
    if (connectionData.receiverId !== currentUserId) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    const status = accept ? 'accepted' : 'rejected';
    const batch = db.batch();

    // Get both profiles
    const [receiverProfile, senderProfile] = await Promise.all([
      db.collection('profiles').doc(currentUserId).get(),
      db.collection('profiles').doc(connectionData.senderId).get()
    ]);

    if (accept) {
      // Update receiver's profile
      batch.update(receiverProfile.ref, {
        'connections.connected': admin.firestore.FieldValue.arrayUnion(connectionData.senderId),
        'connections.pending.received': admin.firestore.FieldValue.arrayRemove(connectionData.senderId),
        'connectionStats.totalConnections': admin.firestore.FieldValue.increment(1),
        'connectionStats.pendingRequests': admin.firestore.FieldValue.increment(-1)
      });

      // Update sender's profile
      batch.update(senderProfile.ref, {
        'connections.connected': admin.firestore.FieldValue.arrayUnion(currentUserId),
        'connections.pending.sent': admin.firestore.FieldValue.arrayRemove(currentUserId),
        'connectionStats.totalConnections': admin.firestore.FieldValue.increment(1),
        'connectionStats.pendingRequests': admin.firestore.FieldValue.increment(-1)
      });

      // Create notification for acceptance
      await createNotification(connectionData.senderId, 'CONNECTION_ACCEPTED', {
        senderId: currentUserId,
        senderName: receiverProfile.data().displayName || 'A user',
        message: 'accepted your connection request',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      batch.update(receiverProfile.ref, {
        'connections.pending.received': admin.firestore.FieldValue.arrayRemove(connectionData.senderId),
        'connectionStats.pendingRequests': admin.firestore.FieldValue.increment(-1)
      });

      // Update sender's profile
      batch.update(senderProfile.ref, {
        'connections.pending.sent': admin.firestore.FieldValue.arrayRemove(currentUserId),
        'connectionStats.pendingRequests': admin.firestore.FieldValue.increment(-1)
      });

      // // Create notification for acceptance
      // await notificationService.createNotification(connectionData.senderId, 'CONNECTION_REJECTED', {
      //   senderId: currentUserId,
      //   senderName: receiverProfile.data().displayName || 'A user',
      //   message: 'rejectedyour connection request',
      //   timestamp: admin.firestore.FieldValue.serverTimestamp()
      // });

    }

    // Update connection status
    batch.update(connectionRef, {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();

    return NextResponse.json({
      message: `Connection request ${status}`,
      status
    });

  } catch (error) {
    console.error('Error responding to connection request:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500,  message: 'Failed to respond to connection request',
      error: error.message  });
  }
} 