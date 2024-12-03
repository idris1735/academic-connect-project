'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Video, Mic, MicOff, VideoOff, PhoneOff, Monitor, CalendarIcon, Paperclip, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

const mockApi = {
  sendMessage: (message) => 
    new Promise((resolve) => 
      setTimeout(() => resolve({ 
        id: Date.now(), 
        content: message, 
        timestamp: new Date() 
      }), 500)
    ),
  uploadFile: (file) => 
    new Promise((resolve) => 
      setTimeout(() => resolve(URL.createObjectURL(file)), 1000)
    ),
}

export default function MessageView({ conversation, onCreateRoom }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [date, setDate] = useState()
  const [activeTab, setActiveTab] = useState('chat')
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDescription, setNewRoomDescription] = useState('')
  const fileInputRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    if (conversation) {
      setMessages([
        { id: 1, sender: conversation.name, content: "Hello! How's your research going?", timestamp: new Date() },
        { id: 2, sender: 'You', content: "It's going well, thanks for asking!", timestamp: new Date() },
      ])
    }
  }, [conversation])

  const handleSend = async (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      try {
        const response = await mockApi.sendMessage(newMessage)
        const message = {
          id: response.id,
          sender: 'You',
          content: response.content,
          timestamp: response.timestamp,
        }
        setMessages(prev => [...prev, message])
        setNewMessage('')
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const fileUrl = await mockApi.uploadFile(file)
        const message = {
          id: Date.now(),
          sender: 'You',
          content: `File: ${file.name}`,
          fileUrl,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, message])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleStartCall = () => {
    setIsInCall(true)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      })
      .catch(error => {
        console.error('Error accessing media devices:', error)
        toast({
          title: "Error",
          description: "Failed to start video call. Please check your camera and microphone permissions.",
          variant: "destructive",
        })
      })
  }

  const handleEndCall = () => {
    setIsInCall(false)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = isMuted
      }
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(prev => !prev)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn
      }
    }
  }

  const toggleScreenShare = () => {
    if (!isScreenSharing) {
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(stream => {
          setIsScreenSharing(true)
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        })
        .catch(error => {
          console.error('Error sharing screen:', error)
          toast({
            title: "Error",
            description: "Failed to share screen. Please try again.",
            variant: "destructive",
          })
        })
    } else {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      }
      setIsScreenSharing(false)
      handleStartCall() // Restart camera
    }
  }

  const handleCreateRoom = () => {
    onCreateRoom(newRoomName, newRoomDescription)
    setNewRoomName('')
    setNewRoomDescription('')
  }

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Select a conversation to start messaging</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback>{conversation.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{conversation.name}</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleStartCall}>
              <Video className="h-4 w-4 mr-2" />
              Video Call
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Room
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="justify-start p-2 bg-gray-100">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${message.sender === 'You' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === 'You' ? 'bg-[#6366F1] text-white' : 'bg-gray-200'
                  }`}
                >
                  <p>{message.content}</p>
                  {message.fileUrl && (
                    <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-200 underline">
                      View File
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {format(message.timestamp, 'HH:mm')}
                </p>
              </div>
            ))}
          </ScrollArea>

          <form onSubmit={handleSend} className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Button type="submit" className="bg-[#6366F1] hover:bg-[#5457E5] text-white">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="files" className="flex-grow p-4">
          <h3 className="text-lg font-semibold mb-4">Shared Files</h3>
          {/* Add a list of shared files here */}
        </TabsContent>
        <TabsContent value="tasks" className="flex-grow p-4">
          <h3 className="text-lg font-semibold mb-4">Tasks</h3>
          {/* Add a task list or task management component here */}
        </TabsContent>
      </Tabs>

      <Dialog open={isInCall} onOpenChange={setIsInCall}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Video Call with {conversation.name}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-black">
            <video ref={remoteVideoRef} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 right-4 w-1/4 aspect-video">
              <video ref={localVideoRef} className="w-full h-full object-cover" muted autoPlay playsInline />
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="outline" onClick={toggleMute}>
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
            </Button>
            <Button variant="destructive" onClick={handleEndCall}>
              <PhoneOff className="h-4 w-4" />
              <span className="sr-only">End call</span>
            </Button>
            <Button variant="outline" onClick={toggleVideo}>
              {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              <span className="sr-only">{isVideoOn ? 'Turn off video' : 'Turn on video'}</span>
            </Button>
            <Button variant="outline" onClick={toggleScreenShare}>
              <Monitor className="h-4 w-4" />
              <span className="sr-only">{isScreenSharing ? 'Stop sharing screen' : 'Share screen'}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}




