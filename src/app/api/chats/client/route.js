const { NextResponse } = require('next/server');
const { StreamChat } = require('stream-chat');
const { CHAT_API_KEY, CHAT_API_SECRET } = require('@/lib/constants');
const { handleError } = require('@/lib/error-utils');
import { auth as authService } from '@/lib/auth';

export const runtime = 'nodejs';

const serverClient = StreamChat.getInstance(CHAT_API_KEY, CHAT_API_SECRET);


// GET /api/chats/client - Get chat client
export async function GET(req) {
  try {
    const session = await authService();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ 
      apiKey: CHAT_API_KEY,
      userData: {
        id: session.user.id,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Error getting chat client:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
} 