import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { getUserNameByUid } from '@/lib/utils/user';

export const runtime = 'nodejs';

// GET /api/invitations/received - Get received invitations
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

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

   
    return NextResponse.json({
      message: 'Invitations retrieved successfully',
      invitations
    });

  } catch (error) {
    console.error('Error getting received invitations:', error);
    return NextResponse.json({
      message: 'Failed to get received invitations',
      error: error.message
    }, { status: 500 });
  }
} 