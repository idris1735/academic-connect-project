const { db } = require('../config/firebase');
const { getUserNameByUid } = require('../utils/user');

exports.getProfile = async (req, res) => {
  try {
    // Get userId from request body instead of params
    const  userId  = req.user.uid
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in request body' });
    }

    // Get base profile data
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

    // Temporarily remove the recent activity query until index is created
    let recentActivity = [];
    
    // Try to get recent activity if index exists
    try {
      const recentActivityRef = await db.collection('posts')
        .where('uid', '==', userId)
        .limit(5)  // Remove orderBy for now
        .get();

      recentActivity.push(...recentActivityRef.docs.map(doc => {
        const post = doc.data();
        return {
          type: "comment",
          content: post.content,
          date: post.timeStamp?.toDate().toISOString() || new Date().toISOString(),
          tags: post.tags || []
        };
      }));
    } catch (activityError) {
      console.warn('Could not fetch recent activity:', activityError);
      // Continue without recent activity
    }

    recentActivity = [
      {
        type: "comment",
        content: "This is a test comment",
        date: new Date().toISOString(),
        tags: ["test", "comment"]
      }
    ]

    // Combine all data
    const fullProfileData = {
      name: `${profileData.firstName} ${profileData.lastName}`,
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
      stats: {
        upvotes: profileData.stats?.upvotes || 0,
        publications: profileData.stats?.publications || 0,
        citations: profileData.stats?.citations || 0,
        hIndex: profileData.stats?.hIndex || 0,
        i10Index: profileData.stats?.i10Index || 0
      },
      reputation: {
        
      },
      recentActivity: recentActivity,
      // Additional fields from profile document
      email: profileData.email,
      photoURL: profileData.photoURL,
      bio: profileData.bio || "",
      occupation: profileData.occupation || userTypeData.occupation,
      interests: profileData.interests || userTypeData.interests || [],
      dateOfBirth: profileData.dateOfBirth,
      userType: profileData.userType
    };

    res.status(200).json(fullProfileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      error: error.message 
    });
  }
};