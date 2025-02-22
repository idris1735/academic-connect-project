import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';
import { CHAT_API_KEY, CHAT_API_SECRET } from '@/lib/constants';
import { handleError } from '@/lib/error-utils';
import { auth } from '@/lib/auth';
export const runtime = 'nodejs';

const serverClient = StreamChat.getInstance(CHAT_API_KEY, CHAT_API_SECRET);


// GET /api/chats/token - Get chat token
export const GET = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = req.cookies.get('chatToken');
    if (!token) {
      return NextResponse.json({ message: 'No chat token found' }, { status: 401 });
    }

    return NextResponse.json({ token: token.value });

  } catch (error) {
    console.error('Error getting chat token:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
};

// POST /api/chats/token - Generate new chat token
export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const token = serverClient.createToken(userId, Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5);

    // Update user on StreamChat
    const response = await serverClient.queryUsers({ id: { $eq: userId } });

    if (response.users.length === 0) {
      await serverClient.upsertUser({
        id: userId,
        role: 'user'
      }, token);
    }

    return NextResponse.json({ token });

  } catch (error) {
    console.error('Error generating chat token:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 