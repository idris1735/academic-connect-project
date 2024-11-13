// src/components/MessageView.jsx
'use client'

import { useState } from 'react'
import { Send, Video, Phone, Mic, MicOff, VideoOff, PhoneOff, Users, Monitor, CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns'
import { cn } from "@/lib/utils"

// Dummy messages data
const dummyMessages = [
  {
    id: 1,
    sender: 'Diana Souza',
    content: 'Hi there! How are you doing today?',
    timestamp: '9:30 AM',
    avatar: 'https://picsum.photos/seed/user6/200',
    isSelf: false
  },
  {
    id: 2,
    sender: 'You',
    content: "I'm doing great, thanks! How about you?",
    timestamp: '9:32 AM',
    isSelf: true
  },
  {
    id: 3,
    sender: 'Diana Souza',
    content: "I'm good too! Just wanted to check in about the research project.",
    timestamp: '9:35 AM',
    avatar: 'https://picsum.photos/seed/user6/200',
    isSelf: false
  },
  {
    id: 4,
    sender: 'You',
    content: "Yes, I've been making good progress. Would you like to schedule a call to discuss it?",
    timestamp: '9:38 AM',
    isSelf: true
  }
]

export default function MessageView({ conversation }) {
  const [messages, setMessages] = useState(dummyMessages)
  const [message, setMessage] = useState('')
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [date, setDate] = useState()

  const handleSend = (e) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        content: message,
        timestamp: format(new Date(), 'h:mm a'),
        isSelf: true
      }
      setMessages([...messages, newMessage])
      setMessage('')
    }
  }

  const handleScheduleMeeting = (selectedDate) => {
    if (selectedDate) {
      // In a real app, this would integrate with a calendar API
      console.log('Scheduling meeting for:', format(selectedDate, 'PPP'))
      setDate(selectedDate)
    }
  }

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Send className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">Your Messages</h3>
        <p className="text-sm text-gray-500">Send private photos and messages to a friend or group</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {conversation.type === 'direct' ? (
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-12 w-12 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#6366F1]" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {conversation.type === 'discussion' && '#'}
                {conversation.name}
              </h2>
              {conversation.type === 'direct' && (
                <p className="text-sm text-gray-500">Online</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-12 px-6 text-[#6366F1] hover:text-[#6366F1] hover:bg-[#6366F1]/10"
              onClick={() => setIsInCall(true)}
            >
              <Video className="h-5 w-5 mr-2" />
              Video Call
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 px-6 text-[#6366F1] hover:text-[#6366F1] hover:bg-[#6366F1]/10",
                    date && "text-[#6366F1]"
                  )}
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {date ? format(date, "PPP") : "Schedule"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleScheduleMeeting}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${msg.isSelf ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                {!msg.isSelf && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar} alt={msg.sender} />
                    <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-lg px-4 py-2 ${
                    msg.isSelf ? 'bg-[#6366F1] text-white' : 'bg-gray-100'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-[#6366F1] hover:bg-[#5457E5] h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <Dialog open={isInCall} onOpenChange={setIsInCall}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Virtual Meeting with {conversation.name}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {isVideoOn ? (
                <video className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                <video className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 px-6 py-3 rounded-full">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${isMuted ? 'bg-red-500 text-white hover:bg-red-600' : 'text-white hover:bg-white/20'}`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-red-500 text-white hover:bg-red-600"
                onClick={() => setIsInCall(false)}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${!isVideoOn ? 'bg-red-500 text-white hover:bg-red-600' : 'text-white hover:bg-white/20'}`}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${isScreenSharing ? 'bg-green-500 text-white hover:bg-green-600' : 'text-white hover:bg-white/20'}`}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}