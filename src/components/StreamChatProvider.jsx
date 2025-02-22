'use client'

import { StreamChat } from 'stream-chat'
import { Chat } from 'stream-chat-react'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { StreamVideoClient } from '@stream-io/video-react-sdk'
import 'stream-chat-react/dist/css/v2/index.css'
import { LoadingSpinner } from './ui/loading-spinner'

const APP_CONFIG = {
  apiKey: 'gmfrb5nraect',
  appId: '1355401',
  appName: 'OasisPremiumDev',
  region: 'ohio',
  organizationId: '1253456',
}

export const chatClient = StreamChat.getInstance(APP_CONFIG.apiKey)
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

  useEffect(() => {
    const setupClient = async () => {
      try {
        // Only setup if not already connected
        if (!chatClient.userID) {
          try {
            // Fast-fail if no token endpoint
            const response = await fetch('/api/chats/token', {
              credentials: 'include',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            })

            // Fast path for non-authenticated users
            if (response.status === 401 || !response.ok) {
              setClientReady(true)
              return
            }

            const data = await response.json()
            const userResponse = await fetch('/api/users/current', {
              credentials: 'include',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            })

            // Fast path for non-authenticated users
            if (userResponse.status === 401 || !userResponse.ok) {
              setClientReady(true)
              return
            }

            const userData = await userResponse.json()
            if (!userData.user?.uid) {
              setClientReady(true)
              return
            }

            const user = {
              id: userData.user.uid,
              name: userData.user.displayName || 'Anonymous',
              image: userData.user.photoURL,
            }

            // Connect user in parallel
            await Promise.all([
              chatClient.connectUser(user, data.token),
              videoClient.connectUser(user, data.token),
            ])
          } catch (error) {
            console.log('Chat setup error:', error)
          }
        }
        setClientReady(true)
      } catch (error) {
        console.error('Error setting up chat client:', error)
        setClientReady(true)
      }
    }

    setupClient()
  }, [])

  if (!clientReady)
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <LoadingSpinner size='lg' />
      </div>
    )

  // If chat client is not connected, just render children without chat wrapper
  if (!chatClient.userID) {
    return <>{children}</>
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
