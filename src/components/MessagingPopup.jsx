'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, MessageCircle, MoreHorizontal, Search, Send, ArrowLeft } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function MessagingPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('focused')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [message, setMessage] = useState('')
  const pathname = usePathname()

  const isMessagePage = pathname === '/messages' || pathname?.startsWith('/messages/')

  const conversations = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      message: "Hi, I'd love to collaborate on your research...",
      timestamp: "Nov 12",
      avatar: "https://picsum.photos/seed/sarah/200",
      online: true,
      messages: [
        { id: 1, sender: "Dr. Sarah Johnson", content: "Hi, I'd love to collaborate on your research project. Do you have time to discuss it?", timestamp: "Nov 12, 10:30 AM" },
        { id: 2, sender: "You", content: "I'm very interested in collaboration. What aspects of the research are you most interested in?", timestamp: "Nov 12, 11:15 AM" },
        { id: 3, sender: "Dr. Sarah Johnson", content: "I'm particularly intrigued by your methodology. Could we schedule a call to dive deeper into the details?", timestamp: "Nov 12, 11:45 AM" },
      ]
    },
    {
      id: 2,
      name: "Prof. David Lee",
      message: "The conference deadline has been extended...",
      timestamp: "Nov 7",
      avatar: "https://picsum.photos/seed/david/200",
      online: false,
      messages: [
        { id: 1, sender: "Prof. David Lee", content: "The conference deadline has been extended by two weeks. Will you be able to submit your paper?", timestamp: "Nov 7, 2:00 PM" },
        { id: 2, sender: "You", content: "That's great news! Yes, I'll definitely be able to submit now. Thanks for letting me know.", timestamp: "Nov 7, 2:30 PM" },
      ]
    },
    {
      id: 3,
      name: "Dr. Maria Rodriguez",
      message: "Here's the latest data from the experiment...",
      timestamp: "Nov 6",
      avatar: "https://picsum.photos/seed/maria/200",
      online: true,
      messages: [
        { id: 1, sender: "Dr. Maria Rodriguez", content: "Here's the latest data from the experiment. The results are quite interesting!", timestamp: "Nov 6, 9:00 AM" },
        { id: 2, sender: "You", content: "Thank you, Maria! I'll take a look right away. Do you want to discuss the findings later today?", timestamp: "Nov 6, 9:30 AM" },
        { id: 3, sender: "Dr. Maria Rodriguez", content: "How about we meet at 3 PM?", timestamp: "Nov 6, 10:00 AM" },
      ]
    },
  ]

  const handleSend = (e) => {
    e.preventDefault()
    if (message.trim() && selectedConversation) {
      const newMessage = {
        id: selectedConversation.messages.length + 1,
        sender: "You",
        content: message,
        timestamp: new Date().toLocaleString()
      }
      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage]
      })
      setMessage('')
    }
  }

  useEffect(() => {
    if (isMessagePage) {
      setIsOpen(false)
    }
  }, [isMessagePage])

  if (isMessagePage) {
    return null
  }

  return (
    <div className="fixed bottom-0 right-4 w-80 z-50 hidden md:block">
      <div className="bg-white rounded-t-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => {
            if (selectedConversation) {
              setSelectedConversation(null)
            } else {
              setIsOpen(!isOpen)
            }
          }}
        >
          <div className="flex items-center gap-2">
            {selectedConversation && (
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={(e) => {
                e.stopPropagation()
                setSelectedConversation(null)
              }}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedConversation?.avatar || "/placeholder.svg"} alt={selectedConversation ? selectedConversation.name : "Messages"} />
              <AvatarFallback>
                <MessageCircle className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">{selectedConversation ? selectedConversation.name : "Messages"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isOpen || selectedConversation ? "transform rotate-180" : ""
            )} />
          </div>
        </div>

        {/* Expandable Content */}
        <div className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen || selectedConversation ? "max-h-[32rem]" : "max-h-0"
        )}>
          {selectedConversation ? (
            // Conversation View
            <>
              <ScrollArea className="h-80 p-3">
                {selectedConversation.messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "mb-4",
                    msg.sender === "You" ? "text-right" : "text-left"
                  )}>
                    <div className={cn(
                      "inline-block p-2 rounded-lg",
                      msg.sender === "You" ? "bg-[#6366F1] text-white" : "bg-gray-100"
                    )}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                  </div>
                ))}
              </ScrollArea>
              <form onSubmit={handleSend} className="p-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="bg-[#6366F1] hover:bg-[#5457E5]">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            // Message List View
            <>
              {/* Search */}
              <div className="p-3 border-t border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search messages"
                    className="pl-9 bg-gray-50 border-0"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-t border-gray-200">
                <button
                  className={cn(
                    "flex-1 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeTab === 'focused'
                      ? "border-[#6366F1] text-[#6366F1]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab('focused')}
                >
                  Focused
                </button>
                <button
                  className={cn(
                    "flex-1 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeTab === 'other'
                      ? "border-[#6366F1] text-[#6366F1]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab('other')}
                >
                  Other
                </button>
              </div>

              {/* Conversations */}
              <ScrollArea className="h-80">
                <div className="divide-y divide-gray-200">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-medium truncate">{conversation.name}</p>
                          <span className="text-xs text-gray-500 flex-shrink-0">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conversation.message}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>
    </div>
  )
}