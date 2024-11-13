'use client'

import { Hash } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function MessageList({ onSelectConversation, selectedConversation }) {
  const conversations = [
    {
      id: 1,
      name: 'Diana Souza',
      avatar: 'https://picsum.photos/seed/user6/200',
      lastMessage: 'Hi olanike, Your unique perspective is what...',
      timestamp: 'Nov 7',
      unread: true,
      type: 'direct'
    },
    {
      id: 2,
      name: 'Ravi Kumawat',
      avatar: 'https://picsum.photos/seed/user7/200',
      lastMessage: 'Ravi: Okay',
      timestamp: 'Nov 6',
      type: 'direct'
    },
    {
      id: 3,
      name: 'research-methodology',
      lastMessage: 'Dr. Smith: Let\'s discuss the latest...',
      timestamp: 'Nov 8',
      type: 'discussion'
    },
    {
      id: 4,
      name: 'grant-proposals',
      lastMessage: 'Prof. Johnson: The deadline for...',
      timestamp: 'Nov 7',
      unread: true,
      type: 'discussion'
    },
  ]

  return (
    <ScrollArea className="h-full border-r border-gray-200">
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
                <span className="text-xs text-gray-500">{conversation.timestamp}</span>
              </div>
              <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                {conversation.lastMessage}
              </p>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}