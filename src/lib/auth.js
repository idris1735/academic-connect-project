import { admin } from './firebase-admin';
import { cookies } from 'next/headers';

async function auth() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    // Verify session cookie
    const decodedClaim = await admin.auth().verifySessionCookie(sessionCookie.value, true);

    if (!decodedClaim) {
      return null;
    }

    return {
      user: {
        id: decodedClaim.uid,
        email: decodedClaim.email,
        ...decodedClaim
      }
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

module.exports = { auth }; 