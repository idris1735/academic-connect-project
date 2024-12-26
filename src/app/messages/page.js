"use client";

import { StreamChatProvider } from '@/components/StreamChatProvider'
import MessageSidebar from "@/components/MessageSidebar";
import MessageView from "@/components/MessageView";
import ResearchRoom from "@/components/ResearchRoom";
import { useToast } from "@/components/ui/use-toast";
import NavComponent from "@/components/NavComponent";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from "react";

function MessagesContent() {
  const [activeView, setActiveView] = useState("messages");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter()
  
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const type = searchParams.get('type')

  const dummyConversations = [
    {
      id: 'dm1',
      name: 'Alice Johnson',
      avatar: 'https://picsum.photos/seed/alice/200',
    },
    {
      id: 'dm2',
      name: 'Bob Smith',
      avatar: 'https://picsum.photos/seed/bob/200',
    },
  ];

  const [rooms, setRooms] = useState({
    directMessages: dummyConversations,
    researchRooms: [],
  });

  const { toast } = useToast();

  const handleSelectItem = (item, type) => {
    setSelectedItem(item);
    setActiveView(type);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreateRoom = (name, description) => {
    const newRoom = {
      id: rooms.length + 1,
      name,
      description,
      members: [],
      type: "research",
    };
    setRooms((prevRooms) => [...prevRooms, newRoom]);
    toast({
      title: "Room Created",
      description: `Your new room "${name}" has been created successfully.`,
    });
  };

  const handleCreateWorkflow = (name, description) => {
    toast({
      title: "Workflow Created",
      description: `Your new workflow "${name}" has been created successfully.`,
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
 
  useEffect(() => {
    if (id) {
      // Query API for messages
      const fetchMessages = async () => {
        const response = await fetch(`/api/messages/rooms?id=${id}`);
        const data = await response.json();
        setSelectedItem(data.rooms);
        if (type == 'DM'){
          setActiveView("messages")
        } else if (type == 'RM'){
          setActiveView("research")
        } else {
          setActiveView("workflow")
        }
      };
      router.replace('/messages');
      fetchMessages()   
    }
  }, [id])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavComponent />
      <main className="container mx-auto px-4 ">
        <div className="flex flex-1 overflow-hidden">
          <MessageSidebar
            onSelectDM={(dm) => handleSelectItem(dm, "messages")}
            onSelectResearchRoom={(room) => handleSelectItem(room, "research")}
            rooms={rooms}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
          <div className="flex-1 w-full md:w-auto">
            <div className="h-full overflow-y-auto bg-white">
              {!selectedItem ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a conversation to start messaging
                </div>
              ) : (
                <>
                  {activeView === "messages" && (
                    <MessageView
                      conversation={selectedItem}
                      onToggleSidebar={toggleSidebar}
                    />
                  )}
                  {activeView === "research" && (
                    <ResearchRoom
                      room={selectedItem}
                      onToggleSidebar={toggleSidebar}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <StreamChatProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <MessagesContent />
      </Suspense>
    </StreamChatProvider>
  );
}
