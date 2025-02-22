const { NextResponse } = require('next/server');
import { admin, db } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { socketService } from '@/services/socketService';

export const runtime = 'nodejs';
// GET /api/notifications - Get user notifications



export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    // const { searchParams } = new URL(req.url);
    // const limit = parseInt(searchParams.get('limit')) || 20;
    // const page = parseInt(searchParams.get('page')) || 1;
    // const type = searchParams.get('type');

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
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString()
    }));


    return NextResponse.json({
      notifications: notificationList,
      // hasMore: notifications.length === limit,
      // currentPage: page
    });

  } catch (error) {
    console.error('Error getting notifications:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
};

// PUT /api/notifications - Mark notifications as read
export async function PUT(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { notificationId } = await req.json();

    const notificationRef = db.collection('notifications')
    .doc(userId)
    .collection('user_notifications')
    .doc(notificationId);

    await notificationRef.update({
      read: true,
      readAt: new Date()
    });

    return NextResponse.json({
      message: 'Notifications marked as read',
      notificationId
    });

  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500,  message: 'Failed to mark notification as read',
    });
  }
}; 