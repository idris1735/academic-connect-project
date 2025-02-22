import { chatClient } from '@/components/StreamChatProvider'

class ChatService {
  async createDirectChannel(otherUserId) {
    try {
      // Create a unique channel ID for the DM
      const channelId = [chatClient.userID, otherUserId].sort().join('-')

      // Get other user's data from Firestore
      const response = await fetch(`/api/users/profile/${otherUserId}`)
      const userData = await response.json()

      // Create the channel
      const channel = chatClient.channel('messaging', channelId, {
        members: [chatClient.userID, otherUserId],
        name: userData.displayName || userData.email,
      })

      await channel.create()
      return channel
    } catch (error) {
      console.error('Error creating channel:', error)
      throw error
    }
  }

  async listUserChannels() {
    try {
      const filter = { members: { $in: [chatClient.userID] } }
      const sort = [{ last_message_at: -1 }]
      const channels = await chatClient.queryChannels(filter, sort)
      return channels
    } catch (error) {
      console.error('Error listing channels:', error)
      throw error
    }
  }
}

export const chatService = new ChatService()
