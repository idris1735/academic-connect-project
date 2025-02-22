import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';
import { CHAT_API_KEY, CHAT_API_SECRET } from '@/lib/constants';
import { handleError } from '@/lib/error-utils';
import { auth  } from '@/lib/auth';
import { getUserNameByUid } from '@/lib/utils/user';




const serverClient = StreamChat.getInstance(CHAT_API_KEY, CHAT_API_SECRET);


// GET /api/chats/channels/[channelId] - Get channel
export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { channelId } = params;
    const channels = await serverClient.queryChannels({ id: { $eq: channelId } });

    if (!channels.length) {
      return NextResponse.json({ message: 'Channel not found' }, { status: 404 });
    }

    return NextResponse.json({ channel: channels[0] });

  } catch (error) {
    console.error('Error getting channel:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}

// POST /api/chats/channels/[channelId] - Add members to channel
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { channelId } = params;
    const { members } = await req.json();
    const creator = session.user.id;

    const channels = await serverClient.queryChannels({ id: { $eq: channelId } });
    if (!channels.length) {
      return NextResponse.json({ message: 'Channel not found' }, { status: 404 });
    }

    const channel = channels[0];

    for (const member of members) {
      const memberName = await getUserNameByUid(member);
      await channel.addMembers([member], {
        text: `${memberName} has joined the research room.`,
        user_id: creator
      });
    }

    return NextResponse.json({ 
      message: 'Members added successfully',
      members
    });

  } catch (error) {
    console.error('Error adding members to channel:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
} 