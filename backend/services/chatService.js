const StreamChat = require('stream-chat').StreamChat
const { CHAT_API_KEY, CHAT_API_SECRET } = require('../utils/constants')

const serverClient = StreamChat.getInstance(CHAT_API_KEY, CHAT_API_SECRET)
const { getUserNameByUid } = require('../utils/user')

exports.generateUserChatToken = async (userId) => {
  // TODO: Rewrite this code to sync with Firestore and Firebase Authentication
  const token = serverClient.createToken(
    userId,
    Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5 // 5 days
  )

  // upDTA USER ON STREAMCHAT
  const response = await serverClient.queryUsers({
    id: { $eq: userId },
  })

  if (response.length == 0) {
    const updateResponse = await serverClient.upsertUser(
      {
        id: userId,
        role: 'user',
      },
      token
    )
  }

  return token
}

exports.getChatClient = (req, res) => {
  return serverClient
}

exports.getToken = async (req, res) => {
  const token = req.cookies.chatToken
  if (!token) {
    return res.status(401).json({ message: 'No chat token found' })
    // Change this to logout user and redirect to login page
    // return res.status(401).json({ message: 'No chat token found' });
  }
  return res.status(200).json({ token })
}

exports.listChats = async (req, res) => {
  const channelTypes = await serverClient.listChannelTypes()
  return res.status(200).json(channelTypes.channel_types.messaging)
}

exports.createChannelUser = async (userId) => {
  // check if user already exists
  let user = await serverClient.queryUsers({ id: { $eq: userId } })
  if (!user) {
    user = await serverClient.upsertUsers([
      { id: userId, role: 'channel_moderator' },
    ])
  }
  return user
}
exports.createChannel = async (
  creator,
  participants,
  messageID,
  roomType,
  name
) => {
  // Check for existing user  - Remove this from here later on, create user on signup
  const user = await this.createChannelUser(creator)
  for (let participant of participants) {
    console.log('Participant:', participant)
    let user = await this.createChannelUser(participant)
    console.log('User:', user)
  }

  try {
    if (roomType === 'DM') {
      const channel = serverClient.channel('messaging', messageID, {
        name: name,
        members: participants,
        created_by_id: creator,
      })
      await channel.create()
      return channel
    } else {
      // Create a group channel for research rooms
      const channel = serverClient.channel(
        'messaging',
        `research_${messageID}`,
        {
          name: name,
          created_by_id: creator,
        }
      )
      await channel.create()
      let creatorName = await getUserNameByUid(creator)
      await channel.addMembers(
        [{ user_id: creator, channel_role: 'channel_moderator' }],
        {
          text: `${creatorName} created ${name} research room.`,
          user_id: creator,
        }
      )

      return channel
    }
  } catch (error) {
    console.error('Error creating channel:', error.message)
    return null
  }
}

exports.getChannel = async (channelId) => {
  const channels = await serverClient.queryChannels({ id: { $eq: channelId } })
  console.log('Channels:', channels)
  return channels[0]
}

exports.addMembersToChannel = async (channelId, members, args = None) => {
  // Arg variable for further argumants on adding members
  try {
    const channel = await this.getChannel(channelId)
    if (channel) {
      for (let member of members) {
        let memberName = await getUserNameByUid(member)
        await channel.addMembers(members, {
          text: `${memberName} has joined the research room.`,
          user_id: creator,
        })
      }

      return true
    } else {
      console.error(`Channel not found with ID: ${channelId}`)
      return false
    }
  } catch (error) {
    console.error('Error adding members to channel:', error.message)
    return false
  }
}
