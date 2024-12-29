'use client'

import { Channel, MessageList, MessageInput, Thread, Window } from 'stream-chat-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, Video, Phone } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { chatClient, startCall, endCall } from './StreamChatProvider'

export default function ResearchRoom({ room, onToggleSidebar }) {
  const [channel, setChannel] = useState(null)
  const [call, setCall] = useState(null);

  useEffect(() => {
    if (room) {
      const setupChannel = async () => {
        try {
          const channelId = `research_${room.id}`
          const newChannel = chatClient.channel('messaging', channelId, {
            name: room.name,
          })
          
          await newChannel.watch()
          setChannel(newChannel)
        } catch (error) {
          console.error("Error setting up channel:", error);
        }
      }

      setupChannel()
    }
  }, [room])

  const handleStartCall = async (isVideoCall) => {
    if (!channel) return;

    const callType = isVideoCall ? 'video' : 'audio';
    try {
      const newCall = await startCall(channel, callType);
      setCall(newCall);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleEndCall = async () => {
    if (call) {
      try {
        await endCall(call);
        setCall(null);
      } catch (error) {
        console.error("Error ending call:", error);
      }
    }
  };

  if (!channel) return null

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Tabs defaultValue="chat" className="flex-1">
        <TabsList className="w-full justify-start px-4 h-12 bg-white border-b">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 p-0 m-0">
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
                    <div className="str-chat__header-title">{room?.name}</div>
                    <Button variant="ghost" size="icon" onClick={() => handleStartCall(true)}>
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleStartCall(false)}>
                      <Phone className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </TabsContent>

        <TabsContent value="resources" className="flex-1 p-4 m-0">
          <h3 className="text-lg font-semibold mb-2">Resources</h3>
          <ul>
            {room.resources.map((resource) => (
              <li key={resource.id} className="mb-2">
                <a href={resource.url} className="text-blue-600 hover:underline">{resource.name}</a>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="schedule" className="flex-1 p-4 m-0">
          <h3 className="text-lg font-semibold mb-2">Schedule</h3>
          <ul>
            {room.schedule.map((event) => (
              <li key={event.id} className="mb-2">
                <span className="font-medium">{event.name}</span>
                <br />
                <span className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="members" className="flex-1 p-4 m-0">
          <h3 className="text-lg font-semibold mb-2">Members</h3>
          <ul>
            {room.members.map((member) => (
              <li key={member.uid} className="mb-2">
                {member.name}
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
      {call && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">{call.type === 'video' ? 'Video' : 'Audio'} Call</h2>
            <p>Call in progress...</p>
            <Button onClick={handleEndCall}>End Call</Button>
          </div>
        </div>
      )}
    </div>
  )
}



