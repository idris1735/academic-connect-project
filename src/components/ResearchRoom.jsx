'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, FileText, Users } from 'lucide-react'

export default function ResearchRoom({ room }) {
  const [activeTab, setActiveTab] = useState('discussion')
  const [newMessage, setNewMessage] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    // Implement send message logic here
    console.log('Sending message:', newMessage)
    setNewMessage('')
  }

  if (!room) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Select a research room to view</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">{room.name}</h2>
        <p className="text-sm text-gray-500">{room.members} members</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="justify-start p-2 bg-gray-100">
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="discussion" className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow p-4">
            {/* Add discussion messages here */}
          </ScrollArea>

          <form onSubmit={handleSend} className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow"
              />
              <Button type="submit" className="bg-[#6366F1] hover:bg-[#5457E5] text-white">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="resources" className="flex-grow p-4">
          <h3 className="text-lg font-semibold mb-4">Shared Resources</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span>Research Paper Draft.pdf</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span>Literature Review.docx</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span>Data Analysis Results.xlsx</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="members" className="flex-grow p-4">
          <h3 className="text-lg font-semibold mb-4">Room Members</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/member1/200" alt="Member 1" />
                <AvatarFallback>M1</AvatarFallback>
              </Avatar>
              <span>Dr. Jane Smith</span>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/member2/200" alt="Member 2" />
                <AvatarFallback>M2</AvatarFallback>
              </Avatar>
              <span>Prof. John Doe</span>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/member3/200" alt="Member 3" />
                <AvatarFallback>M3</AvatarFallback>
              </Avatar>
              <span>Dr. Emily Johnson</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}






