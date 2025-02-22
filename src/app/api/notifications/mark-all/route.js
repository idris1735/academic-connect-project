const { NextResponse } = require('next/server');
const { admin, db } = require('@/lib/firebase-admin');
const { handleError } = require('@/lib/error-utils');
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
// POST /api/notifications/mark-all - Mark all notifications as read
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

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
    return NextResponse.json({
      message: 'All notifications marked as read',
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500, message: error.message });
  }
}; 