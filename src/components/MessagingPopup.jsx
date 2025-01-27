"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function MessagingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("focused");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isMessagePage =
    pathname === "/messages" || pathname?.startsWith("/messages/");

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(
        `/api/messages/rooms/${conversationId}/messages`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Fetch conversations and their latest messages
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/messages/rooms");
        if (!response.ok) throw new Error("Failed to fetch conversations");
        const data = await response.json();

        const transformedConversations = [
          ...(data.rooms.DM || []).map((dm) => ({
            id: dm.id,
            type: "DM",
            name: dm.name,
            message: dm.lastMessage?.content || "No messages yet",
            timestamp: dm.lastMessage?.timestamp || new Date().toISOString(),
            avatar: dm.avatar || `/api/avatar/${dm.id}`,
            online: false,
            messages: [],
          })),
          ...(data.rooms.RR || []).map((rr) => ({
            id: rr.id,
            type: "RR",
            name: rr.name,
            message: rr.lastMessage?.content || "No messages yet",
            timestamp: rr.lastMessage?.timestamp || new Date().toISOString(),
            avatar: rr.avatar || `/api/avatar/${rr.id}`,
            online: false,
            messages: [],
          })),
        ];
        setConversations(transformedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    if (!isMessagePage) {
      fetchConversations();
    }
  }, [isMessagePage]);

  // Handle conversation selection
  const handleConversationClick = async (conversation) => {
    if (window.innerWidth < 768) {
      router.push(`/messages?id=${conversation.id}&type=${conversation.type}`);
    } else {
      const messages = await fetchMessages(conversation.id);
      setSelectedConversation({
        ...conversation,
        messages: messages.map((msg) => ({
          id: msg.id,
          sender: msg.sender === "You" ? "You" : conversation.name,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
      });
      setIsOpen(true);
    }
  };

  // Handle sending messages
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation || isLoadingMessages) return;

    try {
      const response = await fetch(
        `/api/messages/rooms/${selectedConversation.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: message,
            roomType: selectedConversation.type,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();

      const newMessage = {
        id: data.message.id || Date.now(),
        sender: "You",
        content: message,
        timestamp: new Date().toISOString(),
      };

      setSelectedConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                message: message,
                timestamp: new Date().toISOString(),
              }
            : conv
        )
      );

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (isMessagePage) {
      setIsOpen(false);
      setSelectedConversation(null);
    }
  }, [isMessagePage]);

  if (isMessagePage) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-4 w-80 z-50 hidden md:block">
      <div className="bg-white rounded-t-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => {
            if (selectedConversation) {
              setSelectedConversation(null);
            } else {
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="flex items-center gap-2">
            {selectedConversation && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedConversation(null);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={selectedConversation?.avatar || "/placeholder.svg"}
                alt={
                  selectedConversation ? selectedConversation.name : "Messages"
                }
              />
              <AvatarFallback>
                <MessageCircle className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">
              {selectedConversation ? selectedConversation.name : "Messages"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen || selectedConversation ? "transform rotate-180" : ""
              )}
            />
          </div>
        </div>

        {/* Expandable Content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isOpen || selectedConversation ? "max-h-[32rem]" : "max-h-0"
          )}
        >
          {selectedConversation ? (
            <>
              <ScrollArea className="h-80 p-3">
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-sm text-gray-500">
                      Loading messages...
                    </span>
                  </div>
                ) : selectedConversation.messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-sm text-gray-500">
                      No messages yet
                    </span>
                  </div>
                ) : (
                  selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "mb-4",
                        msg.sender === "You" ? "text-right" : "text-left"
                      )}
                    >
                      <div
                        className={cn(
                          "inline-block p-2 rounded-lg max-w-[80%]",
                          msg.sender === "You"
                            ? "bg-[#6366F1] text-white"
                            : "bg-gray-100"
                        )}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(msg.timestamp), "MMM d, h:mm a")}
                      </p>
                    </div>
                  ))
                )}
              </ScrollArea>
              <form
                onSubmit={handleSend}
                className="p-3 border-t border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={isLoadingMessages}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-[#6366F1] hover:bg-[#5457E5]"
                    disabled={isLoadingMessages || !message.trim()}
                  >
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
                    activeTab === "focused"
                      ? "border-[#6366F1] text-[#6366F1]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab("focused")}
                >
                  Focused
                </button>
                <button
                  className={cn(
                    "flex-1 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeTab === "other"
                      ? "border-[#6366F1] text-[#6366F1]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab("other")}
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
                      onClick={() => handleConversationClick(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={conversation.avatar}
                            alt={conversation.name}
                          />
                          <AvatarFallback>
                            {conversation.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-medium truncate">
                            {conversation.name}
                          </p>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {format(new Date(conversation.timestamp), "MMM d")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.message}
                        </p>
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
  );
}
