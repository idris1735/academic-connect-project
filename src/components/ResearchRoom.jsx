"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  MicOff,
  CameraOff,
  Camera,
  MonitorOff,
  MonitorUp,
  PhoneOff,
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
import { chatClient } from "./StreamChatProvider";
import {
  DailyProvider,
  useDaily,
  useLocalParticipant,
  useParticipantIds,
  useScreenShare,
  DailyVideo,
  useCallObject,
} from "@daily-co/daily-react";
import DailyIframe from "@daily-co/daily-js";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

function IncomingCallOverlay({ caller, isVideoCall, onAccept, onDecline }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div className="flex flex-col items-center p-8 rounded-lg bg-white/10 backdrop-blur-sm">
        <div className="w-24 h-24 rounded-full bg-primary/20 mb-6 flex items-center justify-center">
          {isVideoCall ? (
            <Video className="w-12 h-12 text-white" />
          ) : (
            <Phone className="w-12 h-12 text-white" />
          )}
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-white">
          {caller || "Incoming Call"}
        </h2>
        <p className="text-gray-200 mb-8">
          Incoming {isVideoCall ? "Video" : "Voice"} Call...
        </p>
        <div className="flex gap-6">
          <button
            onClick={onDecline}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors"
          >
            <Phone className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CallUI({ onEndCall, roomUrl }) {
  const callObject = useCallObject();
  const localParticipant = useLocalParticipant();
  const participantIds = useParticipantIds();
  const { toast } = useToast();
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // Initialize media tracks when joining call
  useEffect(() => {
    if (!callObject) return;

    const setupTracks = async () => {
      try {
        const { camera, mic } = await callObject.getUserMedia();
        if (mic) {
          await callObject.setLocalAudio(true);
          setIsMuted(false);
        }
        if (camera) {
          await callObject.setLocalVideo(true);
          setIsVideoEnabled(true);
        }
      } catch (error) {
        console.error("Error setting up media tracks:", error);
      }
    };

    setupTracks();

    return () => {
      if (callObject) {
        callObject.setLocalAudio(false);
        callObject.setLocalVideo(false);
      }
    };
  }, [callObject]);

  const toggleMute = useCallback(async () => {
    if (!callObject) return;
    try {
      const newMuted = !isMuted;
      await callObject.setLocalAudio(!newMuted);
      setIsMuted(newMuted);
    } catch (error) {
      console.error("Error toggling audio:", error);
      toast({
        title: "Error",
        description: "Could not toggle microphone",
        variant: "destructive",
      });
    }
  }, [callObject, isMuted]);

  const toggleVideo = useCallback(async () => {
    if (!callObject) return;
    try {
      const newVideoEnabled = !isVideoEnabled;
      await callObject.setLocalVideo(newVideoEnabled);
      setIsVideoEnabled(newVideoEnabled);
    } catch (error) {
      console.error("Error toggling video:", error);
      toast({
        title: "Error",
        description: "Could not toggle camera",
        variant: "destructive",
      });
    }
  }, [callObject, isVideoEnabled]);

  const handleScreenShare = useCallback(async () => {
    try {
      if (isSharingScreen) {
        await stopScreenShare();
      } else {
        await startScreenShare();
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
      toast({
        title: "Error",
        description: "Could not toggle screen sharing",
        variant: "destructive",
      });
    }
  }, [isSharingScreen, startScreenShare, stopScreenShare]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full flex flex-col">
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 z-10">
          <div className="text-white">
            <h3 className="text-lg font-semibold">Call in Progress</h3>
            <p className="text-sm opacity-80">
              {participantIds.length} participant(s)
            </p>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="grid grid-cols-2 gap-4 p-4 h-full">
            {participantIds.map((id) => (
              <div key={id} className="relative">
                <DailyVideo
                  automirror
                  sessionId={id}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 p-4 bg-gradient-to-t from-black/50">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              isMuted ? "bg-red-500/80" : "bg-white/10"
            } hover:bg-white/20 transition-colors`}
            onClick={toggleMute}
          >
            {isMuted ? (
              <MicOff className="h-5 w-5 text-white" />
            ) : (
              <Mic className="h-5 w-5 text-white" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              !isVideoEnabled ? "bg-red-500/80" : "bg-white/10"
            } hover:bg-white/20 transition-colors`}
            onClick={toggleVideo}
          >
            {isVideoEnabled ? (
              <Camera className="h-5 w-5 text-white" />
            ) : (
              <CameraOff className="h-5 w-5 text-white" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              isSharingScreen ? "bg-green-500/80" : "bg-white/10"
            } hover:bg-white/20 transition-colors`}
            onClick={handleScreenShare}
          >
            {isSharingScreen ? (
              <MonitorOff className="h-5 w-5 text-white" />
            ) : (
              <MonitorUp className="h-5 w-5 text-white" />
            )}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full"
            onClick={onEndCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResearchRoom({ room, onToggleSidebar }) {
  const [channel, setChannel] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inCall, setInCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const { toast } = useToast();
  const [ringtoneAudio] = useState(new Audio("/ringtone.wav"));
  const [roomUrl, setRoomUrl] = useState(null);
  const callContainerRef = useRef(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "",
  });
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    darkMode: false,
  });
  const [isInvitingMember, setIsInvitingMember] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [callConfig, setCallConfig] = useState(null);

  // Initialize call configuration when needed
  useEffect(() => {
    if (inCall) {
      setCallConfig({
        url: roomUrl,
        dailyConfig: {
          iframeStyle: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            zIndex: 50,
          },
        },
      });
    } else {
      setCallConfig(null);
    }
  }, [inCall, roomUrl]);

  // Add this effect to fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace this with your actual API call
        const mockUsers = [
          {
            id: "user1",
            name: "Alice Johnson",
            role: "Researcher",
            avatar: "/avatars/alice.jpg",
            department: "Computer Science",
          },
          {
            id: "user2",
            name: "Bob Wilson",
            role: "Professor",
            avatar: "/avatars/bob.jpg",
            department: "Physics",
          },
          {
            id: "user3",
            name: "Carol Martinez",
            role: "Student",
            avatar: "/avatars/carol.jpg",
            department: "Mathematics",
          },
        ];

        // Filter out users who are already members
        const filteredUsers = mockUsers.filter(
          (user) => !members.some((member) => member.id === user.id)
        );

        setAvailableUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load available users",
          variant: "destructive",
        });
      }
    };

    if (isInvitingMember) {
      fetchUsers();
    }
  }, [isInvitingMember, members]);

  const startCall = useCallback(
    async (isVideo) => {
      try {
        setIsVideoCall(isVideo);
        const newRoomUrl = "https://olanike.daily.co/academic-connect";

        // First set the room URL and call state
        setRoomUrl(newRoomUrl);
        setInCall(true);

        // Then notify others
        await channel.sendMessage({
          text: "📞 Joining call...",
          custom: {
            type: "call-started",
            roomUrl: newRoomUrl,
            isVideoCall: isVideo,
          },
        });

        toast({
          title: "Call Started",
          description: "Others can now join your call",
        });
      } catch (error) {
        console.error("Error starting call:", error);
        setInCall(false);
        setRoomUrl(null);
        toast({
          title: "Error",
          description: error.message || "Could not start call",
          variant: "destructive",
        });
      }
    },
    [channel, toast]
  );

  const joinCall = useCallback(
    async (newRoomUrl, isVideo) => {
      try {
        if (!newRoomUrl) {
          throw new Error("Invalid room URL");
        }

        // Stop ringtone first
        ringtoneAudio.pause();
        ringtoneAudio.currentTime = 0;

        // Then update call state
        setIsVideoCall(isVideo);
        setRoomUrl(newRoomUrl);
        setInCall(true);
        setIncomingCall(null);

        toast({
          title: "Call Joined",
          description: "You have joined the call",
        });
      } catch (error) {
        console.error("Error joining call:", error);
        setInCall(false);
        setRoomUrl(null);
        toast({
          title: "Error",
          description: error.message || "Could not join call",
          variant: "destructive",
        });
      }
    },
    [ringtoneAudio, toast]
  );

  const endCall = useCallback(async () => {
    try {
      setInCall(false);
      setRoomUrl(null);
      setIsVideoCall(false);
      setIncomingCall(null);

      await channel.sendMessage({
        text: "📞 Call ended",
        custom: {
          type: "call-ended",
        },
      });

      toast({
        title: "Call Ended",
        description: "The call has ended",
      });
    } catch (error) {
      console.error("Error ending call:", error);
      toast({
        title: "Error",
        description: "Error ending call: " + error.message,
        variant: "destructive",
      });
    }
  }, [channel, toast]);

  const startRecording = useCallback(async () => {
    try {
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

      mediaRecorder.start(100);
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
  }, [toast]);

  const stopRecording = useCallback(
    async (shouldSend) => {
      try {
        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
        clearInterval(recordingTimerRef.current);

        if (shouldSend) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const formData = new FormData();
          formData.append("audio", audioBlob);

          // Send the audio message through the channel
          await channel.sendMessage({
            text: "🎤 Voice message",
            attachments: [
              {
                type: "audio",
                asset_url: URL.createObjectURL(audioBlob),
                title: "Voice Message",
                mime_type: "audio/webm",
              },
            ],
          });
        }

        setIsRecording(false);
        setRecordingTime(0);
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
      } catch (error) {
        console.error("Error stopping recording:", error);
        toast({
          title: "Error",
          description: "Failed to stop recording",
          variant: "destructive",
        });
      }
    },
    [channel, toast]
  );

  const handleEmojiSelect = useCallback(
    (emoji) => {
      if (channel) {
        channel.sendMessage({
          text: emoji.native,
        });
      }
    },
    [channel]
  );

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

          // Watch for new messages
          newChannel.on("message.new", (event) => {
            const message = event.message;

            // Handle call signals
            if (
              message.custom?.type === "call-started" &&
              message.user.id !== chatClient.user.id
            ) {
              setIncomingCall({
                roomUrl: message.custom.roomUrl,
                isVideoCall: message.custom.isVideoCall,
                caller: message.user.name,
              });

              // Play ringtone
              ringtoneAudio.loop = true;
              ringtoneAudio.play().catch(console.error);
            }

            // Regular messages
            if (
              !message.custom?.type &&
              message.user.id !== chatClient.user.id
            ) {
              toast({
                title: "New Message",
                description: `${message.user.name}: ${message.text}`,
              });
            }
          });
        } catch (error) {
          console.error("Error setting up channel:", error);
          toast({
            title: "Error",
            description: "Could not connect to chat",
            variant: "destructive",
          });
        }
      };

      setupChannel();

      return () => {
        if (channel) {
          channel.off("message.new");
        }
      };
    }
  }, [room]);

  // Handle room events - Fixed the infinite update by using useMemo for static data
  const mockData = useMemo(
    () => ({
      members: [
        {
          id: 1,
          name: "John Doe",
          role: "Admin",
          avatar: "/avatars/john.jpg",
          status: "online",
        },
        {
          id: 2,
          name: "Jane Smith",
          role: "Member",
          avatar: "/avatars/jane.jpg",
          status: "offline",
        },
      ],
      events: [
        {
          id: 1,
          title: "Weekly Research Sync",
          description: "Regular team sync meeting",
          date: new Date(),
          time: "10:00",
          attendees: ["John Doe", "Jane Smith"],
        },
        {
          id: 2,
          title: "Project Review",
          description: "Review research progress",
          date: new Date(Date.now() + 86400000),
          time: "14:00",
          attendees: ["John Doe", "Jane Smith"],
        },
      ],
    }),
    []
  );

  useEffect(() => {
    if (room?.id) {
      setMembers(mockData.members);
      setEvents(mockData.events);
    }
  }, [room?.id, mockData]);

  const handleCreateEvent = useCallback(async () => {
    try {
      // Validate form
      if (!eventDetails.title || !eventDetails.time) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Create new event
      const newEvent = {
        id: Date.now(),
        ...eventDetails,
        attendees: members.map((m) => m.name),
      };

      setEvents((prev) => [...prev, newEvent]);
      setIsCreatingEvent(false);
      setEventDetails({
        title: "",
        description: "",
        date: new Date(),
        time: "",
      });

      toast({
        title: "Event Created",
        description: "New event has been scheduled successfully",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  }, [eventDetails, members, toast]);

  const handleUpdateSettings = useCallback(
    (key, value) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));

      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved",
      });
    },
    [toast]
  );

  const handleInviteMember = useCallback(async () => {
    try {
      if (!selectedUser) {
        toast({
          title: "Validation Error",
          description: "Please select a user to invite",
          variant: "destructive",
        });
        return;
      }

      // Add the selected user as a new member
      const newMember = {
        id: selectedUser.id,
        name: selectedUser.name,
        role: "Member",
        avatar: selectedUser.avatar,
        status: "pending",
      };

      setMembers((prev) => [...prev, newMember]);
      setIsInvitingMember(false);
      setSelectedUser(null);

      // Send invitation through your backend
      // await sendInvitation(room.id, selectedUser.id);

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${selectedUser.name}`,
      });
    } catch (error) {
      console.error("Error inviting member:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  }, [selectedUser, toast]);

  const handleRemoveMember = useCallback(
    async (memberId) => {
      try {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        toast({
          title: "Member Removed",
          description: "Member has been removed from the room",
        });
      } catch (error) {
        console.error("Error removing member:", error);
        toast({
          title: "Error",
          description: "Failed to remove member",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleDeleteRoom = useCallback(async () => {
    try {
      // Simulate API call to delete room
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Room Deleted",
        description: "The room has been permanently deleted",
      });

      // Navigate away or handle room deletion
      // You might want to add a callback prop to handle this
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="p-4 bg-white h-full">
      <DailyProvider callObject={callConfig}>
        <div
          ref={callContainerRef}
          id="call-container"
          className="fixed inset-0 z-50"
          style={{ display: inCall ? "block" : "none" }}
        />

        {incomingCall && (
          <IncomingCallOverlay
            caller={incomingCall.caller}
            isVideoCall={incomingCall.isVideoCall}
            onAccept={() =>
              joinCall(incomingCall.roomUrl, incomingCall.isVideoCall)
            }
            onDecline={() => {
              ringtoneAudio.pause();
              ringtoneAudio.currentTime = 0;
              setIncomingCall(null);
            }}
          />
        )}

        {inCall && callConfig && (
          <CallUI onEndCall={endCall} roomUrl={roomUrl} />
        )}

        <Tabs defaultValue="chat" className="h-full flex flex-col">
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
            {channel && (
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
                          onClick={() => startCall(true)}
                        >
                          <Video className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startCall(false)}
                        >
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
            )}
          </TabsContent>

          <TabsContent value="schedule" className="flex-1 p-4 m-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Events</CardTitle>
                <Dialog
                  open={isCreatingEvent}
                  onOpenChange={setIsCreatingEvent}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
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
                      </div>
                    </div>
                    <Button onClick={handleCreateEvent} className="w-full">
                      Create Event
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-4 p-4 rounded-lg border"
                    >
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <CalendarDays className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold">{event.title}</h4>
                        <p className="text-sm text-gray-500">
                          {event.description}
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="text-sm">{event.time}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {event.attendees.length} attendees
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="flex-1 p-4 m-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Room Members</CardTitle>
                <Dialog
                  open={isInvitingMember}
                  onOpenChange={setIsInvitingMember}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New Member</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Command className="rounded-lg border shadow-md">
                        <CommandInput
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                          {availableUsers
                            .filter(
                              (user) =>
                                user.name
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()) ||
                                user.department
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                            )
                            .map((user) => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => setSelectedUser(user)}
                                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {user.name}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {user.department} • {user.role}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                      {selectedUser && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedUser.avatar} />
                            <AvatarFallback>
                              {selectedUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {selectedUser.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {selectedUser.department} • {selectedUser.role}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleInviteMember}
                      className="w-full"
                      disabled={!selectedUser}
                    >
                      Send Invitation
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            member.status === "online" ? "default" : "secondary"
                          }
                        >
                          {member.status}
                        </Badge>
                        {member.role !== "Admin" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4 m-0">
            <Card>
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-semibold mb-2">Room Information</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    View and manage room details
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Room Name:</span>
                      <span className="text-sm text-gray-500">
                        {room?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm text-gray-500">
                        {new Date(room?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Members:</span>
                      <span className="text-sm text-gray-500">
                        {members.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-6">
                  <h3 className="text-red-600 font-semibold mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    These actions are permanent and cannot be undone
                  </p>
                  <Dialog
                    open={isConfirmingDelete}
                    onOpenChange={setIsConfirmingDelete}
                  >
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Delete Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-red-600">
                          Delete Room
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-gray-500 mb-4">
                          Are you sure you want to delete this room? This action
                          cannot be undone and all data will be permanently
                          lost.
                        </p>
                        <div className="space-y-2">
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={handleDeleteRoom}
                          >
                            Yes, Delete Room
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsConfirmingDelete(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DailyProvider>
    </div>
  );
}
