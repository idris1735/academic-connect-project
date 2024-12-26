"use client";

import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { useEffect, useState } from "react";
import "stream-chat-react/dist/css/v2/index.css";

// Using details from Chat Explorer
const APP_CONFIG = {
  
};

export const chatClient = StreamChat.getInstance(APP_CONFIG.apiKey);

export function StreamChatProvider({ children }) {
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const setupClient = async () => {
      try {
        const user = {
          id: "olanike",
          name: "olanike",
          role: "admin",
          image: "https://getstream.io/random_svg/?name=olanike",
        };

        // Token generated specifically for user 'olanike'
        const userToken = ""; 
        await chatClient.connectUser(user, userToken);
        console.log("User connected:", user); // Debugging log
        setClientReady(true);
      } catch (error) {
        console.error("Error connecting user:", error.message);
      }
    };

    if (!chatClient.userID) {
      setupClient();
    }

    return () => {
      if (chatClient.userID) {
        chatClient.disconnectUser();
        console.log("User disconnected"); // Debugging log
      }
    };
  }, []);

  if (!clientReady) return null;

  return (
    <Chat client={chatClient} theme="messaging light">
      {children}
    </Chat>
  );
}
