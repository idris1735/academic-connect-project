const { db } = require('../config/database');
const { admin } = require('../config/firebase');
const { getUserNameByUid } = require('../utils/user');
const notificationService = require('./notificationService');

exports.sendInvitation = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;
    const senderId = req.user.uid;

    console.log('Here', roomId, userId, senderId);

    // Check if room exists
    const roomRef = db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is already a member
    const roomData = roomDoc.data();
    if (roomData.participants.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Check if invitation already exists
    const existingInvite = await db.collection('invitations')
      .where('roomId', '==', roomId)
      .where('userId', '==', userId)
      .where('status', '==', 'pending')
      .get();

    if (!existingInvite.empty) {
      return res.status(400).json({ message: 'Invitation already sent' });
    }

    // Create invitation
    const invitationRef = db.collection('invitations').doc();
    const invitationData = {
      id: invitationRef.id,
      roomId,
      roomName: roomData.name,
      userId,
      senderId,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await invitationRef.set(invitationData);

    // Create notification
    const senderName = await getUserNameByUid(senderId);
    await notificationService.createNotification(userId, 'ROOM_INVITATION', {
      senderId,
      senderName,
      roomId,
      roomName: roomData.name,
      invitationId: invitationRef.id,
      message: `invited you to join ${roomData.name}`,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    invitationData['senderName'] = senderName;
    invitationData['userName'] = await getUserNameByUid(invitationData.userId);
    invitationData['createdAt'] = 'Just now'



    return res.status(200).json({
      message: 'Invitation sent successfully',
      invitation: invitationData
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return res.status(500).json({
      message: 'Failed to send invitation',
      error: error.message
    });
  }
};

exports.getReceivedInvitations = async (req, res) => {
  try {
    const userId = req.user.uid;

    const invitationsSnapshot = await db.collection('invitations')
      .where('userId', '==', userId)
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();

    const invitations = await Promise.all(invitationsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const senderName = await getUserNameByUid(data.senderId);
      return {
        ...data,
        senderName,
        createdAt: data.createdAt?.toDate().toISOString()
      };
    }));

    return res.status(200).json({
      message: 'Invitations retrieved successfully',
      invitations
    });
  } catch (error) {
    console.error('Error getting invitations:', error);
    return res.status(500).json({
      message: 'Failed to get invitations',
      error: error.message
    });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { response } = req.body; // 'accept' or 'reject'
    const userId = req.user.uid;

    const invitationRef = db.collection('invitations').doc(invitationId);
    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    const invitationData = invitationDoc.data();

    if (invitationData.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (invitationData.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation already processed' });
    }

    if (response === 'accept') {
      // Add user to room members
      const roomRef = db.collection('messageRooms').doc(invitationData.roomId);
      await roomRef.update({
        members: admin.firestore.FieldValue.arrayUnion(userId)
      });
    }

    // Update invitation status
    await invitationRef.update({
      status: response,
      respondedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Notify sender
    await notificationService.createNotification(invitationData.senderId, 'INVITATION_RESPONSE', {
      userId,
      userName: await getUserNameByUid(userId),
      roomId: invitationData.roomId,
      roomName: invitationData.roomName,
      response,
      message: `${response}ed your invitation to ${invitationData.roomName}`,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      message: `Invitation ${response}ed successfully`
    });
  } catch (error) {
    console.error('Error responding to invitation:', error);
    return res.status(500).json({
      message: 'Failed to respond to invitation',
      error: error.message
    });
  }
};

exports.getRoomInvitations = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const invitationsSnapshot = await db.collection('invitations')
      .where('roomId', '==', roomId)
      .orderBy('createdAt', 'desc')
      .get();

    const invitations = await Promise.all(invitationsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      return {
        ...data,
        userName: await getUserNameByUid(data.userId),
        senderName: await getUserNameByUid(data.senderId),
        createdAt: data.createdAt?.toDate().toISOString()
      };
    }));

    return res.status(200).json({
      message: 'Room invitations retrieved successfully',
      invitations: invitations || []
    });
  } catch (error) {
    console.error('Error getting room invitations:', error);
    return res.status(500).json({
      message: 'Failed to get room invitations',
      error: error.message,
      invitations: []
    });
  }
};

exports.cancelInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.uid;

    const invitationRef = db.collection('invitations').doc(invitationId);
    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitationDoc.data().senderId !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this invitation' });
    }

    // Update status to cancelled instead of deleting
    await invitationRef.update({
      status: 'cancelled',
      cancelledAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ message: 'Invitation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    return res.status(500).json({
      message: 'Failed to cancel invitation',
      error: error.message
    });
  }
};

exports.resendInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.uid;

    const invitationRef = db.collection('invitations').doc(invitationId);
    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    const invitationData = invitationDoc.data();

    if (invitationData.senderId !== userId) {
      return res.status(403).json({ message: 'Not authorized to resend this invitation' });
    }

    // Check if invitation already exists
    const existingInvite = await db.collection('invitations')
      .where('roomId', '==', invitationData.roomId)
      .where('userId', '==', invitationData.userId)
      .where('status', '==', 'pending')
      .get();

    if (!existingInvite.empty && invitationData.status === 'cancelled') {
      return res.status(400).json({ message: 'Invitation already sent' });
    }


    if (invitationData.status === 'cancelled') {
      await invitationRef.update({ status: 'pending' });
    }

    // Create new notification
    await notificationService.createNotification(invitationData.userId, 'ROOM_INVITATION', {
      senderId: userId,
      senderName: await getUserNameByUid(userId),
      roomId: invitationData.roomId,
      roomName: invitationData.roomName,
      invitationId,
      message: `invited you to join ${invitationData.roomName} (resent)`,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ message: 'Invitation resent successfully' });
  } catch (error) {
    console.error('Error resending invitation:', error);
    return res.status(500).json({
      message: 'Failed to resend invitation',
      error: error.message
    });
  }
};

// Add new endpoint to delete invitation
exports.deleteInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.uid;

    const invitationRef = db.collection('invitations').doc(invitationId);
    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitationDoc.data().senderId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this invitation' });
    }

    await invitationRef.delete();

    return res.status(200).json({ message: 'Invitation deleted successfully' });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return res.status(500).json({
      message: 'Failed to delete invitation',
      error: error.message
    });
  }
};
