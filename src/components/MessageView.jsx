"use client";

import {
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { chatClient } from "./StreamChatProvider";
import "stream-chat-react/dist/css/v2/index.css";

export default function MessageView({ conversation, onToggleSidebar }) {
  const [channel, setChannel] = useState(null);

  const [client, setClient] = useState(null);

  

  useEffect(() => {
    if (conversation) {
      const setupChannel = async () => {
        const channelId = conversation.id;
        const participants = await conversation.participants;;
        const newChannel = chatClient.channel("messaging", channelId, {
          name: conversation.name,
        });
        await newChannel.watch();
        setChannel(newChannel);
      };

      setupChannel();
    }
  }, [conversation]);

  if (!channel) return null;

  return (
    <div className="flex flex-col h-full">
      <Channel channel={channel}>
        <Window>
          <div className="str-chat__header-livestream">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={onToggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="str-chat__header-content">
                <div className="str-chat__header-title">
                  {conversation?.name}
                </div>
                <div className="str-chat__header-subtitle">Active now</div>
              </div>
            </div>
          </div>
          <MessageList />
          <MessageInput focus />
        </Window>
        <Thread />
      </Channel>
    </div>
  );
}
