'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { chatClient } from './StreamChatProvider'
import {
  DailyProvider,
  useDaily,
  useLocalParticipant,
  useParticipantIds,
  useScreenShare,
  DailyVideo,
  useCallObject,
  DailyAudio,
} from '@daily-co/daily-react'
import DailyIframe from '@daily-co/daily-js'

function IncomingCallOverlay({ caller, isVideoCall, onAccept, onDecline }) {
  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80'>
      <div className='flex flex-col items-center p-8 rounded-lg bg-white/10 backdrop-blur-sm'>
        <div className='w-24 h-24 rounded-full bg-primary/20 mb-6 flex items-center justify-center'>
          {isVideoCall ? (
            <Video className='w-12 h-12 text-white' />
          ) : (
            <Phone className='w-12 h-12 text-white' />
          )}
        </div>
        <h2 className='text-2xl font-semibold mb-2 text-white'>
          {caller || 'Incoming Call'}
        </h2>
        <p className='text-gray-200 mb-8'>
          Incoming {isVideoCall ? 'Video' : 'Voice'} Call...
        </p>
        <div className='flex gap-6'>
          <button
            onClick={onDecline}
            className='w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors'
          >
            <PhoneOff className='w-8 h-8 text-white' />
          </button>
          <button
            onClick={onAccept}
            className='w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors'
          >
            <Phone className='w-8 h-8 text-white' />
          </button>
        </div>
      </div>
    </div>
  )
}

