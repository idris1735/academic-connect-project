"use client";

import React, { useState, useEffect } from "react";
import { chatClient } from "./StreamChatProvider";
import { Channel } from "stream-chat-react";
import { MessageList, MessageInput } from "stream-chat-react";
import { MessageCircle, X, ChevronDown, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export default function MessagingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/users/current");
        if (response.ok) {
          setIsAuthenticated(true);
          setLoading(false);
        } else if (response.status === 401) {
          // If 401, wait and retry indefinitely
          setTimeout(() => {
            checkAuth(); // Retry the authentication check
          }, 1000); // Wait for 1 second before retrying
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth(); // Start the authentication check
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!chatClient?.userID || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const filter = { members: { $in: [chatClient.userID] } };
        const sort = [{ last_message_at: -1 }];

        const channels = await chatClient.queryChannels(filter, sort);

        const formattedConversations = channels.map((ch) => {
          const otherMembers = ch.state.members
            ? Object.values(ch.state.members)
                .filter((member) => member.user?.id !== chatClient.userID)
                .map((member) => member.user?.name || "Unknown User")
            : [];

          return {
            id: ch.id,
            channel: ch,
            name: ch.data?.name || otherMembers.join(", ") || "Unnamed Chat",
            lastMessage:
              ch.state.messages[ch.state.messages.length - 1]?.text ||
              "No messages yet",
            updatedAt:
              ch.state.messages[ch.state.messages.length - 1]?.created_at ||
              ch.created_at,
            avatar:
              ch.data?.image ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${ch.id}`,
          };
        });

        setConversations(formattedConversations);
        setError(null);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchConversations();

      // Listen for new messages
      const handleNewMessage = (event) => {
        fetchConversations();
      };

      chatClient?.on("message.new", handleNewMessage);

      return () => {
        chatClient?.off("message.new", handleNewMessage);
      };
    }
  }, [isAuthenticated]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSelectedChannel(null);
    }
  };

  const selectConversation = (conversation) => {
    setSelectedChannel(conversation.channel);
  };

  // Don't render anything if not authenticated or still loading
  if (!isAuthenticated || loading) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-4 w-80 z-50 hidden md:block">
      <div className="bg-white rounded-t-xl shadow-lg border border-gray-200">
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={togglePopup}
        >
          <div className="flex items-center gap-2">
            {selectedChannel && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedChannel(null);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Messages" />
              <AvatarFallback>
                <MessageCircle className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">
              {selectedChannel
                ? selectedChannel.data?.name || "Chat"
                : "Messages"}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen || selectedChannel ? "transform rotate-180" : ""
            )}
          />
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isOpen || selectedChannel ? "max-h-[32rem]" : "max-h-0"
          )}
        >
          {selectedChannel ? (
            <div className="h-80">
              <Channel channel={selectedChannel}>
                <div className="h-full flex flex-col">
                  <ScrollArea className="flex-1">
                    <MessageList />
                  </ScrollArea>
                  <div className="p-3 border-t border-gray-200">
                    <MessageInput />
                  </div>
                </div>
              </Channel>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center p-4">{error}</div>
                ) : conversations.length === 0 ? (
                  <div className="text-gray-500 text-center p-4">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={conversation.avatar}
                          alt={conversation.name}
                        />
                        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-medium truncate">
                            {conversation.name}
                          </p>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {format(new Date(conversation.updatedAt), "MMM d")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
