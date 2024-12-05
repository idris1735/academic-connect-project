'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, Plus, Search, Edit, Users, MessageCircle, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function MessageSidebar({
  onSelectDM,
  onSelectResearchRoom,
  onSelectWorkflow,
  onCreateRoom,
  onCreateWorkflow,
  rooms,
  isSidebarOpen,
  onToggleSidebar
}) {
  const [dmsExpanded, setDmsExpanded] = useState(true)
  const [researchRoomsExpanded, setResearchRoomsExpanded] = useState(true)
  const [workflowsExpanded, setWorkflowsExpanded] = useState(true)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDescription, setNewRoomDescription] = useState('')
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
  const { toast } = useToast()

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

  const filteredDirectMessages = directMessages.filter(dm =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateRoom = () => {
    if (newRoomName.trim() === '') {
      toast({
        title: "Error",
        description: "Room name cannot be empty.",
        variant: "destructive"
      })
      return
    }
    onCreateRoom(newRoomName, newRoomDescription)
    setNewRoomName('')
    setNewRoomDescription('')
    setIsCreatingRoom(false)
    toast({
      title: "Room Created",
      description: `Your new room "${newRoomName}" has been created successfully.`,
    })
  }

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim() === '') {
      toast({
        title: "Error",
        description: "Workflow name cannot be empty.",
        variant: "destructive"
      })
      return
    }
    onCreateWorkflow(newWorkflowName, newWorkflowDescription)
    setNewWorkflowName('')
    setNewWorkflowDescription('')
    setIsCreatingWorkflow(false)
    toast({
      title: "Workflow Created",
      description: `Your new workflow "${newWorkflowName}" has been created successfully.`,
    })
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSendDirectMessage = (message, recipient) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${recipient.name}: ${message}`,
    })
  }

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full",
      "md:relative md:translate-x-0"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search messages..."
            className="w-full pl-9 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4">
          <SidebarSection
            title="Direct Messages"
            icon={MessageCircle}
            items={filteredDirectMessages}
            expanded={dmsExpanded}
            setExpanded={setDmsExpanded}
            onSelect={onSelectDM}
            onSendMessage={handleSendDirectMessage}
            ItemIcon={({ item }) => (
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white",
                  item.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                )} />
              </div>
            )}
          />

          <SidebarSection
            title="Research Rooms"
            icon={Users}
            items={filteredRooms}
            expanded={researchRoomsExpanded}
            setExpanded={setResearchRoomsExpanded}
            onSelect={onSelectResearchRoom}
          />

          <SidebarSection
            title="Workflows"
            icon={Edit}
            items={filteredWorkflows}
            expanded={workflowsExpanded}
            setExpanded={setWorkflowsExpanded}
            onSelect={onSelectWorkflow}
          />
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto space-y-2">
        <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
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
              <Input 
                placeholder="Room Name" 
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <Input 
                placeholder="Room Description" 
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateRoom} className="w-full bg-[#6366F1] hover:bg-[#5457E5] text-white">
              Create Room
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreatingWorkflow} onOpenChange={setIsCreatingWorkflow}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Workflow</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input 
                placeholder="Workflow Name" 
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
              />
              <Input 
                placeholder="Workflow Description" 
                value={newWorkflowDescription}
                onChange={(e) => setNewWorkflowDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateWorkflow} className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white">
              Create Workflow
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function SidebarSection({ 
  title, 
  icon: Icon, 
  items, 
  expanded, 
  setExpanded, 
  onSelect, 
  onSendMessage,
  ItemIcon 
}) {
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = (item) => {
    if (newMessage.trim() !== '' && onSendMessage) {
      onSendMessage(newMessage, item)
      setNewMessage('')
    }
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-gray-900 hover:text-[#6366F1]"
      >
        <div className="flex items-center">
          <Icon className="h-4 w-4 mr-2" />
          <span>{title}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-gray-500 transition-transform duration-200",
          expanded ? "" : "-rotate-90"
        )} />
      </button>
      
      {expanded && (
        <div className="mt-1 space-y-1">
          {items.map((item) => (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => onSelect(item)}
                className="flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {ItemIcon ? (
                  <ItemIcon item={item} />
                ) : (
                  <Icon className="h-4 w-4 text-gray-500 mr-3" />
                )}
                <span className="ml-3 flex-1 truncate">{item.name}</span>
                {item.status && (
                  <span className="ml-auto text-xs text-gray-500">
                    {item.status}
                  </span>
                )}
                {item.members && typeof item.members === 'number' && (
                  <span className="ml-auto text-xs text-gray-500">
                    {item.members}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


