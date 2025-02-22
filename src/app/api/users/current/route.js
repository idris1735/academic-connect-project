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
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    return NextResponse.json({
      user: {
        uid: user.uid,
        displayName: userData.displayName,
        email: userData.email,
        avatar: userData.photoURL,
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json({ 
      message: 'Failed to get current user',
      error: error.message 
    }, { status: 500 });
  }
} 