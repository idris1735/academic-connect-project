const { db } = require('../config/database');
const { createNotification } = require('./notificationService');

exports.sendConnectionRequest = async (req, res) => {
    try {
      const uid = req.user.uid;
      const { connectionId } = req.body;
  
      const connectionRef = db.collection('connections').doc(uid).collection('connection_requests').doc(connectionId);
      const data = {
          connectionId,
          connectedAt: new Date(), // Timestamp of when the follow happened
          status: "sent"
      };
      await connectionRef.set(data);
  
      // Send a connection request  to the connectionId
  
      const connectionRequestRef = db.collection('connections').doc(connectionId).collection('connection_requests').doc(uid);
      const connectionRequestData = {
        connectionId: uid,
        sentAt: new Date(),
        status: "received"
      };
      await connectionRequestRef.set(connectionRequestData);
  
      // Create notification for the recipient
      await createNotification(connectionId, {
        type: 'CONNECTION_REQUEST',
        message: `${req.user.displayName} sent you a connection request`,
        actionUrl: '/network',
        sender: {
          id: req.user.uid,
          name: req.user.displayName,
          photoURL: req.user.photoURL
        }
      });
  
      return res.status(200).json({ message: 'Connection request sent successfully' });
    } catch (error) {
      // delete the connection request from the uid
      await connectionRef.delete();
      await connectionRequestRef.delete();
      console.error('Error adding connection:', error);
      return res.status(500).json({ message: 'Failed to add connection' });
    }
  }
  
  // exports.rejectConnectionRequest = async (req, res) => {
  //   try { 
  //     const uid = req.user.uid;
  //     const { connectionId } = req.body;
  
  //     const connectionRef = db.collection('connections').doc(uid).collection('connection_requests').doc(connectionId);
  //     await connectionRef.delete();
  
  //     const connectionRequestRef = db.collection('connections').doc(connectionId).collection('connection_requests').doc(uid);
  //     await connectionRequestRef.update({
  //       status: "rejected"
  //     });
  
  //     return res.status(200).json({ message: 'Connection request rejected successfully' });
  //   } catch (error) {
  //     console.error('Error rejecting connection request:', error);
  //     return res.status(500).json({ message: 'Failed to reject connection request' });
  //   }
  // }
  
  // exports.acceptConnectionRequest = async (req, res) => {
  //   try { 
  //     const uid = req.user.uid;
  //     const { connectionId } = req.body;
  
  //     const connectionRef = db.collection('connections').doc(connectionId).collection('connection_requests').doc(uid);
  //     await connectionRef.delete();
  
  //     // Add to connected collection
  //     const connectedRef = db.collection('connections').doc(uid).collection('connected').doc(connectionId);
  //     await connectedRef.set({
  //       connectedAt: new Date(),
  //       status: "connected"
  //     });
      
  //     const sec_connectedRef = db.collection('connections').doc(uid).collection('connected').doc(connectionId);
  //     await sec_connectedRef.set({
  //       connectedAt: new Date(),
  //       status: "connected"
  //     });
  
  //     return res.status(200).json({ message: 'Connection request accepted successfully' });
  //   } catch (error) {
  //     // delete the connection request from the uid
  //     await connectionRef.delete();
  //     await sec_connectedRef.delete();
  //     console.error('Error accepting connection request:', error);
  //     return res.status(500).json({ message: 'Failed to accept connection request' });
  //   }
  // }
  
  exports.removeConnection = async (req, res) => {
    try {
      const uid = req.user.uid;
      const { connectionId } = req.body;
  
      const connectionRef = db.collection('connections').doc(uid).collection('connected').doc(connectionId);
      if (await connectionRef.get()) {
        await connectionRef.delete();
      }

      const sec_connectionRef = db.collection('connections').doc(connectionId).collection('connected').doc(uid);
      if (await sec_connectionRef.get()) {
        await sec_connectionRef.delete();
      }
  
      return res.status(200).json({ message: 'Connection removed successfully' });
    } catch (error) {

      console.error('Error removing connection:', error);

      return res.status(500).json({ message: 'Failed to remove connection' });
    }
}

