'use client';

import {
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelStateContext,
} from 'stream-chat-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Video, Phone } from 'lucide-react';
import { chatClient, startCall, endCall } from './StreamChatProvider';
import { StreamVideo, StreamCall } from '@stream-io/video-react-sdk';
import { ScrollArea } from '@/components/ui/scroll-area';
import 'stream-chat-react/dist/css/v2/index.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';

export default function MessageView({ conversation, onToggleSidebar }) {
  const [channel, setChannel] = useState(null);
  const { calls } = useChannelStateContext();
  const activeCall = calls && calls.length > 0 ? calls[0] : null;

  useEffect(() => {
    if (conversation) {
      const setupChannel = async () => {
        const channelId = conversation.id;
        const newChannel = chatClient.channel('messaging', channelId, {
          name: conversation.name,
        });
        await newChannel.watch();
        setChannel(newChannel);
      };

      setupChannel();
    }
  }, [conversation]);

  const handleStartCall = async (isVideoCall) => {
    if (!channel) return;

    try {
      const callType = isVideoCall ? 'video' : 'audio';
      await startCall(channel, callType);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const handleEndCall = async () => {
    if (activeCall) {
      try {
        await endCall(activeCall);
      } catch (error) {
        console.error('Error ending call:', error);
      }
    }
  };

  if (!channel) return null;

  return (
    <div className="flex flex-col h-full">
      <Channel channel={channel}>
        <Window>
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={onToggleSidebar}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <div className="font-semibold">{conversation?.name}</div>
                  <div className="text-sm text-muted-foreground">Active now</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleStartCall(true)}>
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleStartCall(false)}>
                  <Phone className="h-5 w-5" />
                </Button>
                {activeCall && (
                  <Button variant="destructive" size="sm" onClick={handleEndCall}>
                    End Call
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="flex-grow h-full overflow-y-auto">

              <MessageList />
            </ScrollArea>
            <div className="flex-shrink-0 p-4 border-t">
              <MessageInput focus />
            </div>
          </div>
        </Window>
        <Thread />
      </Channel>
      {activeCall && (
        <StreamVideo client={videoClient}>
          <StreamCall call={activeCall} />
        </StreamVideo>
      )}
    </div>
  );
}


