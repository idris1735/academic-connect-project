const { db } = require('../config/database');
const socketService = require('./socketService');
const admin = require('firebase-admin');

const NOTIFICATION_TYPES = {
  CONNECTION_REQUEST: 'CONNECTION_REQUEST',
  CONNECTION_ACCEPTED: 'CONNECTION_ACCEPTED',
  POST_LIKE: 'POST_LIKE',
  POST_COMMENT: 'POST_COMMENT',
  DISCUSSION_MENTION: 'DISCUSSION_MENTION',
  WORKFLOW_ASSIGNMENT: 'WORKFLOW_ASSIGNMENT',
  RESEARCH_ROOM_INVITE: 'RESEARCH_ROOM_INVITE',
  PUBLICATION_CITATION: 'PUBLICATION_CITATION',
  COMMENT_LIKE: 'COMMENT_LIKE',
  NEW_CONNECTION: 'NEW_CONNECTION',
  MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
  ROOM_INVITATION: 'ROOM_INVITATION',
  INVITATION_RESPONSE: 'INVITATION_RESPONSE'
};

exports.createNotification = async (userId, type, data) => {
  try {
    const notificationRef = db.collection('notifications')
      .doc(userId)
      .collection('user_notifications')
      .doc();

    const notification = {
      id: notificationRef.id,
      type,
      data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    };

    await notificationRef.set(notification);

    // Convert serverTimestamp to Date for the socket emission
    const notificationWithDate = {
      ...notification,
      createdAt: new Date().toISOString()
    };

    // Emit real-time notification with the ID
    socketService.emitToUser(userId, 'notification', notificationWithDate);

  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.uid;
    const notificationsRef = db.collection('notifications')
      .doc(userId)
      .collection('user_notifications')
      .orderBy('createdAt', 'desc')
      .limit(20);

    const notifications = await notificationsRef.get();
    if (notifications.empty) {
      return res.status(200).json({ notifications: [] });
    }
    
    const notificationList = notifications.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({ notifications: notificationList });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { notificationId } = req.body;

    const notificationRef = db.collection('notifications')
      .doc(userId)
      .collection('user_notifications')
      .doc(notificationId);

    await notificationRef.update({
      read: true,
      readAt: new Date()
    });

    return res.status(200).json({ 
      message: 'Notification marked as read',
      notificationId 
    });
    
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ 
      message: 'Failed to mark notification as read',
      error: error.message 
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.uid;
    const batch = db.batch();

    const notificationsRef = db.collection('notifications')
      .doc(userId)
      .collection('user_notifications')
      .where('read', '==', false);

    const unreadNotifications = await notificationsRef.get();

    unreadNotifications.docs.forEach(doc => {
      batch.update(doc.ref, { 
        read: true,
        readAt: new Date()
      });
    });

    await batch.commit();

    return res.status(200).json({ 
      message: 'All notifications marked as read' 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ 
      message: 'Failed to mark all notifications as read',
      error: error.message 
    });
  }
};