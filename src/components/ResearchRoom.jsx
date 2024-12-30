'use client'

import { useState, useEffect, useRef } from 'react'
import { Channel, MessageList, MessageInput, Thread, Window } from 'stream-chat-react'
import { Button } from '@/components/ui/button'
import { Menu, Video, Phone, Smile, Mic, Square, Settings2, Users, FileText, CalendarDays, Plus, UserPlus, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { chatClient } from './StreamChatProvider'

export default function ResearchRoom({ room, onToggleSidebar }) {
  const [channel, setChannel] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)
  const [events, setEvents] = useState([])
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    autoPlay: true
  })
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: ''
  })
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    if (room) {
      const setupChannel = async () => {
        try {
          const channelId = `research_${room.id}`
          const newChannel = chatClient.channel('messaging', channelId, {
            name: room.name,
          })
          await newChannel.watch()
          setChannel(newChannel)
        } catch (error) {
          console.error('Error setting up channel:', error)
        }
      }

      setupChannel()
    }
  }, [room])

  const handleAddMember = async () => {
    try {
      const response = await fetch('/api/rooms/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: room.id,
          email: newMemberEmail
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add member')
      }

      toast({
        title: "Success",
        description: "Member has been invited to the room",
      })
      setIsAddingMember(false)
      setNewMemberEmail('')
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleCreateEvent = async () => {
    try {
      const newEvent = {
        id: Date.now().toString(),
        ...eventDetails,
        createdAt: new Date().toISOString()
      }
      
      setEvents(prev => [...prev, newEvent])
      
      toast({
        title: "Success",
        description: "Event has been created",
      })
      setIsCreatingEvent(false)
      setEventDetails({
        title: '',
        description: '',
        date: new Date(),
        time: ''
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      
      let time = 0
      recordingTimerRef.current = setInterval(() => {
        time += 1
        setRecordingTime(time)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive"
      })
    }
  }

  const stopRecording = async (shouldSend = true) => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      clearInterval(recordingTimerRef.current)
      setIsRecording(false)
      setRecordingTime(0)

      if (shouldSend) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' })
        const file = new File([audioBlob], 'voice-note.mp3', { type: 'audio/mp3' })
        
        try {
          const response = await channel.sendFile(file)
          await channel.sendMessage({
            text: '🎤 Voice Note',
            attachments: [{
              type: 'audio',
              asset_url: response.file,
              title: 'Voice Note',
            }],
          })
        } catch (error) {
          console.error('Error sending voice note:', error)
          toast({
            title: "Error",
            description: "Failed to send voice note",
            variant: "destructive"
          })
        }
      }
    }
  }

  const handleEmojiSelect = async (emoji) => {
    if (channel) {
      try {
        await channel.sendMessage({
          text: emoji.native,
        })
      } catch (error) {
        console.error('Error sending emoji:', error)
        toast({
          title: "Error",
          description: "Failed to send emoji",
          variant: "destructive"
        })
      }
    }
  }

  const handleStartCall = async (isVideoCall) => {
    if (!channel) return
    
    try {
      const callId = `${channel.id}_${Date.now()}`
      const callType = isVideoCall ? 'video' : 'audio'
      
      // Initialize call with Stream's Video API
      const call = await channel.video.createCall({
        id: callId,
        type: callType,
        options: {
          audio: true,
          video: isVideoCall,
        }
      })

      // Join the call
      await call.join()

      // Notify other members
      await channel.sendMessage({
        text: `Started a ${callType} call`,
        callId,
      })

    } catch (error) {
      console.error('Error starting call:', error)
      toast({
        title: "Error",
        description: "Failed to start call",
        variant: "destructive"
      })
    }
  }

  if (!channel) return null

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="chat" className="flex-1">
        <TabsList className="w-full justify-start px-4 h-12 bg-white border-b">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 p-0 m-0">
          <Channel channel={channel}>
            <Window>
              <div className="flex flex-col h-full">
                <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={onToggleSidebar}
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                    <div>
                      <div className="font-semibold">{room?.name}</div>
                      <div className="text-sm text-muted-foreground">{room?.members?.length} members</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleStartCall(true)}>
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleStartCall(false)}>
                      <Phone className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-grow">
                  <MessageList />
                </ScrollArea>

                <div className="flex items-center space-x-2 p-2 border-t">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme="light"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {isRecording ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => stopRecording(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="default" 
                        size="icon"
                        onClick={() => stopRecording(true)}
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-red-500">
                        Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={startRecording}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="flex-1">
                    <MessageInput focus />
                  </div>
                </div>
              </div>
            </Window>
            <Thread />
          </Channel>
        </TabsContent>

        <TabsContent value="schedule" className="flex-1 p-4 m-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        placeholder="Team Meeting"
                        value={eventDetails.title}
                        onChange={(e) => setEventDetails({
                          ...eventDetails,
                          title: e.target.value
                        })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Weekly team sync..."
                        value={eventDetails.description}
                        onChange={(e) => setEventDetails({
                          ...eventDetails,
                          description: e.target.value
                        })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Date</Label>
                      <Calendar
                        mode="single"
                        selected={eventDetails.date}
                        onSelect={(date) => setEventDetails({
                          ...eventDetails,
                          date: date || new Date()
                        })}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={eventDetails.time}
                        onChange={(e) => setEventDetails({
                          ...eventDetails,
                          time: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateEvent} className="w-full">Create Event</Button>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id} className="bg-accent hover:bg-accent/80 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon">
                              <CalendarDays className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <time dateTime={`${event.date}T${event.time}`}>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} at {event.time}
                          </time>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="flex-1 p-4 m-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Room Members</CardTitle>
              <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter member's email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddMember}>Add Member</Button>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {room?.members?.map((member) => (
                    <div
                      key={member.uid}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.role || 'Member'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="flex-1 p-4 m-0">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Room Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Room Name</Label>
                  <div className="flex gap-2">
                    <Input defaultValue={room?.name} />
                    <Button>Update</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Room Description</Label>
                  <div className="flex gap-2">
                    <Input defaultValue={room?.description} />
                    <Button>Update</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Private Room</p>
                    <p className="text-sm text-muted-foreground">
                      Only invited members can join
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Message Retention</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically delete messages after 30 days
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Room</p>
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone
                    </p>
                  </div>
                  <Button variant="destructive">Delete Room</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
       
      </Tabs>
    </div>
  )
}


