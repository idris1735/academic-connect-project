'use client'

import { Channel, MessageList, MessageInput, Thread, Window } from 'stream-chat-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { chatClient } from './StreamChatProvider'
import Workflow from './Workflow'

export default function ResearchRoom({ room, onToggleSidebar }) {
  const [channel, setChannel] = useState(null)

  useEffect(() => {
    if (room) {
      const setupChannel = async () => {
        const channelId = `research:${room.id}`
        const newChannel = chatClient.channel('team', channelId, {
          name: room.name,
          members: room.members?.map(member => member.id) || [],
          image: room.avatar,
        })
        
        await newChannel.watch()
        setChannel(newChannel)
      }

      setupChannel()
    }
  }, [room])

  if (!channel) return null

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Tabs defaultValue="chat" className="flex-1">
        <TabsList className="w-full justify-start px-4 h-12 bg-white border-b">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
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
                  </div>
                </div>
              </div>
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </TabsContent>

        <TabsContent value="workflow" className="flex-1 p-0 m-0">
          <Workflow workflow={room} onToggleSidebar={onToggleSidebar} />
        </TabsContent>

        {/* Keep your existing tabs content for resources, schedule, and members */}
      </Tabs>
    </div>
  )
}
