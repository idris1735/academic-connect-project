'use client'

import { useState, useEffect } from 'react'
import { Hash, FileText, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const conversations = [
  {
    id: 1,
    name: 'Diana Souza',
    avatar: 'https://picsum.photos/seed/user6/200',
    lastMessage: 'Hi there! How are you doing today?',
    timestamp: '2023-11-29T09:30:00',
    unread: true,
    type: 'direct'
  },
  {
    id: 2,
    name: 'Ravi Kumawat',
    avatar: 'https://picsum.photos/seed/user7/200',
    lastMessage: 'Okay, let\'s discuss this further in our next meeting.',
    timestamp: '2023-11-28T15:45:00',
    type: 'direct'
  },
  {
    id: 3,
    name: 'research-methodology',
    lastMessage: 'Dr. Smith: Let\'s discuss the latest findings in our next session.',
    timestamp: '2023-11-29T11:20:00',
    type: 'discussion'
  },
  {
    id: 4,
    name: 'grant-proposals',
    lastMessage: 'Prof. Johnson: The deadline for submissions has been extended.',
    timestamp: '2023-11-29T08:15:00',
    unread: true,
    type: 'discussion'
  },
]

const researchRooms = [
  {
    id: 1,
    name: 'AI in Healthcare',
    lastUpdate: '2023-11-30T14:20:00',
    members: 5,
  },
  {
    id: 2,
    name: 'Climate Change Mitigation',
    lastUpdate: '2023-11-29T16:45:00',
    members: 8,
  },
]

const workflows = [
  {
    id: 1,
    name: 'Grant Proposal Review',
    lastUpdate: '2023-11-30T10:30:00',
    status: 'In Progress',
  },
  {
    id: 2,
    name: 'Research Paper Draft',
    lastUpdate: '2023-11-29T18:15:00',
    status: 'Under Review',
  },
]

export default function MessageList({ onSelectConversation, selectedConversation, onSelectResearchRoom, onSelectWorkflow }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Tabs defaultValue="messages" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="research">Research</TabsTrigger>
        <TabsTrigger value="workflow">Workflow</TabsTrigger>
      </TabsList>
      <TabsContent value="messages">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="divide-y divide-gray-200">
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                className={`flex items-center gap-4 p-4 w-full text-left transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-[#6366F1]/10'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                {conversation.type === 'direct' ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                    <Hash className="h-5 w-5 text-[#6366F1]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold truncate ${conversation.unread ? 'text-[#6366F1]' : 'text-gray-900'}`}>
                      {conversation.type === 'discussion' && '#'}
                      {conversation.name}
                    </h4>
                    <span className="text-xs text-gray-500">{format(new Date(conversation.timestamp), 'MMM d')}</span>
                  </div>
                  <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                    {conversation.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="research">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="divide-y divide-gray-200">
            {researchRooms.map(room => (
              <button
                key={room.id}
                className="flex items-center gap-4 p-4 w-full text-left transition-colors hover:bg-gray-50"
                onClick={() => onSelectResearchRoom(room)}
              >
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold truncate text-gray-900">{room.name}</h4>
                    <span className="text-xs text-gray-500">{format(new Date(room.lastUpdate), 'MMM d')}</span>
                  </div>
                  <p className="text-sm text-gray-500">{room.members} members</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="workflow">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="divide-y divide-gray-200">
            {workflows.map(workflow => (
              <button
                key={workflow.id}
                className="flex items-center gap-4 p-4 w-full text-left transition-colors hover:bg-gray-50"
                onClick={() => onSelectWorkflow(workflow)}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold truncate text-gray-900">{workflow.name}</h4>
                    <span className="text-xs text-gray-500">{format(new Date(workflow.lastUpdate), 'MMM d')}</span>
                  </div>
                  <p className="text-sm text-gray-500">{workflow.status}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}

