'use client';

import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import 'stream-chat-react/dist/css/v2/index.css';

const APP_CONFIG = {
  
};

export const chatClient = StreamChat.getInstance(APP_CONFIG.apiKey);
export const videoClient = new StreamVideoClient({
  apiKey: APP_CONFIG.apiKey,
});

// Configure chat and video clients together
chatClient.callSettings = {
  provider: 'stream',
  enabled: true,
  audio: true,
  video: true,
  screensharing: true,
};

export const startCall = async (channel, callType) => {
  try {
    const call = videoClient.call('default', channel.id);
    await call.getOrCreate({
      ring: true,
      data: { callType },
    });
    return call;
  } catch (error) {
    console.error('Error starting call:', error);
    throw error;
  }
};

export const endCall = async (call) => {
  try {
    await call.leave();
  } catch (error) {
    console.error('Error ending call:', error);
    throw error;
  }
};

export function StreamChatProvider({ children }) {
  const [clientReady, setClientReady] = useState(false);
  const [chatToken, setChatToken] = useState(null);
  const [currentUser, setUser] = useState(null);

  const getUser = async () => {
    try {
      const response = await fetch('/user/current');
      if (!response.ok) {
        throw new Error('Failed to fetch user: ' + response.statusText);
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error.message);
    }
  };

  const getToken = async () => {
    try {
      const response = await fetch('/api/chats/get_token');
      if (!response.ok) {
        throw new Error('Failed to fetch chat token: ' + response.statusText);
      }
      const data = await response.json();
      setChatToken(data.token);
    } catch (error) {
      console.error('Error fetching chat token:', error.message);
    }
  };

  useEffect(() => {
    getUser();
    getToken();

    // Cleanup function
    return () => {
      setClientReady(false); // Reset ready state on unmount
    };
  }, []);

  useEffect(() => {
    const setupClient = async () => {
      if (currentUser && chatToken) {
        try {
          const user = {
            id: currentUser.uid,
            name: currentUser.displayName,
            role: 'user',
            image: currentUser.photoURL,
          };

          if (chatClient.userID) {
            await chatClient.disconnectUser();
            await chatClient.disconnectUser();
          }

          await chatClient.connectUser(user, chatToken);

          // Connect video client with the same user and token
          await videoClient.connectUser(user, chatToken);

          setClientReady(true);
        } catch (error) {
          console.error('Error connecting user:', error.message);
        }
      }
    };

    setupClient();

    return () => {
      if (chatClient.userID) {
        // chatClient.disconnectUser();
        setupClient();
      }
      // videoClient.disconnectUser();
      setupClient();
    };
  }, [currentUser, chatToken]);

  if (!clientReady) return null;

  return (
    <Chat client={chatClient} theme="messaging light">
      {children}
    </Chat>
  );
}

StreamChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
