'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelStateContext,
} from 'stream-chat-react'
import { Button } from '@/components/ui/button'
import { Menu, Video, Phone, Smile, Mic, Square, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from "@/components/ui/use-toast"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { chatClient } from './StreamChatProvider'

export default function MessageView({ conversation, onToggleSidebar }) {
  const [channel, setChannel] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const messageListRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    if (conversation) {
      const setupChannel = async () => {
        try {
          const channelId = conversation.id
          const newChannel = chatClient.channel('messaging', channelId, {
            name: conversation.name,
          })
          await newChannel.watch()
          setChannel(newChannel)
        } catch (error) {
          console.error('Error setting up channel:', error)
        }
      }

      setupChannel()
    }
  }, [conversation])

  useEffect(() => {
    const messageList = document.querySelector('.str-chat__message-list')
    const sidebar = document.querySelector('.message-sidebar')
    const sidebarContent = sidebar?.querySelector('.sidebar-content')
    const sidebarFooter = sidebar?.querySelector('.sidebar-footer')
    
    if (messageList && sidebar && sidebarContent && sidebarFooter) {
      messageListRef.current = messageList
      
      const handleScroll = () => {
        const scrollPercentage = messageList.scrollTop / (messageList.scrollHeight - messageList.clientHeight)
        const newSidebarScroll = scrollPercentage * (sidebarContent.scrollHeight - sidebarContent.clientHeight)
        
        // Only update if the difference is significant to prevent loops
        if (Math.abs(sidebarContent.scrollTop - newSidebarScroll) > 5) {
          sidebarContent.scrollTop = newSidebarScroll
        }

        // Keep the footer at the bottom
        sidebarFooter.style.bottom = `${messageList.scrollHeight - messageList.scrollTop - messageList.clientHeight}px`
      }
      
      messageList.addEventListener('scroll', handleScroll)
      return () => messageList.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
      const call = await channel.client.call('video', {
        channelId: channel.id,
        callId,
        type: callType,
        audio: true,
        video: isVideoCall,
      })

      // Join the call
      await call.join()

      // Notify other members
      await channel.sendMessage({
        text: `Started a ${callType} call`,
        callId,
      })

      toast({
        title: "Call Started",
        description: `${isVideoCall ? 'Video' : 'Audio'} call is now active`,
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
                  <div className="font-semibold">{conversation?.name}</div>
                  <div className="text-sm text-muted-foreground">Active now</div>
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
    </div>
  )
}



