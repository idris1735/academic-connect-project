import { db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(req, { params }) {
  try {
    const { userId } = params
    const userDoc = await getDoc(doc(db, 'users', userId))

    if (!userDoc.exists()) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      })
    }

    const userData = userDoc.data()
    return new Response(
      JSON.stringify({
        uid: userId,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
      }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user profile' }),
      { status: 500 }
    )
  }
}
