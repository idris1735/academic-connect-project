
exports.connectWithUser = async (req, res) => {
    try {
      const currentUserId = req.user.uid;
      const targetUserId = req.params.userId;
  
      // Check if users are already connected
      const userSnapshot = await db.collection('users')
        .where('uid', '==', currentUserId)
        .get();
  
      if (userSnapshot.empty) {
        return res.status(404).json({ message: 'Current user not found' });
      }
  
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      const connections = userData.connections || [];
  
      if (connections.includes(targetUserId)) {
        return res.status(400).json({ message: 'Already connected with this user' });
      }
  
      // Add connection
      await userDoc.ref.update({
        connections: [...connections, targetUserId]
      });
  
      return res.status(200).json({ 
        message: 'Connection successful',
        connected: true
      });
  
    } catch (error) {
      console.error('Error connecting users:', error);
      return res.status(500).json({ 
        message: 'Failed to connect with user',
        error: error.message 
      });
    }
  };
  
  exports.getConnectionStatus = async (req, res) => {
    try {
      const currentUserId = req.user.uid;
      const targetUserId = req.params.userId;
  
      const userSnapshot = await db.collection('users')
        .where('uid', '==', currentUserId)
        .get();
  
      if (userSnapshot.empty) {
        return res.status(404).json({ message: 'Current user not found' });
      }
  
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      const connections = userData.connections || [];
  
      return res.status(200).json({ 
        connected: connections.includes(targetUserId)
      });
  
    } catch (error) {
      console.error('Error getting connection status:', error);
      return res.status(500).json({ 
        message: 'Failed to get connection status',
        error: error.message 
      });
    }
  };
  