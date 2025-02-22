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

    const photoURL = await db.collection('profiles')
      .doc(user.uid)
      .get()
      .then(doc => doc.data()?.photoURL);

    if (!photoURL) {
      return NextResponse.json({ message: 'Profile photo not found' }, { status: 404 });
    }

    return NextResponse.json({ photoURL });
  } catch (error) {
    console.error('Error getting profile photo URL:', error);
    return NextResponse.json({ 
      message: 'Failed to get profile photo URL',
      error: error.message 
    }, { status: 500 });
  }
} 