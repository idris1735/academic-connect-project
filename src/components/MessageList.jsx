'use client'

import { useState, useEffect } from 'react'
import { Hash, FileText, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

export default function MessageList({
  onSelectConversation,
  selectedConversation,
  onSelectWorkflow,
}) {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [rooms, setRooms] = useState({ DM: [], RR: [], GM: [] })

  useEffect(() => {
    setMounted(true)
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/messages/rooms')
      const data = await response.json()

      if (response.ok) {
        setRooms(data.rooms)
      } else {
        console.error('Failed to fetch rooms:', data.message)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  const renderRoomList = (roomType) => {
    const roomList = rooms[roomType] || []
    
    return roomList.map((room) => (
      <button
        key={room.id}
        className={`flex items-center gap-4 p-4 w-full text-left transition-colors ${
          selectedConversation?.id === room.id
            ? 'bg-[#6366F1]/10'
            : 'hover:bg-gray-50'
        }`}
        onClick={() => onSelectConversation(room)}
      >
        {roomType === 'DM' ? (
          <Avatar className='h-10 w-10'>
            <AvatarImage
              src={room.avatar}
              alt={room.name}
            />
            <AvatarFallback>
              {room.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className='h-10 w-10 rounded-full bg-[#6366F1]/10 flex items-center justify-center'>
            <Hash className='h-5 w-5 text-[#6366F1]' />
          </div>
        )}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between'>
            <h4 className={`font-semibold truncate ${
              room.unreadCount > 0 ? 'text-[#6366F1]' : 'text-gray-900'
            }`}>
              {room.name}
            </h4>
            <span className='text-xs text-gray-500'>
              {room.lastMessageTime ? format(new Date(room.lastMessageTime), 'MMM d') : 
               format(new Date(room.createdAt), 'MMM d')}
            </span>
          </div>
          <p className={`text-sm truncate ${
            room.unreadCount > 0
              ? 'font-medium text-gray-900'
              : 'text-gray-500'
          }`}>
            {room.lastMessage?.content || 'No messages yet'}
          </p>
          {roomType === 'RR' && room.postIds?.length > 0 && (
            <div className="mt-1 text-xs text-indigo-600">
              {room.postIds.length} linked post{room.postIds.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </button>
    ))
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue='messages' className='w-full flex-1'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='messages'>Messages</TabsTrigger>
          <TabsTrigger value='research'>Research</TabsTrigger>
          <TabsTrigger value='workflow'>Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value='messages' className="flex-1">
          <ScrollArea className='h-[calc(100vh-120px)]'>
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading messages...</div>
            ) : (
              <div className='divide-y divide-gray-200'>
                {renderRoomList('DM')}
                {rooms.DM?.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No direct messages yet
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value='research' className="flex-1">
          <ScrollArea className='h-[calc(100vh-120px)]'>
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading research rooms...</div>
            ) : (
              <div className='divide-y divide-gray-200'>
                {renderRoomList('RR')}
                {rooms.RR?.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No research rooms yet
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value='workflow' className="flex-1">
          <ScrollArea className='h-[calc(100vh-120px)]'>
            <div className='divide-y divide-gray-200'>
              {workflows.map((workflow) => (
                <button
                  key={workflow.id}
                  className='flex items-center gap-4 p-4 w-full text-left transition-colors hover:bg-gray-50'
                  onClick={() => onSelectWorkflow(workflow)}
                >
                  <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                    <Users className='h-5 w-5 text-blue-600' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-semibold truncate text-gray-900'>
                        {workflow.name}
                      </h4>
                      <span className='text-xs text-gray-500'>
                        {format(new Date(workflow.lastUpdate), 'MMM d')}
                      </span>
                    </div>
                    <p className='text-sm text-gray-500'>{workflow.status}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
