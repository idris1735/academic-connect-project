'use client'

import { Hash } from 'lucide-react'
import Link from 'next/link'

export default function MessageList({ onSelectConversation }) {
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
    // Add more conversations and discussions as needed
  ]

  return (
    <div className="divide-y">
      {conversations.map(conversation => (
        <Link
          key={conversation.id}
          href={conversation.type === 'discussion' ? `/messages?discussion=${conversation.id}` : `/messages?dm=${conversation.id}`}
          className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelectConversation(conversation)}
        >
          {conversation.type === 'direct' ? (
            <img src={conversation.avatar} alt={conversation.name} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <Hash className="w-6 h-6 text-gray-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold truncate">
                {conversation.type === 'discussion' && '#'}
                {conversation.name}
              </h4>
              <span className="text-sm text-gray-500">{conversation.timestamp}</span>
            </div>
            <p className={`text-sm truncate ${conversation.unread ? 'font-semibold' : 'text-gray-500'}`}>
              {conversation.lastMessage}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}