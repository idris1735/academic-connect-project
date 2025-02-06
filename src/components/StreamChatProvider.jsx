"use client";

import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import "stream-chat-react/dist/css/v2/index.css";

const APP_CONFIG = {
  apiKey: "gmfrb5nraect",
  appId: "1355401",
  appName: "OasisPremiumDev",
  region: "ohio",
  organizationId: "1253456",
};

export const chatClient = StreamChat.getInstance(APP_CONFIG.apiKey);
export const videoClient = new StreamVideoClient({
  apiKey: APP_CONFIG.apiKey,
});

// Configure chat and video clients together
chatClient.callSettings = {
  provider: "stream",
  enabled: true,
  audio: true,
  video: true,
  screensharing: true,
};

export const startCall = async (channel, callType) => {
  try {
    const call = videoClient.call("default", channel.id);
    await call.getOrCreate({
      ring: true,
      data: { callType },
    });
    return call;
  } catch (error) {
    console.error("Error starting call:", error);
    throw error;
  }
};

export const endCall = async (call) => {
  try {
    await call.leave();
  } catch (error) {
    console.error("Error ending call:", error);
    throw error;
  }
};

export function StreamChatProvider({ children }) {
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const setupClient = async () => {
      try {
        // Only setup if not already connected
        if (!chatClient.userID) {
          const response = await fetch("/api/chats/get_token");
          if (!response.ok) {
            throw new Error("Failed to fetch chat token");
          }
          const data = await response.json();

          const userResponse = await fetch("/user/current");
          if (!userResponse.ok) {
            throw new Error("Failed to fetch user");
          }
          const userData = await userResponse.json();

          const user = {
            id: userData.user.uid,
            name: userData.user.displayName,
            image: userData.user.photoURL,
          };

          await chatClient.connectUser(user, data.token);
          await videoClient.connectUser(user, data.token);
        }

        setClientReady(true);
      } catch (error) {
        console.error("Error setting up chat client:", error);
        setClientReady(false);
      }
    };

    setupClient();

    // Cleanup function - don't disconnect, just cleanup event listeners
    return () => {
      setClientReady(false);
    };
  }, []);

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
