const { NextResponse } = require('next/server');
const { StreamChat } = require('stream-chat');
const { CHAT_API_KEY, CHAT_API_SECRET } = require('@/lib/constants');
const { handleError } = require('@/lib/error-utils');
import { auth } from '@/lib/auth';
const { getUserNameByUid } = require('@/lib/utils/user');

export const runtime = 'nodejs';
const serverClient = StreamChat.getInstance(CHAT_API_KEY, CHAT_API_SECRET);


// GET /api/chats/channels - List channels
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const channelTypes = await serverClient.listChannelTypes();
    return NextResponse.json(channelTypes.channel_types.messaging);

  } catch (error) {
    console.error('Error listing channels:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}

// POST /api/chats/channels - Create channel
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { participants, messageID, roomType, name } = await req.json();
    const creator = session.user.id;

    let channel;
    if (roomType === 'DM') {
      channel = serverClient.channel('messaging', `dm_${messageID}`, {
        members: participants,
        created_by_id: creator
      });
    } else {
      channel = serverClient.channel('messaging', `research_${messageID}`, {
        name,
        created_by_id: creator
      });
    }

    await channel.create();

    if (roomType !== 'DM') {
      const creatorName = await getUserNameByUid(creator);
      await channel.addMembers([{ 
        user_id: creator, 
        channel_role: 'channel_moderator' 
      }], {
        text: `${creatorName} created ${name} research room.`,
        user_id: creator
      });
    }

    return NextResponse.json({ channel });

  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
} 