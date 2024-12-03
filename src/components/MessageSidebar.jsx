'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, Hash, Plus, Search, Edit, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function MessageSidebar({ 
  onSelectDiscussion, 
  onSelectDM,
  onSelectResearchRoom,
  onSelectWorkflow,
  onCreateRoom,
  rooms
}) {
  const [discussExpanded, setDiscussExpanded] = useState(true)
  const [dmsExpanded, setDmsExpanded] = useState(true)
  const [researchRoomsExpanded, setResearchRoomsExpanded] = useState(true)
  const [workflowsExpanded, setWorkflowsExpanded] = useState(true)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDescription, setNewRoomDescription] = useState('')

  const discussions = [
    { id: 1, name: 'research-methodology', type: 'discussion' },
    { id: 2, name: 'data-analysis', type: 'discussion' },
    { id: 3, name: 'literature-review', type: 'discussion' },
    { id: 4, name: 'grant-proposals', type: 'discussion' },
    { id: 5, name: 'conference-abstracts', type: 'discussion' },
  ]

  const directMessages = [
    { id: 1, name: 'Dr. Afolabi Akorede', avatar: 'https://picsum.photos/seed/afolabi/200', status: 'online' },
    { id: 2, name: 'Prof. Mohamed Aden Ighe', avatar: 'https://picsum.photos/seed/mohamed/200', status: 'offline' },
    { id: 3, name: 'Dr. Naledi Dikgale', avatar: 'https://picsum.photos/seed/naledi/200', status: 'offline' },
    { id: 4, name: 'Habeeb Efiamotu Musa', avatar: 'https://picsum.photos/seed/habeeb/200', status: 'online' },
    { id: 5, name: 'Dr. Marvin Nyalik', avatar: 'https://picsum.photos/seed/marvin/200', status: 'online' },
  ]

  const workflows = [
    { id: 1, name: 'Grant Proposal Review', status: 'In Progress' },
    { id: 2, name: 'Research Paper Draft', status: 'Under Review' },
  ]

  const handleCreateRoom = () => {
    onCreateRoom(newRoomName, newRoomDescription)
    setNewRoomName('')
    setNewRoomDescription('')
  }

  return (
    <div className="flex h-full flex-col bg-gray-100">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search Academic Connect"
            className="w-full pl-10 bg-white"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <SidebarSection
          title="Research Discussions"
          items={discussions}
          expanded={discussExpanded}
          setExpanded={setDiscussExpanded}
          onSelect={onSelectDiscussion}
          ItemIcon={Hash}
        />

        <SidebarSection
          title="Direct Messages"
          items={directMessages}
          expanded={dmsExpanded}
          setExpanded={setDmsExpanded}
          onSelect={onSelectDM}
          ItemIcon={({ item }) => (
            <Avatar className="h-6 w-6">
              <AvatarImage src={item.avatar} alt={item.name} />
              <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        />

        <SidebarSection
          title="Research Rooms"
          items={rooms}
          expanded={researchRoomsExpanded}
          setExpanded={setResearchRoomsExpanded}
          onSelect={onSelectResearchRoom}
          ItemIcon={Users}
        />

        <SidebarSection
          title="Workflows"
          items={workflows}
          expanded={workflowsExpanded}
          setExpanded={setWorkflowsExpanded}
          onSelect={onSelectWorkflow}
          ItemIcon={Edit}
        />
      </ScrollArea>

      <div className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#6366F1] hover:bg-[#5457E5] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create New Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input 
                  id="name" 
                  placeholder="Room Name" 
                  className="col-span-4"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input 
                  id="description" 
                  placeholder="Room Description" 
                  className="col-span-4"
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleCreateRoom} className="bg-[#6366F1] hover:bg-[#5457E5] text-white">Create Room</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function SidebarSection({ title, items, expanded, setExpanded, onSelect, ItemIcon }) {
  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 ${expanded ? '' : '-rotate-90'} transition-transform`} />
      </button>
      
      {expanded && (
        <div className="mt-2 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            >
              <ItemIcon className="mr-2 h-4 w-4" item={item} />
              <span className="truncate">{item.name}</span>
              {item.status && <span className="ml-auto text-xs text-gray-500">{item.status}</span>}
              {item.members && <span className="ml-auto text-xs text-gray-500">{item.members} members</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


