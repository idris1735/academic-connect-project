"use client";

import { useState, useRef, useEffect } from "react";
import {
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelStateContext,
} from "stream-chat-react";
import { Button } from "@/components/ui/button";
import { Menu, Video, Phone, Smile, Mic, Square, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
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

export default function MessageView({ conversation, onToggleSidebar }) {
  const [channel, setChannel] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeCall, setActiveCall] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (conversation) {
      const setupChannel = async () => {
        try {
          const channelId = conversation.id;
          const newChannel = chatClient.channel("messaging", channelId, {
            name: conversation.name,
          });
          await newChannel.watch();
          setChannel(newChannel);
        } catch (error) {
          console.error("Error setting up channel:", error);
        }
      };

      setupChannel();
    }
  }, [conversation]);

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

  const handleSendMessage = async (channelId, message) => {
    try {
      await channel.sendMessage({
        ...message,
        text: message.text,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
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
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      setRecordingTime(0);

      if (shouldSend) {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const file = new File([audioBlob], "voice-note.mp3", {
          type: "audio/mp3",
        });

        try {
          const response = await channel.sendFile(file);
          await channel.sendMessage({
            text: "🎤 Voice Note",
            attachments: [
              {
                type: "audio",
                asset_url: response.file,
                title: "Voice Note",
              },
            ],
          });
        } catch (error) {
          console.error("Error sending voice note:", error);
          toast({
            title: "Error",
            description: "Failed to send voice note",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleStartCall = async (isVideoCall) => {
    if (!channel) return;

    try {
      const callId = `${channel.id}_${Date.now()}`;

      // Request permissions first before creating the call
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoCall,
          audio: true,
        });
      } catch (error) {
        console.error("Failed to get media permissions:", error);
        toast({
          title: "Permission Error",
          description: "Please allow access to camera and microphone",
          variant: "destructive",
        });
        return;
      }

      // Create a call using Stream's Video SDK
      const call = videoClient.call("default", callId);

      // Create the call
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

      // Join the call with specific settings
      await call.join({
        create: true,
        data: {
          member: {
            role: "user",
          },
        },
        audio: {
          track: stream.getAudioTracks()[0],
          enabled: true,
        },
        video: isVideoCall
          ? {
              track: stream.getVideoTracks()[0],
              enabled: true,
            }
          : undefined,
      });

      // Set the active call
      setActiveCall(call);

      // Send a message to notify other members
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

  if (!channel) return null;

  return (
    <div className="flex flex-col h-full">
      <Channel channel={channel} doSendMessageRequest={handleSendMessage}>
        <Window>
          <div className="flex flex-col h-full">
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
                  <div className="font-semibold">{conversation?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Active now
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
                <Button variant="outline" size="icon" onClick={startRecording}>
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
    </div>
  );
}
