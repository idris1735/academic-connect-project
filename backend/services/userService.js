const { db } = require('../config/database');

exports.getUserProfile = async (req, res) => {
  try {
    const pid = req.user.uid;
    console.log(pid)
    
    // Get user profile from Firestore
    const userDoc = await db.collection('profiles').doc(pid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const userData = userDoc.data();
    console.log(userData)
    const profile = {
      name: userData.displayName || '',
      title: userData.occupation || 'Research Assistant',
      views: userData.profileViews || 0,
      connections: userData.connections || 0,
      // Add any other profile fields you need
    };

    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name, title } = req.body;

    // Update user profile in Firestore
    await db.collection('users').doc(uid).update({
      name,
      title,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ 
      message: 'Profile updated successfully',
      profile: { name, title }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const uid = req.user.uid;
    console.log(`Fetching current user with uid: ${uid}`);

    const userSnapshot = await db.collection('users')
      .where('uid', '==', uid)
      .get();

    if (userSnapshot.empty) {
      console.log(`No user found with uid: ${uid}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    console.log(`Found current user: ${userData.displayName}`);
    return res.status(200).json({ 
      user: {
        uid: userData.uid,
        displayName: userData.displayName,
        email: userData.email,
        avatar: userData.avatar,
        // Add any other user fields you need
      }
    });

  } catch (error) {
    console.error('Error getting current user:', error);
    return res.status(500).json({ 
      message: 'Failed to get current user',
      error: error.message 
    });
  }
};

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
