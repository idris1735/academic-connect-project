import { getAuth } from 'firebase-admin/auth'
import { adminDb } from '@/lib/firebase/admin-config'
import { StreamChat } from 'stream-chat'

export async function GET(req) {
  try {
    // Get auth token from header
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No auth token provided')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.split('Bearer ')[1]
    console.log('Got token:', token.substring(0, 20) + '...')

    // Verify token with Firebase Admin
    const decodedToken = await getAuth().verifyIdToken(token)
    const uid = decodedToken.uid
    console.log('Verified token for user:', uid)

    // Get user profile data
    const userDoc = await adminDb.doc(`users/${uid}`).get()
    if (!userDoc.exists) {
      console.log('User profile not found:', uid)
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userData = userDoc.data()
    console.log('Found user data:', {
      uid: uid,
      email: userData.email,
      displayName: userData.displayName,
    })

    // Initialize Stream Chat
    const serverClient = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_KEY,
      process.env.STREAM_SECRET
    )

    // Generate user token
    const streamToken = serverClient.createToken(uid)

    const responseData = {
      token: streamToken,
      userData: {
        uid: uid,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        displayName: userData.displayName || userData.email,
        email: userData.email,
        photoURL: userData.photoURL || null,
      },
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in get_token:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
