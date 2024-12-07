const db = require('../config/database');

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

exports.list