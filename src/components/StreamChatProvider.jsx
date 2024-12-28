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
  const [chatToken, setChatToken] = useState(null);
  const [currentUser, setUser] = useState(null);

  
  const getUser = async () => {
    try {
      const response = await fetch("/user/current");
      if (!response.ok) {
        throw new Error("Failed to fetch user:", response.message);
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  }

  const getToken = async () => {
      try {
        const response = await fetch("/api/chats/get_token");
        if (!response.ok) {
          throw new Error("Failed to fetch chat token:", response.message);
        }
        const data = await response.json();
        setChatToken(data.token);
      } catch (error) {
        console.error("Error fetching chat token:", error.message);
      }
    }

  useEffect(() =>{
    getUser();
  }, []);

  useEffect(() => {
    getToken();
  }, [])

  console.log("User fetched:", currentUser);

  useEffect(() => {
    const setupClient = async () => {
      if (currentUser && chatToken) {
        try {
          console.log("Setting up client", currentUser); // Debugging log
          const user = {
            id: currentUser.uid,
            name: currentUser.displayName,
            role: "admin",
            image: currentUser.photoURL,
          };
          console.log("User connecting:", user); // Debugging log
          // const userToken = ""; 
          await chatClient.connectUser(user, chatToken);
          console.log("User connected:", user); // Debugging log
          setClientReady(true);
        } catch (error) {
          console.error("Error connecting user:", error.message);
        }
    };
  }

    if (!chatClient.userID) {
      // getUser(); // Fetch user details when client connects for the first time
      setupClient();
    }

    return () => {
      if (chatClient.userID) {
        chatClient.disconnectUser();
        console.log("User disconnected"); // Debugging log
      }
    };
  }, [currentUser, chatToken]);

  if (!clientReady) return null;

  return (
    <Chat client={chatClient} theme="messaging light">
      {children}
    </Chat>
  );
}
