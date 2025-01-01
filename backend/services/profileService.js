const { db } = require('../config/database');
const { getUserNameByUid, getRecentActivity, formatActivityForDisplay } = require('../utils/user');
const { admin } = require('../config/firebase');
const path = require('path');
const fs = require('fs/promises');

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
      location: profileData.location || "Not specified",
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
      userType: profileData.userType,
      gender: profileData.gender || "",
      settings: profileData.settings || {},

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

  return res.status(200).json({ profileList: profileList });
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const {
      gender,
      department,
      location,
      socialLinks,
    } = req.body;

    console.log(req.body);

    const profileRef = db.collection('profiles').doc(userId);

    if (gender) {
      await profileRef.update({
        gender,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    if (department) {
      await profileRef.update({
        department,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    if (location) {
      await profileRef.update({
        location,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    if (socialLinks) {
      await profileRef.update({
        socialLinks,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }


    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { emailNotifications, pushNotifications } = req.body;

    const profileRef = db.collection('profiles').doc(userId);
    
    await profileRef.update({
      'settings.notifications': {
        email: emailNotifications,
        push: pushNotifications
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ message: 'Notification settings updated' });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    await admin.auth().updateUser(userId, {
      password: newPassword
    });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.uid;
    const attachment = req.file;

    if (!attachment) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const buffer = attachment.buffer;
    const fileExtension = path.extname(attachment.originalname);
    const fileName = `${userId}_${Date.now()}${fileExtension}`;
    
    // Store in the Next.js public directory
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileType, 'avatars', fileName);
    const publicUrl = path.relative(path.join(process.cwd(), 'public'), uploadPath);


    // Ensure directory exists
    await fs.mkdir(path.dirname(uploadPath), { recursive: true });
    
    // Write file
    await fs.writeFile(uploadPath, buffer);

    // Update profile with new avatar URL
    const profileRef = db.collection('profiles').doc(userId);
    await profileRef.update({
      photoURL: publicUrl,  // Store the public URL path
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Avatar uploaded:', publicUrl);

    return res.status(200).json({ 
      message: 'Avatar updated successfully',
      photoURL: publicUrl
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Delete from Authentication
    await admin.auth().deleteUser(userId);

    // Delete from Firestore
    await db.collection('profiles').doc(userId).delete();

    // Delete associated data (posts, comments, etc.)
    // ... add more deletion logic as needed

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateSocialLinks = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { platform, url } = req.body;

    // Validate platform
    const validPlatforms = ['instagram', 'linkedin', 'twitter', 'website'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ 
        error: 'Invalid platform' 
      });
    }

    const profileRef = db.collection('profiles').doc(userId);
    
    // Create socialLinks object with the updated platform
    const updateData = {
      [`socialLinks.${platform}`]: url || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await profileRef.update(updateData);

    return res.status(200).json({ 
      message: 'Social link updated successfully',
      platform,
      url 
    });
  } catch (error) {
    console.error('Error updating social link:', error);
    return res.status(500).json({ error: error.message });
  }
};

// URL validation helper
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}