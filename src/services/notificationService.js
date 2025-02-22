import { admin, db } from '@/lib/firebase-admin';
const socketService = require('@/services/socketService');


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
      // socketService.emitToUser(userId, 'notification', notificationWithDate);
  
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };