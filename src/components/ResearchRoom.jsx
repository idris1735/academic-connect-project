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
  Trash2,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import axios from 'axios';
import { cn } from "@/lib/utils";

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
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [isLoadingSentInvitations, setIsLoadingSentInvitations] = useState(false);
  const [isUserSelected, setIsUserSelected] = useState(false);

  // Mock data - replace with actual data fetching logic
  const mockRoom = {
    id: "1",
    name: "AI Research Group",
    createdAt: "2023-01-01",
    description: "A group dedicated to discussing the latest in AI research.",
    isPublic: true,
    inviteLink: "https://example.com/invite/ai-research",
    joinSettings: "approval",
    messageRetention: 30,
    fileSharingEnabled: true,
    notificationSettings: {
      mentions: true,
      allMessages: false,
    },
    features: {
      readReceipts: true,
      typingIndicators: true,
    },
    integrations: ["github", "slack"],
  }

  const mockMembers = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "moderator",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      role: "member",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    // Add more mock members as needed
  ]

  const regenerateInviteLink = async () => {
    // Implement logic to regenerate invite link
    try{
      const oldLink = room.inviteLink || '';
      const newInviteLink = `https://example.com/invite/${Math.random().toString(36).substring(7)}`
      room.inviteLink = newInviteLink
      const response = await axios.put(`/api/messages/rooms/${room.id}`, { inviteLink: newInviteLink})
      toast({
        title: "Success",
        description: "Invite Link updated successfully",
      });
    } catch (err) {
      room.inviteLink = oldLink
      console.error("Error regenerating invite link:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to regenerate invite link",
        variant: "destructive",
      });
    }
    
  }
  const changeRoomInviteLinkSettings = async (checked) => {
    try {
      room.settings.disableInviteLinks = checked
      const response = await axios.put(`/api/messages/rooms/${room.id}/settings`, { disableInviteLinks: checked });
    } catch (error) {
      console.error("Error updating invite link settings:", error);
      room.settings.disableInviteLinks = !checked
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update invite link settings",
        variant: "destructive",
      });
    }
  }

  const handleDeleteRoom = () => {
    // Implement room deletion logic here
    console.log("Deleting room:", room.id)
    setIsConfirmingDelete(false)
  }

  const handleUpdateRoom = async (updatedData) => {
    try {
      const response = await axios.put(`/api/messages/rooms/${room.id}`, updatedData);
      
      room.description = updatedData.description;
      room.settings.isPublic = updatedData.isPublic;
      room.name = updatedData.name;

      setIsEditingRoom(false);
      toast({
        title: "Success",
        description: "Room details updated successfully",
      });
    } catch (error) {
      console.error("Error updating room:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update room",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async (settings) => {
    try {
      const response = await axios.put(`/api/messages/rooms/${room.id}/settings`, settings);
      
      setRoom(prev => ({
        ...prev,
        ...response.data.settings
      }));

      toast({
        title: "Success",
        description: "Room settings updated successfully",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMemberRole = async (memberId, newRole) => {
    try {
      await axios.put(`/api/messages/rooms/${room.id}/members/${memberId}/role`, {
        newRole
      });
      
      setMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, role: newRole }
          : member
      ));

      toast({
        title: "Success",
        description: "Member role updated successfully",
      });
    } catch (error) {
      console.error("Error updating member role:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  const [isEditingRoom, setIsEditingRoom] = useState(false)

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

  // Modify the useEffect for fetching users to include debouncing and loading state
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const connectionsResponse = await axios.get('/api/connections/connections');
        const currentConnections = connectionsResponse.data;
  
        // Filter out users who are already members
        const filteredUsers = currentConnections.filter(
          (user) => !members.some((member) => member.id === user.userId)
        );

        // Format the users data
        const formattedUsers = filteredUsers.map(user => ({
          id: user.userId,
          name: user.displayName,
          role: user.occupation,
          avatar: user.photoURL,
          department: user.university || user.occupation
        }));

        setAvailableUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load available users",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (isInvitingMember) {
      fetchUsers();
    }
  }, [isInvitingMember, members]);

  // Add this effect to handle search filtering
  useEffect(() => {
    const filterUsers = () => {
      const filtered = availableUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    };

    // Debounce the search to avoid too many re-renders
    const debounceTimeout = setTimeout(filterUsers, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, availableUsers]);

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

  

  const fetchRoomEvents = async () => {
    try {
      const response = await axios.get(`/api/events/room/${room.id}`);
      // Format the dates for each event before setting state
      const formattedEvents = response.data.events.map(event => ({
        ...event,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load events",
        variant: "destructive",
      });
    }
  };

  // const formatFirestoreTimestamp = (timestamp) => {
  //   if (!timestamp) return 'Invalid date';
  
  //   // Convert Firestore Timestamp to JavaScript Date
  //   const date = new Date(timestamp);
  //   if (isNaN(date.getTime())) return 'Invaliddd date';
  
  //   // Extract components and pad with leading zeros where needed
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
  //   const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
  
  //   return `${day}/${month}/${year}`;
  // };

  const createNewEvent = async (eventData) => {
    try {
      const response = await axios.post(`/api/events/room/${room.id}`, eventData);
      setEvents(prev => [...prev, response.data.event]);
      setIsCreatingEvent(false);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create event",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (room?.id) {
      fetchRoomEvents();
      setMembers(room.members);
    }
  }, [room?.id]);
  

  const handleCreateEvent = async () => {
    try {
      if (!eventDetails.title || !eventDetails.time) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      await createNewEvent(eventDetails);
      setEventDetails({
        title: "",
        description: "",
        date: new Date(),
        time: "",
      });
    } catch (error) {
      console.error('Error in handleCreateEvent:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleInviteMember = async () => {
    try {
      if (!selectedUser) {
        toast({
          title: "Error",
          description: "Please select a user to invite",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.post(`/api/invitations/send/${room.id}`, {
        userId: selectedUser.id
      });

      setIsInvitingMember(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: `Invitation sent to ${selectedUser.name}`,
      });
    } catch (error) {
      console.error("Error inviting member:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

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
          description: error.response?.data?.message || "Failed to remove member",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const fetchSentInvitations = async () => {
    try {
      setIsLoadingSentInvitations(true);
      const response = await axios.get(`/api/invitations/room/${room.id}`);
      setSentInvitations(response.data.invitations || []);
    } catch (error) {
      console.error('Error fetching sent invitations:', error);
      setSentInvitations([]);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSentInvitations(false);
    }
  };

  const handleResendInvitation = async (invitationId) => {
    try {
      await axios.post(`/api/invitations/resend/${invitationId}`);
      toast({
        title: "Success",
        description: "Invitation resent successfully",
      });
      fetchSentInvitations(); // Refresh the list
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to resend invitation",
        variant: "destructive",
      });
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    try {
      await axios.delete(`/api/invitations/${invitationId}`);
      setSentInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      toast({
        title: "Success",
        description: "Invitation cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel invitation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvitation = async (invitationId) => {
    try {
      await axios.delete(`/api/invitations/delete/${invitationId}`);
      setSentInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      toast({
        title: "Success",
        description: "Invitation deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete invitation",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (room?.id) {
      fetchSentInvitations();
    }
  }, [room?.id]);

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
                          <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
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
                  onOpenChange={(open) => {
                    setIsInvitingMember(open);
                    if (!open) {
                      setSelectedUser(null);
                      setIsUserSelected(false);
                      setSearchQuery('');
                    }
                  }}
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
                        <CommandGroup>
                          {isLoadingUsers ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              Loading users...
                            </div>
                          ) : filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              {searchQuery.trim() ? 'No users found' : 'Start typing to search users'}
                            </div>
                          ) : (
                            filteredUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => {
                                  setIsUserSelected(true);
                                  setSelectedUser(user);
                                }}
                                className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 ${
                                  selectedUser?.id === user.id ? 'bg-gray-100' : ''
                                }`}
                              >
                                <div 
                                  onClick={() => {
                                    setIsUserSelected(true);
                                    setSelectedUser(user);
                                  }}
                                  className="flex items-center gap-2 w-full"
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
                                </div>
                              </CommandItem>
                            ))
                          )}
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
                      disabled={!isUserSelected || !selectedUser}
                    >
                      {isUserSelected && selectedUser 
                        ? `Invite ${selectedUser.name}` 
                        : 'Select a user'}
                    </Button>
                  </DialogContent>
                </Dialog>
                
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.uid}
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
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Room Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Room Name:</span>
                      <span className="text-sm text-gray-500">{room.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm text-gray-500">{new Date(room.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Members:</span>
                      <span className="text-sm text-gray-500">{members.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Description:</span>
                      <span className="text-sm text-gray-500">{room.description}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Visibility:</span>
                      <span className="text-sm text-gray-500">{room.settings.isPublic ? "Public" : "Private"}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => setIsEditingRoom(true)}>
                      Edit Room Details
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Invite Link</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input value={room.inviteLink} readOnly />
                      <Button onClick={regenerateInviteLink}>Regenerate</Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="disable-invite-links"
                        checked={room.settings.disableInviteLinks}
                        onCheckedChange={(checked) =>
                          
                           changeRoomInviteLinkSettings(checked)
                        }
                      />
                      <Label htmlFor="disable-invite-links">Disable all invite links</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Join Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={room.joinSettings} onValueChange={(value) => setRoom({ ...room, joinSettings: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select join setting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Anyone can join</SelectItem>
                        <SelectItem value="approval">Require approval for all joins</SelectItem>
                        <SelectItem value="invite">Invite only</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Member Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                      {members.map((member) => (
                        <div key={member.uid} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={member.avatarUrl} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select
                              value={member.role}
                              onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="member">Member</option>
                              <option value="channel_moderator">Room Moderator</option>
                            </select>
                            { member.role !== 'channel_moderator' && (
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                              Remove
                            </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
               
                  <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <div className="mt-8 border-t pt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Sent Invitations</h3>
                        {isLoadingSentInvitations && (
                          <div className="text-sm text-gray-500">Loading...</div>
                      )}
                      </div>
                      {!sentInvitations || sentInvitations.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          No pending invitations
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                      <Switch
                        id="disable-invitations"
                        checked={room.enable_invitations || false}
                        onCheckedChange={(checked) =>
                          setRoom({ ...room, inviteLink: checked ? "" : "https://example.com/invite/new-link" })
                        }
                      />
                      <Label htmlFor="disable-invite-links">Disable all invitations</Label>
                    </div>
                          {Array.isArray(sentInvitations) && sentInvitations.map((invitation) => (
                            <div
                              key={invitation.id}
                              className="flex items-center justify-between p-4 rounded-lg border bg-gray-50"
                            >
                              <div className="flex items-center space-x-4">
                                <Avatar>
                                  <AvatarImage src={invitation.userAvatar} />
                                  <AvatarFallback>
                                    {invitation.userName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">{invitation.userName}</h4>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">
                                      Sent {new Date(invitation.createdAt).toLocaleDateString()}
                                    </p>
                                    <span className={cn(
                                      "px-2 py-0.5 text-xs rounded-full",
                                      invitation.status === 'pending' && "bg-yellow-100 text-yellow-700",
                                      invitation.status === 'accepted' && "bg-green-100 text-green-700",
                                      invitation.status === 'rejected' && "bg-red-100 text-red-700",
                                      invitation.status === 'cancelled' && "bg-gray-100 text-gray-700"
                                    )}>
                                      {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {invitation.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleResendInvitation(invitation.id)}
                                    >
                                      Resend
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-600"
                                      onClick={() => handleCancelInvitation(invitation.id)}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                )}
                                {invitation.status === 'cancelled' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleResendInvitation(invitation.id)}
                                  >
                                    Send Again
                                  </Button>
                                )}
                                {invitation.status !== 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => handleDeleteInvitation(invitation.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  </CardContent>
                  
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Permissions and Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="file-sharing">File Sharing</Label>
                      <Switch
                        id="file-sharing"
                        checked={room.fileSharingEnabled}
                        onCheckedChange={(checked) => setRoom({ ...room, fileSharingEnabled: checked })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message-retention">Message Retention (days)</Label>
                      <Slider
                        id="message-retention"
                        value={[room.messageRetention]}
                        onValueChange={(value) => setRoom({ ...room, messageRetention: value[0] })}
                        max={365}
                        step={1}
                      />
                      <p className="text-sm text-gray-500">Messages are kept for {room.messageRetention} days</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="read-receipts">Read Receipts</Label>
                      <Switch
                        id="read-receipts"
                        checked={room.features?.readReceipts || true}
                        onCheckedChange={(checked) =>
                          setRoom({
                            ...room,
                            features: { ...room.features, readReceipts: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="typing-indicators">Typing Indicators</Label>
                      <Switch
                        id="typing-indicators"
                        checked={room.features?.typingIndicators || true}
                        onCheckedChange={(checked) =>
                          setRoom({
                            ...room,
                            features: { ...room.features, typingIndicators: checked },
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notify-mentions"
                        checked={room.notificationSettings?.mentions || true}
                        onCheckedChange={(checked) =>
                          setRoom({
                            ...room,
                            notificationSettings: { ...room.notificationSettings, mentions: checked },
                          })
                        }
                      />
                      <Label htmlFor="notify-mentions">Notify on mentions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notify-all-messages"
                        checked={room.notificationSettings?.allMessages || true}
                        onCheckedChange={(checked) =>
                          setRoom({
                            ...room,
                            notificationSettings: { ...room.notificationSettings, allMessages: checked },
                          })
                        }
                      />
                      <Label htmlFor="notify-all-messages">Notify for all messages</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {["github", "slack", "trello", "google-drive"].map((integration) => (
                      <div key={integration} className="flex items-center space-x-2">
                        <Checkbox
                          id={`integration-${integration}`}
                          checked={room.integrations?.includes(integration) || true}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRoom({ ...room, integrations: [...room.integrations, integration] })
                            } else {
                              setRoom({ ...room, integrations: room.integrations.filter((i) => i !== integration) })
                            }
                          }}
                        />
                        <Label htmlFor={`integration-${integration}`}>
                          {integration.charAt(0).toUpperCase() + integration.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">These actions are permanent and cannot be undone</p>
                    <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          Delete Room
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-red-600">Delete Room</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to delete this room? This action cannot be undone and all data will be
                            permanently lost.
                          </p>
                          <div className="space-y-2">
                            <Button variant="destructive" className="w-full" onClick={handleDeleteRoom}>
                              Yes, Delete Room
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => setIsConfirmingDelete(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Edit Room Dialog */}
              <Dialog open={isEditingRoom} onOpenChange={setIsEditingRoom}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Room Details</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      handleUpdateRoom({
                        name: formData.get("name"),
                        description: formData.get("description"),
                        isPublic: formData.get("isPublic") === "on",
                      })
                    }}
                  >
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Room Name</Label>
                        <Input id="name" name="name" defaultValue={room.name || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" defaultValue={room.description || ''} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="isPublic" name="isPublic" defaultChecked={room.settings.isPublic || true} />
                        <Label htmlFor="isPublic">Public Room</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="submit">Save Changes</Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditingRoom(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </Tabs>
          </TabsContent>
        </Tabs>
      </DailyProvider>
    </div>
  );
}
