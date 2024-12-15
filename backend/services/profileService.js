const { db } = require('../config/database');
const { getUserNameByUid, getRecentActivity, formatActivityForDisplay } = require('../utils/user');

exports.getProfileIndividual = async (req, res) => {
  try {
    // Check for pid in query params first, fallback to current user's uid
    const userId = req.query.pid || req.user.uid;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found' });
    }

    // Get base profile data without activities
    const profileRef = db.collection('profiles').doc(userId);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const profileData = profileDoc.data();

    // Get user type specific data
    const userTypeRef = db.collection('userTypes').doc(userId);
    const userTypeDoc = await userTypeRef.get();
    const userTypeData = userTypeDoc.exists ? userTypeDoc.data() : {};

    // Ensure stats object exists with default values
    const stats = {
      posts: profileData.stats?.posts || 0,
      upvotes: profileData.stats?.upvotes || 0,
      publications: profileData.stats?.publications || 0,
      citations: profileData.stats?.citations || 0,
      hIndex: profileData.stats?.hIndex || 0,
      i10Index: profileData.stats?.i10Index || 0,
      followers: profileData.stats?.followers || 0,
      following: profileData.stats?.following || 0,
      reputation: profileData.stats?.reputation || 0
    };

    // Combine all data (removed recentActivity)
    const fullProfileData = {
      name: `${profileData.firstName} ${profileData.lastName}`,
      uid: userId,
      verified: true,
      institution: profileData.institution || "Not specified",
      department: profileData.department || userTypeData.department || "Not specified",
      location: `${profileData.city || ''}, ${profileData.country || ''}`,
      memberSince: profileData.dateJoined ? profileData.dateJoined.toDate().toISOString() : null,
      socialLinks: {
        instagram: profileData.socialLinks?.instagram || "#",
        linkedin: profileData.socialLinks?.linkedin || "#",
        twitter: profileData.socialLinks?.twitter || "#",
        website: profileData.socialLinks?.website || "#"
      },
      reputation: profileData.reputation || [],
      stats, // Use the guaranteed stats object
      email: profileData.email,
      photoURL: profileData.photoURL,
      bio: profileData.bio || "",
      occupation: profileData.occupation || userTypeData.occupation,
      interests: profileData.interests || userTypeData.interests || [],
      dateOfBirth: profileData.dateOfBirth,
      userType: profileData.userType
    };
    // In your browser console or component
    console.log('Profile Data:', fullProfileData);
    console.log('Stats:', fullProfileData.stats);
    res.status(200).json(fullProfileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      error: error.message 
    });
  }
};

// New endpoint just for activities
exports.getProfileActivities = async (req, res) => {
  try {
    const userId = req.params.uid || req.user.uid;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found' });
    }

    const activities = await getRecentActivity(userId);
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ 
      message: 'Failed to fetch activities', 
      error: error.message 
    });
  }
};

exports.getProfiles = async (req, res) => {
  const profiles = await db.collection('profiles').get();
  const profileList = [];
  for (const profile of profiles.docs) {
    profileList.push({
      pid: profile.id,
      occupation: profile.data().occupation || '',
      displayName: profile.data().displayName || profile.data().firstName + ' ' + profile.data().lastName || '',
      avatar: profile.data().avatar || '',
      email: profile.data().email || ''
    });
  }

  return res.status(200).json({ profiles: profileList });
};