function CallUI({ onEndCall }) {
  const { callObject } = useDaily()
  const participantIds = useParticipantIds()
  const { toast } = useToast()
  const localParticipant = useLocalParticipant()
  const { isSharingScreen, startScreenShare, stopScreenShare, screens } =
    useScreenShare()

  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  // Initialize media tracks when joining call
  useEffect(() => {
    if (!callObject) return

    const setupTracks = async () => {
      try {
        // Get the local tracks
        const { camera, mic } = await callObject.getUserMedia()
        if (mic) {
          await callObject.setLocalAudio(true)
          setIsMuted(false)
        }
        if (camera) {
          await callObject.setLocalVideo(true)
          setIsVideoEnabled(true)
        }
      } catch (error) {
        console.error('Error setting up media tracks:', error)
      }
    }

    const handleTrackStarted = (event) => {
      const { participant, track } = event
      if (participant.local) {
        if (track.kind === 'audio') {
          setIsMuted(false)
        } else if (track.kind === 'video') {
          setIsVideoEnabled(true)
        }
      }
    }

    const handleTrackStopped = (event) => {
      const { participant, track } = event
      if (participant.local) {
        if (track.kind === 'audio') {
          setIsMuted(true)
        } else if (track.kind === 'video') {
          setIsVideoEnabled(false)
        }
      }
    }

    setupTracks()
    callObject.on('track-started', handleTrackStarted)
    callObject.on('track-stopped', handleTrackStopped)

    return () => {
      callObject.off('track-started', handleTrackStarted)
      callObject.off('track-stopped', handleTrackStopped)
      // Cleanup tracks
      if (callObject) {
        callObject.setLocalAudio(false)
        callObject.setLocalVideo(false)
      }
    }
  }, [callObject]) // Only depend on callObject

  const toggleMute = useCallback(async () => {
    if (!callObject) return
    try {
      const newMuted = !isMuted
      await callObject.setLocalAudio(!newMuted)
      setIsMuted(newMuted)
    } catch (error) {
      console.error('Error toggling audio:', error)
      toast({
        title: 'Error',
        description: 'Could not toggle microphone',
        variant: 'destructive',
      })
    }
  }, [callObject, isMuted])

  const toggleVideo = useCallback(async () => {
    if (!callObject) return
    try {
      const newVideoEnabled = !isVideoEnabled
      await callObject.setLocalVideo(newVideoEnabled)
      setIsVideoEnabled(newVideoEnabled)
    } catch (error) {
      console.error('Error toggling video:', error)
      toast({
        title: 'Error',
        description: 'Could not toggle camera',
        variant: 'destructive',
      })
    }
  }, [callObject, isVideoEnabled])

  const handleScreenShare = useCallback(async () => {
    try {
      if (isSharingScreen) {
        await stopScreenShare()
      } else {
        await startScreenShare()
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
      toast({
        title: 'Error',
        description: 'Could not toggle screen sharing',
        variant: 'destructive',
      })
    }
  }, [isSharingScreen, startScreenShare, stopScreenShare])

  // Monitor call object state
  useEffect(() => {
    if (!callObject) return

    const handleJoined = () => {
      console.log('Successfully joined the meeting')
    }

    const handleLeft = () => {
      console.log('Left the meeting')
      // Reset states when leaving
      setIsMuted(false)
      setIsVideoEnabled(true)
    }

    const handleError = (error) => {
      console.error('Daily.co error:', error)
      toast({
        title: 'Call Error',
        description: error.errorMsg || 'An error occurred during the call',
        variant: 'destructive',
      })
    }

    callObject.on('joined-meeting', handleJoined)
    callObject.on('left-meeting', handleLeft)
    callObject.on('error', handleError)

    return () => {
      callObject.off('joined-meeting', handleJoined)
      callObject.off('left-meeting', handleLeft)
      callObject.off('error', handleError)
    }
  }, [callObject, toast])

  return (
    <div className='fixed inset-0 z-50 bg-black'>
      <div className='relative h-full flex flex-col'>
        <div className='absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 z-10'>
          <div className='text-white'>
            <h3 className='text-lg font-semibold'>Call in Progress</h3>
            <p className='text-sm opacity-80'>
              {participantIds.length} participant(s)
            </p>
          </div>
        </div>

        <div className='flex-1 relative'>
          <div className='grid grid-cols-2 gap-4 p-4 h-full'>
            {participantIds.map((id) => (
              <div key={id} className='relative'>
                <DailyVideo
                  automirror
                  sessionId={id}
                  className='w-full h-full object-cover rounded-lg'
                />
              </div>
            ))}
            {screens.map((screen) => (
              <div key={screen.screenId} className='relative'>
                <DailyVideo
                  automirror={false}
                  sessionId={screen.session_id}
                  type='screenVideo'
                  className='w-full h-full object-contain rounded-lg'
                />
              </div>
            ))}
          </div>
        </div>

        <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-4 p-4 bg-gradient-to-t from-black/50'>
          <Button
            variant='ghost'
            size='icon'
            className={`rounded-full ${
              isMuted ? 'bg-red-500/80' : 'bg-white/10'
            } hover:bg-white/20 transition-colors`}
            onClick={toggleMute}
          >
            {isMuted ? (
              <MicOff className='h-5 w-5 text-white' />
            ) : (
              <Mic className='h-5 w-5 text-white' />
            )}
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className={`rounded-full ${
              !isVideoEnabled ? 'bg-red-500/80' : 'bg-white/10'
            } hover:bg-white/20 transition-colors`}
            onClick={toggleVideo}
          >
            {isVideoEnabled ? (
              <Camera className='h-5 w-5 text-white' />
            ) : (
              <CameraOff className='h-5 w-5 text-white' />
            )}
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className={`rounded-full ${
              isSharingScreen ? 'bg-green-500/80' : 'bg-white/10'
            } hover:bg-white/20 transition-colors`}
            onClick={handleScreenShare}
          >
            {isSharingScreen ? (
              <MonitorOff className='h-5 w-5 text-white' />
            ) : (
              <MonitorUp className='h-5 w-5 text-white' />
            )}
          </Button>
          <Button
            variant='destructive'
            size='icon'
            className='rounded-full'
            onClick={onEndCall}
          >
            <PhoneOff className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MessageView({ conversation, onToggleSidebar }) {
  const [channel, setChannel] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [inCall, setInCall] = useState(false)
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [incomingCall, setIncomingCall] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const { toast } = useToast()
  const [ringtoneAudio] = useState(new Audio('/ringtone.wav'))
  const [roomUrl, setRoomUrl] = useState(null)
  const callContainerRef = useRef(null)

  // Create call object with proper configuration
  const callObject = useCallObject({
    url: roomUrl,
    dailyConfig: {
      iframeStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        zIndex: 50,
      },
    },
  })

  const startCall = async (isVideo) => {
    try {
      // Set states before setting room URL
      setIsVideoCall(isVideo)
      setInCall(true)

      // Use the specific room URL
      const newRoomUrl = 'https://olanike.daily.co/academic-connect'
      console.log('Room URL:', newRoomUrl)

      // Join the room
      await callObject.join({ url: newRoomUrl })
      setRoomUrl(newRoomUrl)

      // Send the room URL through the chat
      await channel.sendMessage({
        text: '📞 Joining call...',
        custom: {
          type: 'call-started',
          roomUrl: newRoomUrl,
          isVideoCall: isVideo,
        },
      })

      toast({
        title: 'Call Started',
        description: 'Others can now join your call',
      })
    } catch (error) {
      console.error('Error starting call:', error)
      setInCall(false)
      setRoomUrl(null)
      toast({
        title: 'Error',
        description: error.message || 'Could not start call',
        variant: 'destructive',
      })
    }
  }

  const joinCall = async (newRoomUrl, isVideo) => {
    try {
      if (!newRoomUrl) {
        throw new Error('Invalid room URL')
      }

      // Set states before joining
      setIsVideoCall(isVideo)
      setInCall(true)
      setIncomingCall(null)

      // Stop the ringtone
      ringtoneAudio.pause()
      ringtoneAudio.currentTime = 0

      // Join the room
      await callObject.join({ url: newRoomUrl })
      setRoomUrl(newRoomUrl)

      toast({
        title: 'Call Joined',
        description: 'You have joined the call',
      })
    } catch (error) {
      console.error('Error joining call:', error)
      setInCall(false)
      setRoomUrl(null)
      toast({
        title: 'Error',
        description: error.message || 'Could not join call',
        variant: 'destructive',
      })
    }
  }

  const endCall = async () => {
    try {
      if (callObject) {
        await callObject.leave()
      }

      setInCall(false)
      setRoomUrl(null)
      setIsVideoCall(false)
      setIncomingCall(null)

      await channel.sendMessage({
        text: '📞 Call ended',
        custom: {
          type: 'call-ended',
        },
      })

      toast({
        title: 'Call Ended',
        description: 'The call has ended',
      })
    } catch (error) {
      console.error('Error ending call:', error)
      toast({
        title: 'Error',
        description: 'Error ending call: ' + error.message,
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!conversation) {
          console.log('No conversation data provided')
          return
        }

        console.log('Initializing chat with conversation:', conversation)

        // Ensure we have the required data
        if (!conversation.id || !conversation.participants) {
          console.error('Missing required conversation data')
          toast({
            title: 'Error',
            description: 'Invalid conversation data',
            variant: 'destructive',
          })
          return
        }

        // Create or get channel
        const channel = chatClient.channel('messaging', conversation.id, {
          members: Array.isArray(conversation.participants)
            ? conversation.participants
            : [conversation.participants],
          name: conversation.name || 'Chat',
        })

        console.log('Channel created:', channel)

        await channel.watch()
        setChannel(channel)
      } catch (error) {
        console.error('Error initializing chat:', error)
        toast({
          title: 'Error',
          description: 'Failed to load conversation',
          variant: 'destructive',
        })
      }
    }

    initializeChat()
  }, [conversation])

  const startRecording = async () => {
    try {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          ?.getTracks()
          .forEach((track) => track.stop())
        mediaRecorderRef.current = null
      }
      clearInterval(recordingTimerRef.current)
      audioChunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(100)
      setIsRecording(true)

      let time = 0
      recordingTimerRef.current = setInterval(() => {
        time += 1
        setRecordingTime(time)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: 'Error',
        description: 'Failed to start recording',
        variant: 'destructive',
      })
    }
  }

  const stopRecording = async (shouldSend = true) => {
    if (mediaRecorderRef.current && isRecording) {
      return new Promise((resolve) => {
        const cleanup = () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream
              .getTracks()
              .forEach((track) => track.stop())
          }
          clearInterval(recordingTimerRef.current)
          setIsRecording(false)
          setRecordingTime(0)
          mediaRecorderRef.current = null
          audioChunksRef.current = []
        }

        try {
          mediaRecorderRef.current.onstop = async () => {
            try {
              if (shouldSend && audioChunksRef.current.length > 0) {
                const audioBlob = new Blob(audioChunksRef.current, {
                  type: 'audio/webm;codecs=opus',
                })

                const file = new File([audioBlob], 'voice-message.webm', {
                  type: 'audio/webm;codecs=opus',
                  lastModified: Date.now(),
                })

                const response = await channel.sendFile(file)

                if (response.file) {
                  await channel.sendMessage({
                    text: '🎤 Voice Message',
                    attachments: [
                      {
                        type: 'audio',
                        asset_url: response.file,
                        title: 'Voice Message',
                        mime_type: 'audio/webm;codecs=opus',
                        file_size: file.size,
                      },
                    ],
                  })

                  toast({
                    title: 'Success',
                    description: 'Voice message sent successfully',
                  })
                }
              }
            } catch (error) {
              console.error('Error sending voice note:', error)
              toast({
                title: 'Error',
                description: 'Failed to send voice message: ' + error.message,
                variant: 'destructive',
              })
            } finally {
              cleanup()
              resolve()
            }
          }

          mediaRecorderRef.current.stop()
        } catch (error) {
          console.error('Error stopping recording:', error)
          cleanup()
          resolve()
        }
      })
    }
  }

  const handleEmojiSelect = (emoji) => {
    if (channel) {
      const messageInput = document.querySelector(
        '.str-chat__textarea textarea'
      )
      if (messageInput) {
        const start = messageInput.selectionStart
        const end = messageInput.selectionEnd
        const text = messageInput.value
        const newText =
          text.substring(0, start) + emoji.native + text.substring(end)

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        ).set
        nativeInputValueSetter.call(messageInput, newText)

        const ev2 = new Event('input', { bubbles: true })
        messageInput.dispatchEvent(ev2)

        messageInput.selectionStart = start + emoji.native.length
        messageInput.selectionEnd = start + emoji.native.length
        messageInput.focus()
      } else {
        channel.sendMessage({
          text: emoji.native,
        })
      }
    }
  }

  if (!channel) return null

  return (
    <>
      {incomingCall && (
        <IncomingCallOverlay
          caller={incomingCall.caller}
          isVideoCall={incomingCall.isVideoCall}
          onAccept={() =>
            joinCall(incomingCall.roomUrl, incomingCall.isVideoCall)
          }
          onDecline={() => {
            ringtoneAudio.pause()
            ringtoneAudio.currentTime = 0
            setIncomingCall(null)
          }}
        />
      )}

      <div className='flex flex-col h-full'>
        <DailyProvider>
          <div
            ref={callContainerRef}
            id='call-container'
            className='fixed inset-0 z-50'
            style={{ display: inCall ? 'block' : 'none' }}
          >
            <DailyAudio />
          </div>
          {inCall && callObject && roomUrl && <CallUI onEndCall={endCall} />}

          <Channel channel={channel}>
            <Window>
              <div className='flex flex-col h-full'>
                <div className='flex items-center justify-between p-4 border-b'>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={onToggleSidebar}
                      className='lg:hidden'
                    >
                      <Menu className='h-5 w-5' />
                    </Button>
                    <h2 className='text-lg font-semibold'>
                      {conversation?.name || 'Chat'}
                    </h2>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='hover:bg-primary/10 text-primary'
                      onClick={() => startCall(false)}
                    >
                      <Phone className='h-5 w-5' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='hover:bg-primary/10 text-primary'
                      onClick={() => startCall(true)}
                    >
                      <Video className='h-5 w-5' />
                    </Button>
                  </div>
                </div>

                <ScrollArea className='flex-grow h-full overflow-y-auto'>
                  <MessageList />
                </ScrollArea>

                <div className='flex items-center space-x-2 p-2 border-t bg-white'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='hover:bg-primary/10 text-primary'
                      >
                        <Smile className='h-4 w-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80 p-0'>
                      <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme='light'
                      />
                    </PopoverContent>
                  </Popover>

                  {isRecording ? (
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='destructive'
                        size='icon'
                        onClick={() => stopRecording(false)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='default'
                        size='icon'
                        onClick={() => stopRecording(true)}
                      >
                        <Square className='h-4 w-4' />
                      </Button>
                      <span className='text-sm text-red-500'>
                        Recording: {Math.floor(recordingTime / 60)}:
                        {(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  ) : (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='hover:bg-primary/10 text-primary'
                      onClick={startRecording}
                    >
                      <Mic className='h-4 w-4' />
                    </Button>
                  )}

                  <div className='flex-1'>
                    <MessageInput focus />
                  </div>
                </div>
              </div>
            </Window>
            <Thread />
          </Channel>
        </DailyProvider>
      </div>
    </>
  )
}
