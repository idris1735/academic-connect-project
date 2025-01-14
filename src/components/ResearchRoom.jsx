"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

function CallUI({ onEndCall }) {
  const { callObject } = useDaily();
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
        // Get the local tracks
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

    // Listen for track updates
    const handleTrackStarted = (event) => {
      const { participant, track } = event;
      if (participant.local) {
        if (track.kind === "audio") {
          setIsMuted(false);
        } else if (track.kind === "video") {
          setIsVideoEnabled(true);
        }
      }
    };

    const handleTrackStopped = (event) => {
      const { participant, track } = event;
      if (participant.local) {
        if (track.kind === "audio") {
          setIsMuted(true);
        } else if (track.kind === "video") {
          setIsVideoEnabled(false);
        }
      }
    };

    callObject.on("track-started", handleTrackStarted);
    callObject.on("track-stopped", handleTrackStopped);

    return () => {
      callObject.off("track-started", handleTrackStarted);
      callObject.off("track-stopped", handleTrackStopped);
    };
  }, [callObject]);

  const toggleMute = useCallback(async () => {
    if (!callObject) return;
    try {
      // Get current audio track state
      const tracks = callObject.participants().local.tracks;
      const audioTrack = tracks?.audio?.track;

      if (audioTrack) {
        // Toggle the track directly
        audioTrack.enabled = !audioTrack.enabled;
        // Update Daily.co's state
        await callObject.setLocalAudio(!isMuted);
        setIsMuted(!audioTrack.enabled);

        toast({
          title: audioTrack.enabled ? "Unmuted" : "Muted",
          description: audioTrack.enabled
            ? "Microphone is now on"
            : "Microphone is now off",
        });
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
      toast({
        title: "Error",
        description: "Could not toggle microphone",
        variant: "destructive",
      });
    }
  }, [callObject, isMuted, toast]);

  const toggleVideo = useCallback(async () => {
    if (!callObject) return;
    try {
      // Get current video track state
      const tracks = callObject.participants().local.tracks;
      const videoTrack = tracks?.video?.track;

      if (videoTrack) {
        // Toggle the track directly
        videoTrack.enabled = !videoTrack.enabled;
        // Update Daily.co's state
        await callObject.setLocalVideo(!isVideoEnabled);
        setIsVideoEnabled(!videoTrack.enabled);

        toast({
          title: videoTrack.enabled ? "Video On" : "Video Off",
          description: videoTrack.enabled
            ? "Camera is now on"
            : "Camera is now off",
        });
      }
    } catch (error) {
      console.error("Error toggling video:", error);
      toast({
        title: "Error",
        description: "Could not toggle camera",
        variant: "destructive",
      });
    }
  }, [callObject, isVideoEnabled, toast]);

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

  // Create call object with proper configuration
  const callObject = useCallObject(
    {
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
    },
    Boolean(callContainerRef.current)
  );

  // Handle room URL changes
  useEffect(() => {
    if (callObject && roomUrl && inCall) {
      callObject.join({ url: roomUrl }).catch((error) => {
        console.error("Error joining call:", error);
        toast({
          title: "Error",
          description: "Failed to join call: " + error.message,
          variant: "destructive",
        });
      });
    }
  }, [callObject, roomUrl, inCall]);

  const startCall = async (isVideo) => {
    try {
      // Set states before setting room URL
      setIsVideoCall(isVideo);
      setInCall(true);

      // Use the specific room URL
      const newRoomUrl = "https://olanike.daily.co/academic-connect";
      console.log("Room URL:", newRoomUrl);
      setRoomUrl(newRoomUrl);

      // Send the room URL through the chat
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
  };

  const joinCall = async (newRoomUrl, isVideo) => {
    try {
      if (!newRoomUrl) {
        throw new Error("Invalid room URL");
      }

      // Set states before setting room URL
      setIsVideoCall(isVideo);
      setInCall(true);
      setIncomingCall(null);

      // Stop the ringtone
      ringtoneAudio.pause();
      ringtoneAudio.currentTime = 0;

      // Set the room URL last
      setRoomUrl(newRoomUrl);

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
  };

  const endCall = async () => {
    try {
      if (callObject) {
        await callObject.leave();
      }

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
  };

  // Add event handlers for the call object
  useEffect(() => {
    if (callObject && roomUrl) {
      const handleJoined = () => {
        console.log("Successfully joined the meeting");
      };

      const handleError = (error) => {
        console.error("Daily.co error:", error);
        toast({
          title: "Call Error",
          description: error.errorMsg || "An error occurred during the call",
          variant: "destructive",
        });
      };

      const handleParticipantUpdated = (event) => {
        console.log("Participant updated:", event);
      };

      callObject.on("joined-meeting", handleJoined);
      callObject.on("error", handleError);
      callObject.on("participant-updated", handleParticipantUpdated);

      // Join the call
      callObject.join().catch(handleError);

      return () => {
        callObject.off("joined-meeting", handleJoined);
        callObject.off("error", handleError);
        callObject.off("participant-updated", handleParticipantUpdated);
      };
    }
  }, [callObject, roomUrl]);

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

  return (
    <div className="p-4 bg-white h-full">
      <DailyProvider>
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

        {inCall && callObject && roomUrl && <CallUI onEndCall={endCall} />}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold">
              {room?.name || "Research Room"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 text-primary"
              onClick={() => startCall(false)}
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 text-primary"
              onClick={() => startCall(true)}
            >
              <Video className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {channel && (
          <div className="flex-1 overflow-hidden">
            <Channel channel={channel}>
              <Window>
                <div className="flex flex-col h-full">
                  <ScrollArea className="flex-grow h-full overflow-y-auto">
                    <MessageList />
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <MessageInput />
                  </div>
                </div>
              </Window>
            </Channel>
          </div>
        )}
      </DailyProvider>
    </div>
  );
}
