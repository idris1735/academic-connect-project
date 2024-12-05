'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Mic, MicOff, VideoOff, PhoneOff, Monitor, Plus, Send, Download, Paperclip, Menu, CalendarIcon, Clock, UserPlus } from 'lucide-react'
import { useToast, Toaster } from "@/components/ui/toast"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ResearchRoom({ room, onToggleSidebar }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello everyone! Welcome to the AI in Healthcare research room.", sender: "Dr. Afolabi Akorede", timestamp: "09:00" },
    { id: 2, text: "Thanks for having me. I'm excited to collaborate on this project.", sender: "You", timestamp: "09:02" }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [resources, setResources] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState('')
  const [activityName, setActivityName] = useState('')
  const [scheduledActivities, setScheduledActivities] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [allUsers, setAllUsers] = useState([
    { id: 1, name: 'Dr. Afolabi Akorede', avatar: 'https://picsum.photos/seed/afolabi/200' },
    { id: 2, name: 'Prof. Mohamed Aden Ighe', avatar: 'https://picsum.photos/seed/mohamed/200' },
    { id: 3, name: 'Dr. Naledi Dikgale', avatar: 'https://picsum.photos/seed/naledi/200' },
    { id: 4, name: 'Habeeb Efiamotu Musa', avatar: 'https://picsum.photos/seed/habeeb/200' },
    { id: 5, name: 'Dr. Marvin Nyalik', avatar: 'https://picsum.photos/seed/marvin/200' },
  ])
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return
    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages([...messages, newMsg])
    setNewMessage('')
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const newResource = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        sender: 'You',
        timestamp: new Date()
      }
      setResources([...resources, newResource])
      const newMsg = {
        id: Date.now(),
        text: `Shared a file: ${file.name}`,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resource: newResource
      }
      setMessages([...messages, newMsg])
      toast({
        title: "File Uploaded",
        description: `${file.name} has been added to resources.`
      })
    }
  }

  const handleScheduleActivity = () => {
    if (!activityName || !selectedTime) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      })
      return
    }

    const newActivity = {
      id: Date.now(),
      name: activityName,
      date: selectedDate,
      time: selectedTime
    }

    setScheduledActivities([...scheduledActivities, newActivity])

    toast({
      title: "Activity Scheduled",
      description: `${activityName} scheduled for ${selectedDate.toDateString()} at ${selectedTime}.`
    })
    setActivityName('')
    setSelectedTime('')
  }

  const handleInviteUser = (user) => {
    if (selectedMembers.some(member => member.id === user.id)) {
      setSelectedMembers(selectedMembers.filter(member => member.id !== user.id))
    } else {
      setSelectedMembers([...selectedMembers, user])
    }
  }

  const handleSendInvitations = () => {
    selectedMembers.forEach(member => {
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${member.name}.`
      })
    })
    setSelectedMembers([])
  }

  const handleStartCall = (isVideoCall) => {
    navigator.mediaDevices.getUserMedia({ video: isVideoCall, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        setIsInCall(true)
        setIsVideoOn(isVideoCall)
        
        // Simulate remote user joining the call
        setTimeout(() => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream.clone()
          }
        }, 1000)
      })
      .catch(error => {
        console.error('Error accessing media devices:', error)
        toast({
          title: "Error",
          description: "Failed to start call. Please check your camera and microphone permissions.",
          variant: "destructive",
        })
      })
  }

  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !isMuted)
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !isVideoOn)
      setIsVideoOn(!isVideoOn)
    }
  }

  const toggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenSharing()
    } else {
      startScreenSharing()
    }
  }

  const startScreenSharing = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        setIsScreenSharing(true)
      })
      .catch(error => {
        console.error('Error starting screen share:', error)
        toast({
          title: "Error",
          description: "Failed to start screen sharing.",
          variant: "destructive",
        })
      })
  }

  const stopScreenSharing = () => {
    const stream = localVideoRef.current?.srcObject
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setIsScreenSharing(false)
    handleStartCall(isVideoOn)
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasActivity = scheduledActivities.some(
        activity => activity.date.toDateString() === date.toDateString()
      )
      return hasActivity ? 'bg-blue-100 text-blue-500 font-bold' : null
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden mr-2"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">{room?.name || 'Research Room'}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex md:hidden"
            onClick={() => handleStartCall(true)}
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex md:hidden"
            onClick={() => handleStartCall(false)}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="hidden md:flex"
            onClick={() => handleStartCall(true)}
          >
            <Video className="h-4 w-4 mr-2" />
            Video Call
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="hidden md:flex"
            onClick={() => handleStartCall(false)}
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice Call
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Members</DialogTitle>
              </DialogHeader>
              <Command>
                <CommandInput placeholder="Search members..." />
                <CommandEmpty>No members found.</CommandEmpty>
                <CommandGroup>
                  {allUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => handleInviteUser(user)}
                    >
                      <div className={cn(
                        "flex items-center",
                        selectedMembers.some(member => member.id === user.id) ? "opacity-50" : ""
                      )}>
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
              <Button onClick={handleSendInvitations} className="mt-4">Send Invitations</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1">
        <TabsList className="w-full justify-start px-4 h-12 bg-white border-b">
          <TabsTrigger value="chat" className="data-[state=active]:bg-gray-100">Chat</TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-gray-100">Resources</TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-gray-100">Schedule</TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-gray-100">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 p-0 m-0">
          <div className="flex flex-col h-[calc(100vh-220px)]">
            <ScrollArea className="flex-1 p-4 h-[calc(100vh-220px)]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col",
                      message.sender === "You" ? "items-end" : "items-start"
                    )}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm text-gray-500">{message.sender}</span>
                      <span className="text-xs text-gray-400">{message.timestamp}</span>
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        message.sender === "You"
                          ? "bg-[#6366F1] text-white"
                          : "bg-white text-gray-900"
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.resource && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs"
                          onClick={() => window.open(message.resource.url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download {message.resource.name}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t">
              <div className="flex items-center space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="h-[calc(100vh-220px)] p-4 m-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                >
                  <div>
                    <h4 className="font-medium">{resource.name}</h4>
                    <p className="text-sm text-gray-500">
                      Shared by {resource.sender} on {resource.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => window.open(resource.url, '_blank')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div></ScrollArea>
        </TabsContent>

        <TabsContent value="schedule" className="h-[calc(100vh-220px)] p-6 m-0 bg-indigo-50/20">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Calendar Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-lg">
                  <CardHeader className="bg-indigo-500 text-white rounded-t-lg px-6 py-4">
                    <CardTitle className="flex items-center text-xl font-semibold">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Research Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-white rounded-xl shadow-inner p-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="mx-auto"
                        modifiers={{
                          booked: scheduledActivities.map(activity => activity.date)
                        }}
                        modifiersClassNames={{
                          booked: "bg-indigo-100 font-medium text-indigo-500 hover:bg-indigo-200"
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* New Activity Form */}
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-indigo-500 text-white rounded-t-lg px-6 py-4">
                    <CardTitle className="text-lg font-semibold">New Activity</CardTitle>
                    <CardDescription className="text-indigo-50 mt-1">
                      Schedule a research activity or meeting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity-name" className="text-indigo-500 font-medium">
                          Activity Name
                        </Label>
                        <Input
                          id="activity-name"
                          value={activityName}
                          onChange={(e) => setActivityName(e.target.value)}
                          placeholder="Enter activity name"
                          className="border-indigo-200 focus-visible:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activity-time" className="text-indigo-500 font-medium">
                          Time
                        </Label>
                        <Input
                          id="activity-time"
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="border-indigo-200 focus-visible:ring-indigo-500"
                        />
                      </div>
                      <Button 
                        onClick={handleScheduleActivity} 
                        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Activity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activities List */}
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-indigo-500 text-white rounded-t-lg px-6 py-4">
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <Clock className="w-5 h-5 mr-2" />
                    Upcoming Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {scheduledActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-indigo-100 p-3 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-indigo-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-indigo-900">{activity.name}</h4>
                            <p className="text-sm text-indigo-500">
                              {activity.date.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-500 hover:bg-indigo-200 transition-colors">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </Badge>
                      </div>
                    ))}
                    {scheduledActivities.length === 0 && (
                      <div className="text-center py-12 bg-indigo-50/50 rounded-xl">
                        <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-indigo-500" />
                        <p className="text-indigo-500 font-medium">No activities scheduled yet</p>
                        <p className="text-indigo-500 text-sm mt-1">
                          Create your first activity using the form above
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="members" className="h-[calc(100vh-220px)] p-4 m-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-4">
              {room?.members && Array.isArray(room.members) ? (
                room.members.map((member, index) => (
                  <div
                    key={member.id || index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-500">Member</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleInviteUser(member)}
                      className={cn(
                        selectedMembers.some(m => m.id === member.id) && "bg-green-100 text-green-500"
                      )}
                    >
                      {selectedMembers.some(m => m.id === member.id) ? (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invited
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite
                        </>
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No members in this room.</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Dialog open={isInCall} onOpenChange={(open) => {
        if (!open) {
          // Stop the call when closing the dialog
          const stream = localVideoRef.current?.srcObject
          if (stream) {
            stream.getTracks().forEach(track => track.stop())
          }
          setIsInCall(false)
          setIsVideoOn(true)
          setIsMuted(false)
          setIsScreenSharing(false)
          toast({
            title: "Call Ended",
            description: "You have left the call.",
          })
        }
      }}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{isVideoOn ? "Video" : "Voice"} Call - {room?.name || 'Research Room'}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {isVideoOn && <video ref={remoteVideoRef} className="w-full h-full object-cover" />}
            {isVideoOn && (
              <div className="absolute bottom-4 right-4 w-1/4 aspect-video">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover rounded-lg border-2 border-white"
                  muted
                  autoPlay
                  playsInline
                />
              </div>
            )}
            {!isVideoOn && (
              <div className="flex items-center justify-center h-full">
                <Avatar className="h-32 w-32">
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={() => setIsInCall(false)}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={toggleVideo}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={toggleScreenShare}
            >
              <Monitor className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}


