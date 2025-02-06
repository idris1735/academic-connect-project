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
  Search,
  Send,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { chatClient } from "./StreamChatProvider";
import { useToast } from "@/components/ui/use-toast";

export default function MessagingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [channel, setChannel] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const isMessagePage =
    pathname === "/messages" || pathname?.startsWith("/messages/");

  // Fetch conversations when component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // First try to get existing chats
        const response = await fetch("/api/messages/rooms");
        if (!response.ok) throw new Error("Failed to fetch conversations");

        const data = await response.json();
        const allRooms = [
          ...(data.rooms.DM || []).map((dm) => ({
            id: dm.id,
            type: "DM",
            name: dm.name,
            lastMessage: dm.lastMessage?.content || "No messages yet",
            timestamp: dm.lastMessage?.timestamp || new Date().toISOString(),
            avatar:
              dm.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${dm.id}`,
          })),
          ...(data.rooms.RR || []).map((rr) => ({
            id: rr.id,
            type: "RR",
            name: rr.name,
            lastMessage: rr.lastMessage?.content || "No messages yet",
            timestamp: rr.lastMessage?.timestamp || new Date().toISOString(),
            avatar:
              rr.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${rr.id}`,
          })),
        ];

        setConversations(allRooms);

        // Then set up Stream Chat channels for these rooms
        if (chatClient.userID) {
          allRooms.forEach(async (room) => {
            const channel = chatClient.channel("messaging", room.id);
            await channel.watch();
          });
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
      }
    };

    const handleEvent = () => {
      if (!isMessagePage) {
        fetchConversations();
      }
    };

    if (!isMessagePage) {
      fetchConversations();
    }

    chatClient.on("message.new", handleEvent);
    chatClient.on("notification.message_new", handleEvent);

    return () => {
      chatClient.off("message.new", handleEvent);
      chatClient.off("notification.message_new", handleEvent);
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [isMessagePage]);

  // Handle conversation selection
  const handleConversationClick = async (conversation) => {
    try {
      setIsLoadingMessages(true);
      if (window.innerWidth < 768) {
        router.push(`/messages?id=${conversation.id}`);
        return;
      }

      if (channel) {
        channel.stopWatching();
      }

      const newChannel = chatClient.channel("messaging", conversation.id);
      await newChannel.watch();
      setChannel(newChannel);
      setSelectedConversation(conversation);
      setIsOpen(true);

      // Watch for new messages
      newChannel.on("message.new", (event) => {
        setSelectedConversation((prev) => ({
          ...prev,
          lastMessage: event.message.text,
          timestamp: event.message.created_at,
        }));
      });
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Handle sending messages
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !channel) return;

    try {
      await channel.sendMessage({
        text: message,
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isMessagePage) {
      setIsOpen(false);
      setSelectedConversation(null);
      if (channel) {
        channel.stopWatching();
        setChannel(null);
      }
    }
  }, [isMessagePage]);

  if (isMessagePage) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-4 w-80 z-50 hidden md:block">
      <div className="bg-white rounded-t-xl shadow-lg border border-gray-200">
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => {
            if (selectedConversation) {
              setSelectedConversation(null);
              channel?.stopWatching();
              setChannel(null);
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
                  channel?.stopWatching();
                  setChannel(null);
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
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen || selectedConversation ? "transform rotate-180" : ""
            )}
          />
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isOpen || selectedConversation ? "max-h-[32rem]" : "max-h-0"
          )}
        >
          {selectedConversation && channel ? (
            <>
              <ScrollArea className="h-80 p-3">
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-sm text-gray-500">
                      Loading messages...
                    </span>
                  </div>
                ) : channel.state.messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-sm text-gray-500">
                      No messages yet
                    </span>
                  </div>
                ) : (
                  channel.state.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "mb-4",
                        msg.user.id === chatClient.userID
                          ? "text-right"
                          : "text-left"
                      )}
                    >
                      <div
                        className={cn(
                          "inline-block p-2 rounded-lg max-w-[80%]",
                          msg.user.id === chatClient.userID
                            ? "bg-[#6366F1] text-white"
                            : "bg-gray-100"
                        )}
                      >
                        <p className="text-sm break-words">{msg.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(msg.created_at), "MMM d, h:mm a")}
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
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-[#6366F1] hover:bg-[#5457E5]"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="p-3 border-t border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search messages"
                    className="pl-9 bg-gray-50 border-0"
                  />
                </div>
              </div>

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
                          {conversation.lastMessage}
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
