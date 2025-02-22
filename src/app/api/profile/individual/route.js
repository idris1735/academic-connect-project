const { NextResponse } = require('next/server');
const { admin, db } = require('@/lib/firebase-admin');
const { handleError } = require('@/lib/error-utils');
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
// GET /api/profile - Get current user profile
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('pid') || session.user.id;

    if (!userId) {
      return NextResponse.json({ message: 'User ID not found' }, { status: 400 });
    }

    // Get base profile data
    const profileRef = db.collection('profiles').doc(userId);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
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
      stats,
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

    return NextResponse.json(fullProfileData);

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
};

// PUT /api/profile - Update profile
export async function PUT(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const {
      gender,
      department,
      location,
      socialLinks,
    } = await req.json();

    const profileRef = db.collection('profiles').doc(userId);

    const updates = {};
    if (gender) updates.gender = gender;
    if (department) updates.department = department;
    if (location) updates.location = location;
    if (socialLinks) updates.socialLinks = socialLinks;

    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await profileRef.update(updates);

    return NextResponse.json({
      message: 'Profile updated successfully',
      updates
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
};

// DELETE /api/profile - Delete account
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete user's profile document
    const profileRef = db.collection('profiles').doc(userId);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    // Delete user's posts
    const postsSnapshot = await db.collection('posts')
      .where('uid', '==', userId)
      .get();

    const batch = admin.db.batch();
    postsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user's publications
    const publicationsSnapshot = await db.collection('publications')
      .where('userId', '==', userId)
      .get();

    publicationsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete profile document
    batch.delete(profileRef);

    // Execute batch
    await batch.commit();

    // Delete Firebase Auth user
    await admin.auth().deleteUser(userId);

    return NextResponse.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 