const db = require('../config/database');

exports.createNotification = async (userId, notification) => {
  try {
    const notificationRef = db.collection('notifications').doc(userId).collection('user_notifications');
    await notificationRef.add({
      ...notification,
      createdAt: new Date(),
      read: false
    });
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

    await db.collection('notifications')
      .doc(userId)
      .collection('user_notifications')
      .doc(notificationId)
      .update({ read: true });

    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};