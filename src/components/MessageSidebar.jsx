'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, Hash, Plus, Search, Edit } from 'lucide-react'
import Image from 'next/image'

export default function MessageSidebar({ 
  onSelectDiscussion, 
  onSelectDM,
  selectedDiscussion,
  selectedDM 
}) {
  const [discussExpanded, setDiscussExpanded] = useState(true)
  const [dmsExpanded, setDmsExpanded] = useState(true)

  const discussions = [
    { id: 1, name: 'research-methodology', type: 'discussion' },
    { id: 2, name: 'data-analysis', type: 'discussion' },
    { id: 3, name: 'literature-review', type: 'discussion' },
    { id: 4, name: 'grant-proposals', type: 'discussion' },
    { id: 5, name: 'conference-abstracts', type: 'discussion' },
  ]

  const directMessages = [
    { 
      id: 1, 
      name: 'Dr. Afolabi Akorede', 
      avatar: 'https://picsum.photos/seed/afolabi/200', 
      status: 'online' 
    },
    { 
      id: 2, 
      name: 'Prof. Mohamed Aden Ighe', 
      avatar: 'https://picsum.photos/seed/mohamed/200', 
      status: 'offline',
      isDonut: true
    },
    { 
      id: 3, 
      name: 'Dr. Naledi Dikgale', 
      avatar: 'https://picsum.photos/seed/naledi/200', 
      status: 'offline',
      isDonut: true
    },
    { 
      id: 4, 
      name: 'Habeeb Efiamotu Musa', 
      avatar: 'https://picsum.photos/seed/habeeb/200', 
      status: 'online',
      selected: true
    },
    { 
      id: 5, 
      name: 'Dr. Marvin Nyalik', 
      avatar: 'https://picsum.photos/seed/marvin/200', 
      status: 'online' 
    },
  ]

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-[#6366F1] to-[#9333EA] text-white">
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search Academic Connect"
            className="w-full bg-white/10 pl-8 text-white placeholder:text-gray-300 border-0 focus-visible:ring-1 focus-visible:ring-white"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="mb-3">
          <button
            onClick={() => setDiscussExpanded(!discussExpanded)}
            className="flex w-full items-center gap-2 py-2 text-[15px] hover:text-gray-200"
          >
            <ChevronDown className={`h-4 w-4 ${discussExpanded ? '' : '-rotate-90'} transition-transform`} />
            <span className="font-medium">Discuss</span>
          </button>
          
          {discussExpanded && (
            <div className="space-y-1">
              {discussions.map((discussion) => (
                <button
                  key={discussion.id}
                  onClick={() => onSelectDiscussion(discussion)}
                  className={`flex w-full items-center rounded px-2 py-1 text-[15px] hover:bg-white/10 ${
                    selectedDiscussion?.id === discussion.id ? 'bg-white/20' : ''
                  }`}
                >
                  <Hash className="mr-2 h-4 w-4 text-gray-300" />
                  <span>{discussion.name}</span>
                </button>
              ))}
              <button className="flex w-full items-center rounded px-2 py-1 text-[15px] text-gray-300 hover:bg-white/10">
                <Search className="mr-2 h-4 w-4" />
                Browse all discussions
              </button>
            </div>
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between py-2">
            <button
              onClick={() => setDmsExpanded(!dmsExpanded)}
              className="flex items-center gap-2 text-[15px] hover:text-gray-200"
            >
              <ChevronDown className={`h-4 w-4 ${dmsExpanded ? '' : '-rotate-90'} transition-transform`} />
              <span className="font-medium">Direct messages</span>
            </button>
            <Plus className="h-4 w-4 hover:text-gray-200" />
          </div>
          
          {dmsExpanded && (
            <div className="space-y-1">
              {directMessages.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => onSelectDM(dm)}
                  className={`flex w-full items-center rounded px-2 py-1 text-[15px] hover:bg-white/10 ${
                    dm.selected ? 'bg-white/20' : ''
                  }`}
                >
                  <div className="relative mr-2">
                    <img
                      src={dm.avatar}
                      alt={dm.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#6366F1] ${
                        dm.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    />
                  </div>
                  <span className="truncate">
                    {dm.isDonut && <span className="text-gray-300">Donut, </span>}
                    {dm.name}
                  </span>
                  {dm.selected && (
                    <Edit className="ml-auto h-4 w-4 text-gray-300" />
                  )}
                </button>
              ))}
              <button className="flex w-full items-center rounded px-2 py-1 text-[15px] text-gray-300 hover:bg-white/10">
                <Search className="mr-2 h-4 w-4" />
                Add colleagues
              </button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}