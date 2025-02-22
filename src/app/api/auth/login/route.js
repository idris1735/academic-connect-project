const { NextResponse } = require('next/server');
const { admin } = require('@/lib/firebase-admin');
const { createSession, createChatSession } = require('@/lib/session');

export async function POST(req) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ 
        error: 'ID token is required' 
      }, { status: 400 });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get the user's details
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    // Create session cookies
    await createSession(idToken, userRecord);
    await createChatSession(userRecord);

    return NextResponse.json({
      message: 'Successfully logged in',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Invalid credentials',
      details: error.message 
    }, { status: 401 });
  }
} 