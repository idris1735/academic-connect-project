const { NextResponse } = require('next/server');
const { admin, db } = require('@/lib/firebase-admin');
const { handleError } = require('@/lib/error-utils');

export const runtime = 'nodejs';
// GET /api/profile/all - Get all profiles
exports.GET = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

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

    return NextResponse.json({ profileList });

  } catch (error) {
    console.error('Error getting profiles:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 