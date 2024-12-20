const { db } = require('../config/database');
const { admin } = require('../config/firebase');
const notificationService = require('./notificationService');

exports.connectWithUser = async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    const targetUserId = req.params.userId;

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
    await notificationService.createNotification(targetUserId, 'CONNECTION_REQUEST', {
      senderId: currentUserId,
      senderName: senderProfile.data().displayName || 'A user',
      message: 'sent you a connection request',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      message: 'Connection request sent',
      connectionId: connectionRef.id
    });

  } catch (error) {
    console.error('Error sending connection request:', error);
    return res.status(500).json({
      message: 'Failed to send connection request',
      error: error.message
    });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    const { connectionId } = req.body;
    const { accept } = req.body;

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
      await notificationService.createNotification(connectionData.senderId, 'CONNECTION_ACCEPTED', {
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

    return res.status(200).json({
      message: `Connection request ${status}`,
      status
    });

  } catch (error) {
    console.error('Error responding to connection request:', error);
    return res.status(500).json({
      message: 'Failed to respond to connection request',
      error: error.message
    });
  }
};

exports.getConnectionStatus = async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    const targetUserId = req.params.userId;

    const userSnapshot = await db.collection('users')
      .where('uid', '==', currentUserId)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const connections = userData.connections || {};

    // Check if the target user is in the accepted connections
    const isConnected = connections.accepted?.includes(targetUserId);
    
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

    return res.status(200).json({ 
      connected: isConnected || false, // Ensure it returns false if undefined
      pendingSent: isPendingSent, // Return if the current user has sent a request
      pendingReceived: isPendingReceived // Return if the current user has received a request
    });

  } catch (error) {
    console.error('Error getting connection status:', error);
    return res.status(500).json({ 
      message: 'Failed to get connection status',
      error: error.message 
    });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const userDoc = await db.collection('profiles').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
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

    return res.status(200).json({
      received: receivedRequests,
      sent: sentRequests
    });
    } catch (error) {
    console.error('Error getting pending requests:', error);
    return res.status(500).json({
      message: 'Failed to get pending requests',
      error: error.message
    });
  }
};

exports.getMutualConnections = async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    const targetUserId = req.params.userId;

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

    return res.status(200).json({
      mutualConnections,
      count: mutualConnections.length
    });

  } catch (error) {
    console.error('Error getting mutual connections:', error);
    return res.status(500).json({
      message: 'Failed to get mutual connections',
      error: error.message
    });
  }
};
