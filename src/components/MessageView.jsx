'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Video, Mic, MicOff, VideoOff, PhoneOff, Monitor, Send, Calendar, Menu } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function MessageView({ conversation, onToggleSidebar, isSidebarOpen }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello!', sender: conversation?.name, timestamp: '13:03' },
    { id: 2, text: 'Hi there!', sender: 'You', timestamp: '13:03' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const { toast } = useToast()

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return
    setMessages([...messages, {
      id: Date.now(),
      text: newMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setNewMessage('')
  }

  const handleStartCall = (isVideo) => {
    setIsInCall(true)
    navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      })
      .catch(error => {
        console.error('Error accessing media devices:', error)
        toast({
          title: 'Error',
          description: 'Failed to start call. Please check your camera and microphone permissions.',
          variant: 'destructive',
        })
      })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation?.avatar} alt={conversation?.name} />
            <AvatarFallback>{conversation?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{conversation?.name}</h2>
            <p className="text-sm text-gray-500">Active now</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleStartCall(true)}>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleStartCall(false)}>
            <Mic className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 h-[calc(100vh-220px)]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[70%] ${
                  message.sender === 'You'
                    ? 'bg-[#6366F1] text-white rounded-l-lg rounded-br-lg'
                    : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-bl-lg'
                } px-4 py-2`}
              >
                <div>
                  <div className="text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'You' ? 'text-indigo-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        <div className="flex items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 mr-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} className="bg-[#6366F1] hover:bg-[#5457E5]">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isInCall} onOpenChange={setIsInCall}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Call with {conversation?.name}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video ref={remoteVideoRef} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 right-4 w-1/4 aspect-video">
              <video ref={localVideoRef} className="w-full h-full object-cover rounded-lg" muted autoPlay playsInline />
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="outline" size="icon" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button variant="destructive" size="icon" onClick={() => setIsInCall(false)}>
              <PhoneOff className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsVideoOn(!isVideoOn)}>
              {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsScreenSharing(!isScreenSharing)}>
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