exports.getNetworkInfo = async (req, res) => {
  try {
    const status = req.query.status || false;
    // const uid = req.user.uid;
    const userID = req.params.pid || req.user.uid;


    let profileRef= db.collection('profiles').doc(userID)
    let profileDoc = await profileRef.get()
    if (!profileDoc.exists) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    let profileData = profileDoc.data()

    // query publications
    let publications = await db.collection('publications').where('userId', '==', userID).get()
    let publicationCount = publications.docs.length
    if (!status) {
      let connections = profileData?.connections?.connected
      let researchRooms = profileData?.messageRooms?.researchRooms
      let connectionCount = profileData?.connectionStats?.totalConnections
      // let publicationCount = profileData?.publications?.length
      let connectionData = {
        connections,
        connectionCount,
        researchRooms,
        publicationCount
      }

      // data = {
      //   connectionData,
      //   connections,
      // }

      return res.status(200).json({ connectionData });
    }

    // if (status === 'connected') {
    //   connectionsRef = db.collection('connections').doc(uid).collection('connected');
    // } else if (status === 'sent') {
    //   connectionsRef = db.collection('connections').doc(uid).collection('connection_requests')
    //     .where('status', '==', 'sent');
    // } else if (status === 'received') {
    //   connectionsRef = db.collection('connections').doc(uid).collection('connection_requests')
    //     .where('status', '==', 'received');
    // } else if (status === 'rejected') {
    //   connectionsRef = db.collection('connections').doc(uid).collection('connection_requests')
    //     .where('status', '==', 'rejected');
    // }


  
    
    // return res.status(200).json({ connections: connections.docs.map(doc => doc.data()) });
  } catch (error) {
    console.error('Error getting connections:', error);
    return res.status(500).json({ message: 'Failed to get connections' });
  }
}
  
exports.getPeopleYouMayKnow = async (req, res) => {
  try {
    const userID = req.user.uid;
    
    // Get current user's profile
    const userProfileRef = db.collection('profiles').doc(userID);
    const userProfile = await userProfileRef.get();
    
    if (!userProfile.exists) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const userData = userProfile.data();
    const userConnections = new Set(userData?.connections?.connected || []);
    const userInstitution = userData.institution;
    const userResearchInterests = new Set(userData.researchInterests || []);

    // Get all connections of connections (2nd degree connections)
    const secondDegreeConnections = new Map(); // Map to store potential connection and their scores

    // Get profiles of all direct connections
    const connectionProfiles = await Promise.all(
      [...userConnections].map(connId => 
        db.collection('profiles').doc(connId).get()
      )
    );

    // Process each connection's connections
    for (const connProfile of connectionProfiles) {
      if (!connProfile.exists) continue;
      
      const connData = connProfile.data();
      const theirConnections = connData?.connections?.connected || [];
      
      // For each connection of connection
      for (const potentialConnection of theirConnections) {
        // Skip if it's the user themselves or already a direct connection
        if (potentialConnection === userID || userConnections.has(potentialConnection)) {
          continue;
        }
        
        // Increment mutual connection score
        secondDegreeConnections.set(
          potentialConnection, 
          {
            mutualCount: (secondDegreeConnections.get(potentialConnection)?.mutualCount || 0) + 1,
            userId: potentialConnection
          }
        );
      }
    }

    // Get full profiles and calculate relevance scores
    const suggestionsWithScores = await Promise.all(
      [...secondDegreeConnections.values()].map(async ({ userId, mutualCount }) => {
        const profileDoc = await db.collection('profiles').doc(userId).get();
        const profileData = profileDoc.data();

        // Base score is number of mutual connections (weight: 1.0)
        let relevanceScore = mutualCount;

        // Add institution bonus if from same institution (weight: 0.5)
        if (profileData.institution === userInstitution) {
          relevanceScore += 0.5;
        }

        // Add research interests overlap bonus (weight: 0.3 per matching interest)
        const theirInterests = new Set(profileData.researchInterests || []);
        const commonInterests = [...userResearchInterests].filter(interest => 
          theirInterests.has(interest)
        );
        relevanceScore += commonInterests.length * 0.3;

        return {
          id: userId,
          userId: userId,
          name: profileData.displayName,
          role: profileData.role,
          university: profileData.institution,
          avatar: profileData.photoURL,
          mutualConnections: mutualCount,
          researchInterests: profileData.researchInterests || [],
          commonInterests: commonInterests,
          connectionStatus: 'none',
          relevanceScore
        };
      })
    );

    // Sort by relevance score and take top 10
    const suggestions = suggestionsWithScores
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    return res.status(200).json({ suggestions });

  } catch (error) {
    console.error('Error getting people you may know:', error);
    return res.status(500).json({ 
      message: 'Failed to get suggestions',
      error: error.message 
    });
  }
};
  

