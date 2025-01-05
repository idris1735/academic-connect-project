"use client";

import { useState, useRef, useEffect } from "react";
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
  X,
  PhoneOff,
  VideoOff,
  MicOff,
  Camera,
  CameraOff,
  MonitorUp,
  MonitorOff,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { chatClient } from "./StreamChatProvider";

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

export default function MessageView({ conversation, onToggleSidebar }) {
  const [channel, setChannel] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inCall, setInCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [incomingCall, setIncomingCall] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const { toast } = useToast();
  const [pendingCandidates, setPendingCandidates] = useState([]);

  // WebRTC configuration
  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [localStream, remoteStream, screenStream]);

  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidateString = JSON.stringify(event.candidate);
        if (candidateString.length > 4000) {
          const chunks = candidateString.match(/.{1,4000}/g) || [];
          chunks.forEach((chunk, index) => {
            sendCallSignal("ice-candidate-chunk", {
              chunk,
              index,
              total: chunks.length,
              isLast: index === chunks.length - 1,
            });
          });
        } else {
          sendCallSignal("ice-candidate", {
            candidate: event.candidate,
          });
        }
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        if (event.track.kind === "video") {
          if (
            event.track.label.includes("screen") ||
            event.track.label.includes("display")
          ) {
            setScreenStream(event.streams[0]);
          } else {
            setRemoteStream(event.streams[0]);
          }
        } else {
          setRemoteStream((prev) => {
            if (prev) {
              prev.addTrack(event.track);
              return prev;
            }
            return event.streams[0];
          });
        }
      }
    };

    setPeerConnection(pc);
    return pc;
  };

  const compressSessionDescription = (description) => {
    const { type, sdp } = description;
    // Remove unnecessary lines from SDP
    const compressedSdp = sdp
      .split("\n")
      .filter(
        (line) =>
          !line.startsWith("a=ice-options:") &&
          !line.startsWith("a=msid-semantic:") &&
          !line.startsWith("a=group:") &&
          !line.startsWith("a=rtcp-rsize")
      )
      .join("\n");

    return { type, sdp: compressedSdp };
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false, // Disable audio to reduce data size
      });

      setScreenStream(stream);
      setIsScreenSharing(true);

      if (peerConnection) {
        const videoTrack = stream.getVideoTracks()[0];
        const sender = peerConnection
          .getSenders()
          .find((s) => s.track?.kind === "video");

        if (sender) {
          await sender.replaceTrack(videoTrack);
        } else {
          peerConnection.addTrack(videoTrack, stream);
        }

        // Create a compressed offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        const compressedOffer = compressSessionDescription(offer);
        const offerString = JSON.stringify(compressedOffer);

        // Split offer into chunks if needed
        if (offerString.length > 4000) {
          const chunks = offerString.match(/.{1,4000}/g) || [];
          for (let i = 0; i < chunks.length; i++) {
            await sendCallSignal("screen-share-offer-chunk", {
              chunk: chunks[i],
              index: i,
              total: chunks.length,
              isLast: i === chunks.length - 1,
            });
          }
        } else {
          await sendCallSignal("screen-share-offer", {
            offer: compressedOffer,
          });
        }

        toast({
          title: "Screen Sharing Started",
          description: "Your screen is now being shared",
        });
      }

      // Handle stream stop
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error("Error starting screen share:", error);
      setIsScreenSharing(false);
      setScreenStream(null);
      toast({
        title: "Error",
        description: "Could not start screen sharing: " + error.message,
        variant: "destructive",
      });
    }
  };

  const stopScreenShare = async () => {
    try {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());

        // Revert to camera if it was a video call
        if (isVideoCall && localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          const sender = peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender && videoTrack) {
            await sender.replaceTrack(videoTrack);
          }
        }

        setScreenStream(null);
        setIsScreenSharing(false);

        await sendCallSignal("screen-share-ended");

        // Update the video display
        if (remoteVideoRef.current && remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
        }

        toast({
          title: "Screen Sharing Ended",
          description: "Screen sharing has been stopped",
        });
      }
    } catch (error) {
      console.error("Error stopping screen share:", error);
      // Force reset screen sharing state even if there's an error
      setScreenStream(null);
      setIsScreenSharing(false);
      toast({
        title: "Error",
        description: "Could not stop screen sharing properly: " + error.message,
        variant: "destructive",
      });
    }
  };

  const startCall = async (isVideo) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo,
      });

      setLocalStream(stream);
      setIsVideoCall(isVideo);
      setInCall(true);

      const pc = setupPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Compress the offer before sending
      const compressedOffer = compressSessionDescription(offer);

      // Split offer into chunks if needed
      const offerData = JSON.stringify(compressedOffer);
      if (offerData.length > 4000) {
        const chunks = offerData.match(/.{1,4000}/g);
        for (let i = 0; i < chunks.length; i++) {
          await sendCallSignal("call-offer-chunk", {
            chunk: chunks[i],
            index: i,
            total: chunks.length,
            isLast: i === chunks.length - 1,
            isVideoCall: isVideo,
          });
        }
      } else {
        await sendCallSignal("call-offer", {
          offer: compressedOffer,
          isVideoCall: isVideo,
        });
      }

      toast({
        title: "Calling...",
        description: "Waiting for answer",
      });
    } catch (error) {
      console.error("Error starting call:", error);
      toast({
        title: "Error",
        description: "Could not start call: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleIncomingCall = async (message) => {
    if (message.custom.type === "call-offer") {
      setIncomingCall({
        offer: message.custom.offer,
        isVideoCall: message.custom.isVideoCall,
        caller: message.user.name,
      });
    }
  };

  const acceptCall = async () => {
    try {
      if (!incomingCall) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: incomingCall.isVideoCall,
      });

      setLocalStream(stream);
      setIsVideoCall(incomingCall.isVideoCall);
      setInCall(true);

      const pc = setupPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      const compressedAnswer = compressSessionDescription(answer);
      await sendCallSignal("call-answer", { answer: compressedAnswer });

      toast({
        title: "Call Connected",
        description: "You have joined the call",
      });

      setIncomingCall(null);
    } catch (error) {
      console.error("Error accepting call:", error);
      toast({
        title: "Error",
        description: "Could not accept call: " + error.message,
        variant: "destructive",
      });
      setIncomingCall(null);
    }
  };

  const declineCall = async () => {
    await sendCallSignal("call-declined");
    setIncomingCall(null);
  };

  const endCall = async () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }

    // Send call ended signal if we're in a call
    if (inCall) {
      await sendCallSignal("call-ended");
    }

    setLocalStream(null);
    setRemoteStream(null);
    setScreenStream(null);
    setPeerConnection(null);
    setInCall(false);
    setIsVideoCall(false);
    setIsScreenSharing(false);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

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

          // Watch for new messages
          newChannel.on("message.new", (event) => {
            // Only handle non-call messages here
            if (!event.message.custom?.isCallSignal) {
              // Message list will update automatically through Stream Chat SDK
              if (event.message.user.id !== chatClient.user.id) {
                toast({
                  title: "New Message",
                  description: `${event.message.user.name}: ${event.message.text}`,
                });
              }
            }
          });

          // Watch for typing indicators
          newChannel.on("typing.start", (event) => {
            if (event.user.id !== chatClient.user.id) {
              // Handle typing indicator
            }
          });

          newChannel.on("typing.stop", (event) => {
            if (event.user.id !== chatClient.user.id) {
              // Handle typing indicator
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
          // Cleanup channel listeners
          channel.off("message.new");
          channel.off("typing.start");
          channel.off("typing.stop");
        }
      };
    }
  }, [conversation]);

  // Separate effect for handling WebRTC signaling messages
  useEffect(() => {
    if (!channel) return;

    let offerChunks = {};
    let answerChunks = {};
    let candidateChunks = {};
    let screenShareOfferChunks = {};

    const handleCallSignal = async (event) => {
      const message = event.message;

      if (!message.custom?.isCallSignal) return;

      // Clear the message text for call signals
      message.text = "";

      try {
        switch (message.custom?.type) {
          case "call-offer-chunk": {
            const { chunk, index, total, isLast, isVideoCall } = message.custom;
            if (!offerChunks[total]) {
              offerChunks[total] = new Array(total).fill(null);
            }
            offerChunks[total][index] = chunk;

            if (isLast && offerChunks[total].every((chunk) => chunk !== null)) {
              const offerData = offerChunks[total].join("");
              try {
                const offer = JSON.parse(offerData);
                if (!inCall) {
                  setIncomingCall({
                    offer,
                    isVideoCall,
                    caller: message.user.name,
                  });

                  // Play ringtone
                  const audio = new Audio("/ringtone.mp3");
                  audio.loop = true;
                  audio
                    .play()
                    .catch((error) =>
                      console.error("Error playing ringtone:", error)
                    );

                  toast({
                    title: "Incoming Call",
                    description: `${
                      isVideoCall ? "Video" : "Voice"
                    } call from ${message.user.name}`,
                  });
                }
              } catch (error) {
                console.error("Error parsing offer:", error);
              }
              delete offerChunks[total];
            }
            break;
          }

          case "call-offer":
            if (!inCall) {
              setIncomingCall({
                offer: message.custom.offer,
                isVideoCall: message.custom.isVideoCall,
                caller: message.user.name,
              });

              // Play ringtone
              const audio = new Audio("/ringtone.mp3");
              audio.loop = true;
              audio
                .play()
                .catch((error) =>
                  console.error("Error playing ringtone:", error)
                );

              toast({
                title: "Incoming Call",
                description: `${
                  message.custom.isVideoCall ? "Video" : "Voice"
                } call from ${message.user.name}`,
              });
            }
            break;

          case "screen-share-offer-chunk": {
            const { chunk, index, total, isLast } = message.custom;
            if (!screenShareOfferChunks[total]) {
              screenShareOfferChunks[total] = new Array(total).fill(null);
            }
            screenShareOfferChunks[total][index] = chunk;

            if (
              isLast &&
              screenShareOfferChunks[total].every((chunk) => chunk !== null)
            ) {
              const offerData = screenShareOfferChunks[total].join("");
              try {
                const offer = JSON.parse(offerData);
                if (peerConnection) {
                  await peerConnection.setRemoteDescription(
                    new RTCSessionDescription(offer)
                  );
                  const answer = await peerConnection.createAnswer();
                  await peerConnection.setLocalDescription(answer);

                  // Send compressed answer
                  const compressedAnswer = compressSessionDescription(answer);
                  await sendCallSignal("screen-share-answer", {
                    answer: compressedAnswer,
                  });
                }
              } catch (error) {
                console.error("Error handling screen share offer:", error);
              }
              delete screenShareOfferChunks[total]; // Cleanup
            }
            break;
          }

          case "ice-candidate-chunk": {
            const { chunk, index, total, isLast } = message.custom;
            if (!candidateChunks[total]) {
              candidateChunks[total] = new Array(total).fill(null);
            }
            candidateChunks[total][index] = chunk;

            if (
              isLast &&
              candidateChunks[total].every((chunk) => chunk !== null)
            ) {
              const candidateData = candidateChunks[total].join("");
              try {
                const candidate = JSON.parse(candidateData);
                if (peerConnection?.remoteDescription) {
                  await peerConnection.addIceCandidate(
                    new RTCIceCandidate(candidate)
                  );
                } else {
                  setPendingCandidates((prev) => [...prev, candidate]);
                }
              } catch (error) {
                console.error("Error parsing ICE candidate:", error);
              }
              delete candidateChunks[total]; // Cleanup
            }
            break;
          }

          case "call-answer-chunk": {
            const { chunk, index, total, isLast } = message.custom;
            answerChunks[index] = chunk;

            if (isLast && answerChunks.length === total) {
              const answerData = answerChunks.join("");
              const answer = JSON.parse(answerData);
              answerChunks = []; // Reset for next time

              if (peerConnection) {
                await peerConnection.setRemoteDescription(
                  new RTCSessionDescription(answer)
                );
                // Process any pending candidates
                while (pendingCandidates.length > 0) {
                  const candidate = pendingCandidates.shift();
                  await peerConnection.addIceCandidate(
                    new RTCIceCandidate(candidate)
                  );
                }
              }
            }
            break;
          }

          case "call-answer":
            if (peerConnection && message.custom.answer) {
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(message.custom.answer)
              );
              // Process any pending candidates
              while (pendingCandidates.length > 0) {
                const candidate = pendingCandidates.shift();
                await peerConnection.addIceCandidate(
                  new RTCIceCandidate(candidate)
                );
              }
            }
            break;

          case "screen-share-ended":
            if (screenVideoRef.current && remoteStream) {
              screenVideoRef.current.srcObject = null;
              remoteVideoRef.current.srcObject = remoteStream;
            }
            setScreenStream(null);
            setIsScreenSharing(false);
            break;

          case "call-declined":
            endCall();
            toast({
              title: "Call Declined",
              description: "The other person declined the call",
            });
            break;

          case "call-ended":
            endCall();
            toast({
              title: "Call Ended",
              description: "The other person ended the call",
            });
            break;
        }
      } catch (error) {
        console.error("Error handling WebRTC message:", error);
      }
    };

    channel.on("message.new", handleCallSignal);
    return () => {
      channel.off("message.new", handleCallSignal);
      offerChunks = {};
      answerChunks = {};
      candidateChunks = {};
      screenShareOfferChunks = {};
    };
  }, [channel, peerConnection, inCall, pendingCandidates]);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, []);

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

  // Add new audio element for ringtone
  useEffect(() => {
    const audio = new Audio("/ringtone.wav"); // Make sure to add a ringtone file to your public folder
    audio.loop = true;

    if (incomingCall) {
      audio
        .play()
        .catch((error) => console.error("Error playing ringtone:", error));
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [incomingCall]);

  const sendCallSignal = async (type, data = {}) => {
    const signalMessages = {
      "ice-candidate": "🔄 Connecting...",
      "ice-candidate-chunk": "🔄 Establishing connection...",
      "call-offer": "📞 Starting call...",
      "call-offer-chunk": "📞 Initiating call...",
      "call-answer": "✅ Call connected",
      "call-answer-chunk": "✅ Joining call...",
      "screen-share-offer": "🖥️ Starting screen share...",
      "screen-share-offer-chunk": "🖥️ Preparing screen share...",
      "screen-share-answer": "✅ Screen share connected",
      "screen-share-ended": "🖥️ Screen sharing ended",
      "call-declined": "❌ Call declined",
      "call-ended": "📞 Call ended",
    };

    const message = {
      text: signalMessages[type] || "📞 Call in progress...",
      custom: {
        type,
        ...data,
        isCallSignal: true, // Add this flag to identify call signals
      },
    };

    await channel.sendMessage(message);
  };

  if (!channel) return null;

  return (
    <>
      {incomingCall && (
        <IncomingCallOverlay
          caller={incomingCall.caller}
          isVideoCall={incomingCall.isVideoCall}
          onAccept={acceptCall}
          onDecline={declineCall}
        />
      )}

      <div className="flex flex-col h-full">
        <Channel channel={channel}>
          <Window>
            <div className="flex flex-col h-full">
              {inCall && (
                <div className="fixed inset-0 z-50 bg-black">
                  <div className="relative h-full flex flex-col">
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 z-10">
                      <div className="text-white">
                        <h3 className="text-lg font-semibold">
                          {conversation?.name}
                        </h3>
                        <p className="text-sm opacity-80">
                          {isVideoCall ? "Video" : "Voice"} Call
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 relative">
                      {isVideoCall ? (
                        <div className="h-full relative">
                          {isScreenSharing && screenStream ? (
                            <div className="absolute inset-0">
                              <video
                                ref={screenVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-contain bg-black"
                              />
                            </div>
                          ) : remoteStream ? (
                            <video
                              ref={remoteVideoRef}
                              autoPlay
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black">
                              <p className="text-white text-lg">
                                Waiting for others to join...
                              </p>
                            </div>
                          )}
                          <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute bottom-20 right-4 w-[240px] aspect-video rounded-lg overflow-hidden shadow-lg object-cover bg-black/50"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-white">
                            <div className="w-24 h-24 rounded-full bg-primary/20 mb-6 mx-auto flex items-center justify-center">
                              <Phone className="w-12 h-12" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                              Voice Call in Progress
                            </h3>
                            <p className="text-sm opacity-80">
                              {conversation?.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 p-4 bg-gradient-to-t from-black/50 z-20">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/10 hover:bg-white/20"
                        onClick={toggleMute}
                      >
                        {isMuted ? (
                          <MicOff className="h-5 w-5 text-white" />
                        ) : (
                          <Mic className="h-5 w-5 text-white" />
                        )}
                      </Button>
                      {isVideoCall && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/10 hover:bg-white/20"
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
                            className="rounded-full bg-white/10 hover:bg-white/20"
                            onClick={
                              isScreenSharing
                                ? stopScreenShare
                                : startScreenShare
                            }
                          >
                            {isScreenSharing ? (
                              <MonitorOff className="h-5 w-5 text-white" />
                            ) : (
                              <MonitorUp className="h-5 w-5 text-white" />
                            )}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full"
                        onClick={endCall}
                      >
                        <PhoneOff className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b bg-white">
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
                    className="hover:bg-primary/10 text-primary"
                    onClick={() => startCall(true)}
                  >
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 text-primary"
                    onClick={() => startCall(false)}
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-grow h-full overflow-y-auto">
                <MessageList />
              </ScrollArea>

              <div className="flex items-center space-x-2 p-2 border-t bg-white">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 text-primary"
                    >
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
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 text-primary"
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
      </div>
    </>
  );
}
