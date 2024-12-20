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

    if (!status) {
      let connections = profileData?.connections?.connected
      let connectionCount = profileData?.connectionStats?.totalConnections
      let connectionData = {
        connections,
        connectionCount
      }

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
  

