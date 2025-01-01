"use client";

import { useState, useEffect, useRef } from "react";
import {
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Video,
  Phone,
  Smile,
  Mic,
  Square,
  Settings2,
  Users,
  FileText,
  CalendarDays,
  Plus,
  UserPlus,
  X,
  MoreHorizontal,
  Bell,
  Badge,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { chatClient, videoClient } from "./StreamChatProvider";
import {
  StreamVideo,
  StreamCall,
  CallControls,
  CallParticipantsList,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

export default function ResearchRoom({ room, onToggleSidebar }) {
  const [channel, setChannel] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeCall, setActiveCall] = useState(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformUsers, setPlatformUsers] = useState([
    {
      id: "1",
      name: "Alice Johnson",
      role: "Professor",
      department: "Computer Science",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      email: "alice.j@university.edu",
    },
    {
      id: "2",
      name: "Bob Smith",
      role: "Research Assistant",
      department: "Physics",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      email: "bob.s@university.edu",
    },
    {
      id: "3",
      name: "Carol White",
      role: "Associate Professor",
      department: "Mathematics",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
      email: "carol.w@university.edu",
    },
    {
      id: "4",
      name: "David Brown",
      role: "PhD Student",
      department: "Computer Science",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      email: "david.b@university.edu",
    },
    {
      id: "5",
      name: "Eva Martinez",
      role: "Research Fellow",
      department: "Biology",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eva",
      email: "eva.m@university.edu",
    },
  ]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    autoPlay: true,
  });
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "",
    reminders: {
      email: true,
      notification: true,
      reminderTime: "1hour",
    },
  });
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (room) {
      const setupChannel = async () => {
        try {
          const channelId = `research_${room.id}`;
          const newChannel = chatClient.channel("messaging", channelId, {
            name: room.name,
          });
          await newChannel.watch();
          setChannel(newChannel);
        } catch (error) {
          console.error("Error setting up channel:", error);
        }
      };

      setupChannel();
    }
  }, [room]);

  useEffect(() => {
    if (channel) {
      // Listen for incoming calls
      const handleIncomingCall = (event) => {
        const { call } = event;
        setActiveCall(call);
        toast({
          title: "Incoming Call",
          description: `${
            call.type === "video" ? "Video" : "Voice"
          } call from ${call.creator.name}`,
        });
      };

      channel.on("call.incoming", handleIncomingCall);

      return () => {
        channel.off("call.incoming", handleIncomingCall);
      };
    }
  }, [channel]);

  const handleAddMember = async (user) => {
    try {
      // Here you would typically make an API call to add the member
      toast({
        title: "Success",
        description: `${user.name} has been added to the room`,
      });
      setIsAddingMember(false); // Close the dialog after successful addition
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!eventDetails.title.trim()) {
        toast({
          title: "Error",
          description: "Event title is required",
          variant: "destructive",
        });
        return;
      }

      const newEvent = {
        id: Date.now().toString(),
        ...eventDetails,
        createdAt: new Date().toISOString(),
        status: "upcoming",
        createdBy: {
          name: "Current User",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser",
        },
      };

      setEvents((prev) => [...prev, newEvent]);

      toast({
        title: "Success",
        description: "Event has been created and reminders have been set",
      });

      // Reset form and close dialog
      setEventDetails({
        title: "",
        description: "",
        date: new Date(),
        time: "",
        reminders: {
          email: true,
          notification: true,
          reminderTime: "1hour",
        },
      });
      setIsCreatingEvent(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      // Make sure any existing recording is stopped and cleaned up
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          ?.getTracks()
          .forEach((track) => track.stop());
        mediaRecorderRef.current = null;
      }
      clearInterval(recordingTimerRef.current);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // Record in 100ms chunks
      setIsRecording(true);

      let time = 0;
      recordingTimerRef.current = setInterval(() => {
        time += 1;
        setRecordingTime(time);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async (shouldSend = true) => {
    if (mediaRecorderRef.current && isRecording) {
      return new Promise((resolve) => {
        // First stop the recording and clean up
        const cleanup = () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream
              .getTracks()
              .forEach((track) => track.stop());
          }
          clearInterval(recordingTimerRef.current);
          setIsRecording(false);
          setRecordingTime(0);
          mediaRecorderRef.current = null;
          audioChunksRef.current = [];
        };

        try {
          mediaRecorderRef.current.onstop = async () => {
            try {
              if (shouldSend && audioChunksRef.current.length > 0) {
                const audioBlob = new Blob(audioChunksRef.current, {
                  type: "audio/webm;codecs=opus",
                });

                // Create a File object with a proper name and type
                const file = new File([audioBlob], "voice-message.webm", {
                  type: "audio/webm;codecs=opus",
                  lastModified: Date.now(),
                });

                // First upload the file
                const response = await channel.sendFile(file);

                // Then send the message with the file attachment
                if (response.file) {
                  await channel.sendMessage({
                    text: "🎤 Voice Message",
                    attachments: [
                      {
                        type: "audio",
                        asset_url: response.file,
                        title: "Voice Message",
                        mime_type: "audio/webm;codecs=opus",
                        file_size: file.size,
                      },
                    ],
                  });

                  toast({
                    title: "Success",
                    description: "Voice message sent successfully",
                  });
                }
              }
            } catch (error) {
              console.error("Error sending voice note:", error);
              toast({
                title: "Error",
                description: "Failed to send voice message: " + error.message,
                variant: "destructive",
              });
            } finally {
              cleanup();
              resolve();
            }
          };

          // Stop the recording
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error("Error stopping recording:", error);
          cleanup();
          resolve();
        }
      });
    }
  };

  const handleEmojiSelect = (emoji) => {
    if (channel) {
      const messageInput = document.querySelector(
        ".str-chat__textarea textarea"
      );
      if (messageInput) {
        const start = messageInput.selectionStart;
        const end = messageInput.selectionEnd;
        const text = messageInput.value;
        const newText =
          text.substring(0, start) + emoji.native + text.substring(end);

        // Set the value and trigger Stream's input handler
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(messageInput, newText);

        const ev2 = new Event("input", { bubbles: true });
        messageInput.dispatchEvent(ev2);

        // Restore cursor position
        messageInput.selectionStart = start + emoji.native.length;
        messageInput.selectionEnd = start + emoji.native.length;
        messageInput.focus();
      } else {
        // Send as standalone message if no input is focused
        channel.sendMessage({
          text: emoji.native,
        });
      }
    }
  };

  const handleStartCall = async (isVideoCall) => {
    if (!channel) return;

    try {
      // Request permissions first
      let permissions;
      try {
        permissions = await navigator.mediaDevices.getUserMedia({
          video: isVideoCall,
          audio: true,
        });
      } catch (error) {
        if (error.name === "NotAllowedError") {
          toast({
            title: "Permission Denied",
            description:
              "Please allow access to camera and microphone in your browser settings",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Device Error",
            description: "Unable to access camera or microphone",
            variant: "destructive",
          });
        }
        return;
      }

      const callId = `${channel.id}_${Date.now()}`;
      const call = videoClient.call("default", callId);

      await call.getOrCreate({
        data: {
          custom: {
            channelId: channel.id,
            channelType: channel.type,
          },
        },
        members: Object.keys(channel.state.members),
        ring: true,
      });

      // Use the already-acquired stream when joining
      await call.join({
        create: true,
        data: {
          member: {
            role: "user",
          },
        },
        audio: {
          track: permissions.getAudioTracks()[0],
          enabled: true,
        },
        video: isVideoCall
          ? {
              track: permissions.getVideoTracks()[0],
              enabled: true,
            }
          : undefined,
      });

      setActiveCall(call);
      await channel.sendMessage({
        text: `Started a ${isVideoCall ? "video" : "voice"} call`,
        custom_type: "call_started",
        callId: callId,
        callType: isVideoCall ? "video" : "audio",
      });

      toast({
        title: "Call Started",
        description: `${isVideoCall ? "Video" : "Voice"} call is now active`,
      });
    } catch (error) {
      console.error("Error starting call:", error);
      toast({
        title: "Error",
        description: "Failed to start call: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (!channel) return null;

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="chat" className="flex-1">
        {activeCall && (
          <div className="fixed inset-0 z-50 bg-black/80">
            <StreamVideo client={videoClient}>
              <StreamCall call={activeCall}>
                <div className="relative h-full flex flex-col">
                  <div className="flex-1">
                    <SpeakerLayout participantsBarPosition="bottom" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-4 bg-gradient-to-t from-black/50">
                    <CallControls />
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await activeCall.leave();
                        setActiveCall(null);
                      }}
                    >
                      End Call
                    </Button>
                  </div>
                </div>
              </StreamCall>
            </StreamVideo>
          </div>
        )}

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
                      <div className="text-sm text-muted-foreground">
                        {room?.members?.length} members
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartCall(true)}
                    >
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartCall(false)}
                    >
                      <Phone className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-grow h-full overflow-y-auto">
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
                        Recording: {Math.floor(recordingTime / 60)}:
                        {(recordingTime % 60).toString().padStart(2, "0")}
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
              <div>
                <CardTitle>Research Events</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and track research room events
                </p>
              </div>
              <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
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
                        onChange={(e) =>
                          setEventDetails({
                            ...eventDetails,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Weekly team sync..."
                        value={eventDetails.description}
                        onChange={(e) =>
                          setEventDetails({
                            ...eventDetails,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Date</Label>
                        <Calendar
                          mode="single"
                          selected={eventDetails.date}
                          onSelect={(date) =>
                            setEventDetails({
                              ...eventDetails,
                              date: date || new Date(),
                            })
                          }
                          className="rounded-md border"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={eventDetails.time}
                          onChange={(e) =>
                            setEventDetails({
                              ...eventDetails,
                              time: e.target.value,
                            })
                          }
                        />
                        <div className="space-y-4 mt-4">
                          <Label>Reminder Settings</Label>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="email-reminder"
                              checked={eventDetails.reminders.email}
                              onCheckedChange={(checked) =>
                                setEventDetails({
                                  ...eventDetails,
                                  reminders: {
                                    ...eventDetails.reminders,
                                    email: checked,
                                  },
                                })
                              }
                            />
                            <Label htmlFor="email-reminder">
                              Email Reminder
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="notification-reminder"
                              checked={eventDetails.reminders.notification}
                              onCheckedChange={(checked) =>
                                setEventDetails({
                                  ...eventDetails,
                                  reminders: {
                                    ...eventDetails.reminders,
                                    notification: checked,
                                  },
                                })
                              }
                            />
                            <Label htmlFor="notification-reminder">
                              In-App Notification
                            </Label>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="reminder-time">Remind Before</Label>
                            <select
                              id="reminder-time"
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              value={eventDetails.reminders.reminderTime}
                              onChange={(e) =>
                                setEventDetails({
                                  ...eventDetails,
                                  reminders: {
                                    ...eventDetails.reminders,
                                    reminderTime: e.target.value,
                                  },
                                })
                              }
                            >
                              <option value="1hour">1 Hour Before</option>
                              <option value="1day">1 Day Before</option>
                              <option value="1week">1 Week Before</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleCreateEvent} className="w-full">
                    Create Event with Reminders
                  </Button>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card
                      key={event.id}
                      className="bg-card hover:bg-accent/5 transition-colors border-l-4 border-l-primary"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <CardTitle className="text-lg font-semibold">
                                {event.title}
                              </CardTitle>
                              <div className="flex items-center mt-1 space-x-2">
                                <CalendarDays className="h-3 w-3 text-muted-foreground" />
                                <time
                                  className="text-sm text-muted-foreground"
                                  dateTime={`${event.date}T${event.time}`}
                                >
                                  {new Date(event.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}{" "}
                                  at {event.time}
                                </time>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {event.reminders?.notification && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary"
                              >
                                <Bell className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={event.createdBy.avatar} />
                              <AvatarFallback>
                                {event.createdBy.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              Created by {event.createdBy.name}
                            </span>
                          </div>
                          <Badge
                            variant={
                              event.status === "upcoming"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {event.status}
                          </Badge>
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
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Members</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="mb-4">
                      <Label htmlFor="search">Search Users</Label>
                      <Input
                        id="search"
                        placeholder="Search by name, department, or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <ScrollArea className="h-[300px] border rounded-md">
                      {platformUsers
                        .filter(
                          (user) =>
                            user.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            user.department
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            user.role
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )
                        .map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                            onClick={() => handleAddMember(user)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.role} • {user.department}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {room?.members?.map((member) => (
                    <div
                      key={member.uid}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.role || "Member"}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
  );
}
