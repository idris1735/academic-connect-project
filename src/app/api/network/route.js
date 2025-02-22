import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';
// GET /api/network - Get network info


export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || false;
    const userID = searchParams.get('pid') || session.user.id;

    
    let profileRef= db.collection('profiles').doc(userID)
    let profileDoc = await profileRef.get()
    if (!profileDoc.exists) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }
    let profileData = profileDoc.data()

    // query publications
    let publications = await db.collection('publications').where('userId', '==', userID).get()
    let publicationCount = publications.docs.length
    if (!status) {
      let connections = profileData?.connections?.connected || []
      let researchRooms = profileData?.messageRooms?.researchRooms || []
      let connectionCount = profileData?.connectionStats?.totalConnections || 0
      let received = profileData?.connections?.received || []
      let sent = profileData?.connections?.sent || []
      let connectionData = {
        connections,
        connectionCount,
        researchRooms,
        publicationCount
      }

      return NextResponse.json({ 
        message: 'Network data retrieved successfully',
        connectionData 
      });
    }

  } catch (error) {
    console.error('Error getting network info:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 