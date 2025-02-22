import { StreamChat } from 'stream-chat';
import { CHAT_API_KEY, CHAT_API_SECRET } from './constants';

const serverClient = StreamChat.getInstance(CHAT_API_KEY, CHAT_API_SECRET);

export async function generateUserChatToken(userId) {
  try {
    return serverClient.createToken(userId);
  } catch (error) {
    console.error('Error generating chat token:', error);
    throw error;
  }
}

export async function createChannel(creatorId, participants, roomId, roomType, roomName) {
  try {
    const channel = serverClient.channel('messaging', roomId, {
      created_by_id: creatorId,
      members: participants,
      name: roomName,
      type: roomType
    });

    await channel.create();
    return channel;
  } catch (error) {
    console.error('Error creating chat channel:', error);
    throw error;
  }
}

export async function getChannel(channelId) {
  try {
    const channel = serverClient.channel('messaging', channelId);
    await channel.query();
    return channel;
  } catch (error) {
    console.error('Error getting chat channel:', error);
    return null;
  }
}

export async function addMembersToChannel(channelId, userIds) {
  try {
    const channel = serverClient.channel('messaging', channelId);
    await channel.addMembers(userIds);
    return channel;
  } catch (error) {
    console.error('Error adding members to channel:', error);
    throw error;
  }
} 