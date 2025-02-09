import { StreamChat } from 'stream-chat'

export async function GET(request) {
  try {
    // Check if user is authenticated
    if (!request.user?.uid) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    const streamChat = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_KEY
    )
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60
    const token = streamChat.createToken(request.user.uid, expirationTime)

    return new Response(JSON.stringify({ token }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating chat token:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate token' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
