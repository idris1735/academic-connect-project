import { jwtVerify } from 'jose';

export async function verifyAuth(token) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.FIREBASE_PRIVATE_KEY)
    );
    return verified.payload;
  } catch (err) {
    return null;
  }
} 