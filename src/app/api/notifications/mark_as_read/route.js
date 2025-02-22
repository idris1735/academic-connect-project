const { NextResponse } = require('next/server');
const { admin, db } = require('@/lib/firebase-admin');
const { handleError } = require('@/lib/error-utils');
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
// POST /api/notifications/mark_as_read - Mark all notifications as read
export async function POST(req) {
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
      message: 'Notification marked as read',
      notificationId
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500, message: error.message });
  }
}; 