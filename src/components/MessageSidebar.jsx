"use client";

import { ChannelList, useChannelStateContext } from 'stream-chat-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

const customChannelFilter = {
  type: { $in: ['messaging', 'team'] },
  members: { $in: ['olanike'] }
}

const CustomChannelPreview = ({ channel, setActiveChannel }) => {
  const { messages } = useChannelStateContext()
  
  return (
    <div 
      className="p-4 border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => setActiveChannel(channel)}
    >
      <div className="font-medium">{channel.data.name || 'Unnamed Channel'}</div>
      <div className="text-sm text-gray-500">
        {messages[messages.length - 1]?.text || 'No messages yet'}
      </div>
    </div>
  )
}

export default function MessageSidebar({ 
  onSelectDM, 
  onSelectResearchRoom, 
  rooms, 
  isSidebarOpen, 
  onToggleSidebar 
}) {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')

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

      <div className="flex-1 overflow-y-auto">
        {/* Direct Messages Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Direct Messages</h3>
          {rooms.directMessages.map((dm) => (
            <div
              key={dm.id}
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => onSelectDM(dm)}
            >
              <div className="relative">
                <img
                  src={dm.avatar}
                  alt={dm.name}
                  className="w-10 h-10 rounded-full"
                />
                {dm.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="ml-3">
                <div className="font-medium">{dm.name}</div>
                <div className="text-sm text-gray-500">{dm.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Research Rooms Section */}
        <div className="p-4 border-t">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Research Rooms</h3>
          {rooms.researchRooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => onSelectResearchRoom(room)}
            >
              <img
                src={room.avatar}
                alt={room.name}
                className="w-10 h-10 rounded-lg"
              />
              <div className="ml-3">
                <div className="font-medium">{room.name}</div>
                <div className="text-sm text-gray-500">
                  {room.members.length} members
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#6366F1] hover:bg-[#5457E5] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Research Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Research Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                // This would normally connect to a backend
                toast({
                  title: "Demo Mode",
                  description: "Room creation would be handled by the backend",
                });
                setIsCreatingRoom(false);
              }}
              className="w-full bg-[#6366F1] hover:bg-[#5457E5] text-white"
            >
              Create Room
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
