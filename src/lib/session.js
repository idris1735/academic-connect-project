import { cookies } from 'next/headers';
import { SESSION_EXPIRY } from '@/lib/constants';
import { generateUserChatToken } from '@/lib/chat';
import { admin } from '@/lib/firebase-admin';

export async function createSession(idToken, user) {
  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY
    });

    const cookieStore = cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: SESSION_EXPIRY / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return sessionCookie;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function createChatSession(user) {
  try {
    const chatToken = await generateUserChatToken(user.uid);
    
    const cookieStore = cookies();
    cookieStore.set('chatToken', chatToken, {
      maxAge: SESSION_EXPIRY / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return chatToken;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(
      sessionCookie.value,
      true
    );
    return decodedClaims;
  } catch (error) {
    return null;
  }
}

export async function verifySession(session) {
  if (!session) return null;
  
  try {
    const decodedClaims = await admin.auth().verifySessionCookie(session);
    return decodedClaims;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
} 