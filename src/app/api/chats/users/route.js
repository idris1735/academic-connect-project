const { NextResponse } = require('next/server');
const { StreamChat } = require('stream-chat');
const { CHAT_API_KEY, CHAT_API_SECRET } = require('@/lib/constants');
const { handleError } = require('@/lib/error-utils');

export const runtime = 'nodejs';

const serverClient = StreamChat.getInstance(CHAT_API_KEY, CHAT_API_SECRET);

// POST /api/chat/users - Create channel user
exports.POST = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await req.json();

    // Check if user already exists
    const existingUser = await serverClient.queryUsers({ id: { $eq: userId } });
    
    if (existingUser.users.length === 0) {
      await serverClient.upsertUsers([
        { id: userId, role: 'channel_moderator' }
      ]);
    }

    return NextResponse.json({ 
      message: 'User created/updated successfully',
      userId 
    });

  } catch (error) {
    console.error('Error creating channel user:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 