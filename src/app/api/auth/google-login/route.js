const { NextResponse } = require('next/server');
const { admin } = require('@/lib/firebase-admin');
const { createSession, createChatSession } = require('@/lib/session');

exports.POST = async (req) => {
  try {
    const { credential } = await req.json();

    // Verify Google credential
    const ticket = await admin.auth().verifyIdToken(credential);
    const { email, name, picture } = ticket.payload;

    // Get or create user
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
      // If user doesn't exist, create one
      userRecord = await admin.auth().createUser({
        email,
        displayName: name,
        photoURL: picture,
        emailVerified: true
      });
    }

    // Create custom token
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    
    // Create session
    await createSession(customToken, userRecord);
    await createChatSession(userRecord);

    // Get or create user profile
    const userProfileRef = admin.db.collection('profiles').doc(userRecord.uid);
    const userProfile = await userProfileRef.get();

    if (!userProfile.exists) {
      await userProfileRef.set({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || '',
        photoURL: userRecord.photoURL || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        connections: {
          connected: [],
          pending: [],
          received: []
        },
        messageRooms: {
          researchRooms: [],
          directMessages: [],
          groupMessages: []
        }
      });
    }

    return NextResponse.json({
      message: 'Successfully logged in with Google',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL
      }
    });

  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json(
      { 
        error: 'Google login failed',
        details: error.message 
      }, 
      { status: 401 }
    );
  }
}; 