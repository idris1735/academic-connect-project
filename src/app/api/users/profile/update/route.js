import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { verifySession } from '@/lib/session';

export const runtime = 'nodejs';

export async function PUT(req) {
  try {
    const session = req.cookies.get('session');
    const user = await verifySession(session?.value);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await req.json();
    const profileRef = db.collection('profiles').doc(user.uid);

    await profileRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ 
      message: 'Failed to update profile',
      error: error.message 
    }, { status: 500 });
  }
} 