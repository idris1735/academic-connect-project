const { NextResponse } = require('next/server');
const { admin, db } = require('@/lib/firebase-admin');
const { auth } = require('@/lib/auth');
const { handleError } = require('@/lib/error-utils');
const { getUserNameByUid, getProfilePhotoURl } = require('@/lib/utils/user');

export const runtime = 'nodejs';

// GET /api/connections - Get user's connections
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
     // Query the profile 
     const userProfile = await db.collection('profiles').doc(userId).get();

     if (!userProfile.exists) {
       return res.status(404).json({ message: 'User not found' });
     }
 
     const userConnections = userProfile.data().connections.connected || [];
 
     // Get the connections names and profile pictures URL from the profile
     const connections = await Promise.all(
       userConnections.map(async (connectId) => {
         const connection = await db.collection('profiles').doc(connectId).get();
 
         if (!connection.exists) {
           return null; // Return null for non-existing connections
         }
 
         const connectionData = connection.data();
 
        
         // Get the connectionDocID from the db collections
         const connectionDocsSender = await db.collection('connections')
           .where('senderId', '==', userId)
           .where('receiverId', '==', connectId)
           .where('status', '==', 'accepted') // Ensure status is accepted
           .get();
 
         // Query for connections where the user is the receiver
         const connectionDocsReceiver = await db.collection('connections')
           .where('senderId', '==', connectId)
           .where('receiverId', '==', userId)
           .where('status', '==', 'accepted') // Ensure status is accepted
           .get();
 
          // Combine results from both queries
          const connectionDocs = [...connectionDocsSender.docs, ...connectionDocsReceiver.docs];
          console.log('connections', connectionDocs.length);
 
          if (connectionDocs.length === 0) {
           return null; // Return null if no connections found
         }
 
         // Assuming there's at least one document that matches the criteria
         const connectionId = connectionDocs[0].id; // Get the first matching document ID
 
         return {
           ...connectionData,
           connectionId,
           userId: connectId,
           photoURL: connectionData.photoURL,
           displayName: connectionData.displayName,
           role: connectionData.occupation,
           university: connectionData.institution || '',
         };
       })
     );
 
     // Filter out any null values (non-existing connections)
     const validConnections = connections.filter(conn => conn !== null);
     console.log('validConnections', validConnections);

    return NextResponse.json({
      validConnections
    });

  } catch (error) {
    console.error('Error getting connections:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500, message: 'Error loading connections' });
  }
} 