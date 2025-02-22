'use client'

import { StreamChat } from 'stream-chat'
import { Chat } from 'stream-chat-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { LoadingSpinner } from './ui/loading-spinner'
import 'stream-chat-react/dist/css/v2/index.css'
import { StreamVideoClient } from '@stream-io/video-react-sdk'
import PropTypes from 'prop-types'

const APP_CONFIG = {
  apiKey: 'gmfrb5nraect',
  appId: '1355401',
  appName: 'OasisPremiumDev',
  region: 'ohio',
  organizationId: '1253456',
}

// Initialize Stream Chat client
export const chatClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY
)
export const videoClient = new StreamVideoClient({
  apiKey: APP_CONFIG.apiKey,
})

// Configure chat and video clients together
chatClient.callSettings = {
  provider: 'stream',
  enabled: true,
  audio: true,
  video: true,
  screensharing: true,
}

export const startCall = async (channel, callType) => {
  try {
    const call = videoClient.call('default', channel.id)
    await call.getOrCreate({
      ring: true,
      data: { callType },
    })
    return call
  } catch (error) {
    console.error('Error starting call:', error)
    throw error
  }
}

export const endCall = async (call) => {
  try {
    await call.leave()
  } catch (error) {
    console.error('Error ending call:', error)
    throw error
  }
}

export function StreamChatProvider({ children }) {
  const [clientReady, setClientReady] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const initChat = async () => {
      try {
        if (!user) {
          console.log('No authenticated user')
          setClientReady(true)
          return
        }

        if (chatClient.userID === user.uid) {
          console.log('User already connected to Stream')
          setClientReady(true)
          return
        }

        console.log('Fetching chat token...')
        const response = await fetch('/api/chats/get_token')
        const data = await response.json()

        console.log('Raw token response:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get chat token')
        }

        if (!data || typeof data !== 'object') {
          console.error('Invalid response data:', data)
          throw new Error('Invalid response data')
        }

        if (!data.token) {
          console.error('Missing token in response:', data)
          throw new Error('Token missing in response')
        }

        if (!data.userData) {
          console.error('Missing userData in response:', data)
          throw new Error('User data missing in response')
        }

        const { token, userData } = data

        console.log('Connecting user with data:', {
          id: user.uid,
          userData: userData,
        })

        // Connect user to Stream
        await chatClient.connectUser(
          {
            id: user.uid,
            name: userData.displayName || userData.email || 'Anonymous User',
            image:
              userData.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData.displayName || 'A'
              )}`,
          },
          token
        )

        console.log('Successfully connected to Stream')
        setClientReady(true)
        setError(null)
      } catch (error) {
        console.error('Error initializing chat:', error)
        setError(error.message)
        setClientReady(true)
      }
    }

    initChat()

    return () => {
      if (chatClient.userID) {
        chatClient.disconnectUser()
      }
    }
  }, [user])

  if (!clientReady) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-[200px] text-red-500'>
        Error: {error}
      </div>
    )
  }

  if (!user || !chatClient.userID) {
    return children
  }

  return (
    <Chat client={chatClient} theme='messaging light'>
      {children}
    </Chat>
  )
}

StreamChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
