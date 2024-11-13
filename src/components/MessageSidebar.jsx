'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, Hash, Plus, Search, Edit } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
    { id: 1, name: 'Dr. Afolabi Akorede', avatar: 'https://picsum.photos/seed/afolabi/200', status: 'online' },
    { id: 2, name: 'Prof. Mohamed Aden Ighe', avatar: 'https://picsum.photos/seed/mohamed/200', status: 'offline', isDonut: true },
    { id: 3, name: 'Dr. Naledi Dikgale', avatar: 'https://picsum.photos/seed/naledi/200', status: 'offline', isDonut: true },
    { id: 4, name: 'Habeeb Efiamotu Musa', avatar: 'https://picsum.photos/seed/habeeb/200', status: 'online', selected: true },
    { id: 5, name: 'Dr. Marvin Nyalik', avatar: 'https://picsum.photos/seed/marvin/200', status: 'online' },
  ]

  return (
    <div className="flex h-full flex-col bg-[#6366F1] text-white">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6366F1]" />
          <Input
            placeholder="Search Academic Connect"
            className="w-full bg-white pl-10 text-[#6366F1] placeholder:text-[#6366F1]/50 border-0 focus-visible:ring-2 focus-visible:ring-white"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="mb-6">
          <button
            onClick={() => setDiscussExpanded(!discussExpanded)}
            className="flex w-full items-center justify-between py-2 text-[15px] font-semibold hover:text-gray-200"
          >
            <span>Research Discussions</span>
            <ChevronDown className={`h-4 w-4 ${discussExpanded ? '' : '-rotate-90'} transition-transform`} />
          </button>
          
          {discussExpanded && (
            <div className="mt-2 space-y-1">
              {discussions.map((discussion) => (
                <button
                  key={discussion.id}
                  onClick={() => onSelectDiscussion(discussion)}
                  className={`flex w-full items-center rounded-md px-2 py-1.5 text-[15px] transition-colors ${
                    selectedDiscussion?.id === discussion.id ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Hash className="mr-2 h-4 w-4" />
                  <span>{discussion.name}</span>
                </button>
              ))}
              <button className="flex w-full items-center rounded-md px-2 py-1.5 text-[15px] text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create new discussion
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => setDmsExpanded(!dmsExpanded)}
            className="flex w-full items-center justify-between py-2 text-[15px] font-semibold hover:text-gray-200"
          >
            <span>Direct Messages</span>
            <ChevronDown className={`h-4 w-4 ${dmsExpanded ? '' : '-rotate-90'} transition-transform`} />
          </button>
          
          {dmsExpanded && (
            <div className="mt-2 space-y-1">
              {directMessages.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => onSelectDM(dm)}
                  className={`flex w-full items-center rounded-md px-2 py-1.5 text-[15px] transition-colors ${
                    dm.selected ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={dm.avatar} alt={dm.name} />
                    <AvatarFallback>{dm.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate flex-1 text-left">
                    {dm.isDonut && <span className="text-white/60 mr-1">Donut •</span>}
                    {dm.name}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${dm.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                </button>
              ))}
              <button className="flex w-full items-center rounded-md px-2 py-1.5 text-[15px] text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add new colleague
              </button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}