import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { verifySession } from '@/lib/session';

export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const session = req.cookies.get('session');
    const user = await verifySession(session?.value);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userDoc = await db.collection('profiles').doc(user.uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const profile = {
      name: userData.displayName || '',
      title: userData.occupation || 'Research Assistant',
      views: userData.profileViews || 0,
      connections: userData.connectionStats?.totalConnections,
      pendingRequests: userData.connectionStats?.pendingRequests || 0,
      photoURL: userData.photoURL || '',
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json({ 
      message: 'Failed to get profile',
      error: error.message 
    }, { status: 500 });
  }
} 