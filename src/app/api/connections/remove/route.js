import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const uid = session.user.id;
    const { connectionId } = await req.json();

    const connectionRef = db.collection('connections').doc(connectionId);
    
    // Update the connection status
    await connectionRef.update({
      status: 'removed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

      // // Update the connections array in the profiles collection TODO: To be uncommented after testing
    // const currentUserRef = db.collection('profiles').doc(uid);
    // await currentUserRef.update({
    //   connections: admin.firestore.FieldValue.arrayRemove(connectionData.receiverId)
    // });

    // const targetUserRef = db.collection('profiles').doc(connectionData.receiverId);
    // await targetUserRef.update({
    //   connections: admin.firestore.FieldValue.arrayRemove(uid)

    // });

    return NextResponse.json({ 
      message: 'Connection removed successfully' 
    });

  } catch (error) {
    console.error('Error removing connection:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
} 