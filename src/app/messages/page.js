"use client";

import { useState, useEffect } from "react";
import { StreamChatProvider } from "@/components/StreamChatProvider";
import MessageSidebar from "@/components/MessageSidebar";
import MessageView from "@/components/MessageView";
import ResearchRoom from "@/components/ResearchRoom";
import { useToast } from "@/components/ui/use-toast";
import NavComponent from "@/components/NavComponent";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Workflow from "@/components/Workflow";
import { v4 as uuidv4 } from "uuid";

function MessagesContent() {
  const [activeView, setActiveView] = useState("messages");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflows, setWorkflows] = useState([
    { id: "wf1", name: "Research Project A", tasks: [], members: [] },
    { id: "wf2", name: "Grant Proposal Review", tasks: [], members: [] },
  ]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  const [rooms, setRooms] = useState({
    directMessages: [],
    researchRooms: [
      {
        id: "rr1",
        name: "AI Ethics Research",
        avatar: "https://picsum.photos/seed/ai-ethics/200",
        members: [
          { id: "user1", name: "Alice Johnson" },
          { id: "user2", name: "Bob Smith" },
          { id: "user3", name: "Charlie Brown" },
        ],
        resources: [
          { id: "res1", name: "AI Ethics Guidelines", url: "#" },
          { id: "res2", name: "Recent Survey Results", url: "#" },
        ],
        schedule: [
          { id: "sch1", name: "Weekly Meeting", date: "2023-06-15T10:00:00Z" },
          {
            id: "sch2",
            name: "Ethics Panel Discussion",
            date: "2023-06-20T14:00:00Z",
          },
        ],
      },
      {
        id: "rr2",
        name: "Quantum Computing",
        avatar: "https://picsum.photos/seed/quantum/200",
        members: [
          { id: "user2", name: "Bob Smith" },
          { id: "user4", name: "Diana Prince" },
          { id: "user5", name: "Ethan Hunt" },
        ],
        resources: [
          { id: "res3", name: "Quantum Algorithms Overview", url: "#" },
          { id: "res4", name: "Quantum Hardware Comparison", url: "#" },
        ],
        schedule: [
          {
            id: "sch3",
            name: "Quantum Theory Seminar",
            date: "2023-06-18T11:00:00Z",
          },
          {
            id: "sch4",
            name: "Lab Experiment #42",
            date: "2023-06-22T09:00:00Z",
          },
        ],
      },
    ],
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchMessageRooms = async () => {
      try {
        const response = await fetch("/api/messages/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch message rooms");
        }
        const data = await response.json();
        setRooms((prevRooms) => ({
          ...prevRooms,
          directMessages: data.rooms.DM || [],
        }));
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
        });
      }
    };

    fetchMessageRooms();
  }, []);

  const handleSelectItem = (item, type) => {
    setSelectedItem(item);
    setActiveView(type);
    if (type === "workflow") {
      setSelectedWorkflow(item);
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreateRoom = async (name, description) => {
    try {
      const newRoom = {
        id: uuidv4(),
        name,
        description,
        avatar: `https://picsum.photos/seed/${name}/200`,
        members: [],
        resources: [],
        schedule: [],
      };

      setRooms((prevRooms) => ({
        ...prevRooms,
        researchRooms: [...prevRooms.researchRooms, newRoom],
      }));

      toast({
        title: "Room Created",
        description: `Your new room "${name}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleCreateWorkflow = async (name) => {
    try {
      const newWorkflow = {
        id: uuidv4(),
        name,
        tasks: [],
        members: [],
      };

      setWorkflows((prevWorkflows) => [...prevWorkflows, newWorkflow]);

      toast({
        title: "Workflow Created",
        description: `Your new workflow "${name}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleAddTask = async (task) => {
    try {
      const newTaskId = uuidv4();
      const newTask = {
        id: newTaskId,
        ...task,
      };

      setSelectedWorkflow((prevWorkflow) => ({
        ...prevWorkflow,
        tasks: [...prevWorkflow.tasks, newTask],
      }));

      toast({
        title: "Task Added",
        description: `Task "${task.name}" has been added successfully.`,
      });

      return newTaskId;
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleAssignTask = async (taskId, taskData) => {
    try {
      setSelectedWorkflow((prevWorkflow) => ({
        ...prevWorkflow,
        tasks: prevWorkflow.tasks.map((task) =>
          task.id === taskId ? { ...task, ...taskData } : task
        ),
      }));

      toast({
        title: "Task Updated",
        description: "Task has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (id) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/messages/rooms/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch room data");
          }
          const data = await response.json();
          setSelectedItem(data.room);
          setActiveView(type === "DM" ? "messages" : "research");
        } catch (error) {
          toast({
            title: "Error",
            description: error.message,
          });
        }
      };
      router.replace("/messages");
      fetchMessages();
    }
  }, [id, type]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavComponent />
      <main className="h-[calc(100vh-4rem)] mt-5 overflow-y-auto">
        <div className="mx-auto h-[90%] max-w-7xl overflow-hidden">
          <div className="grid h-full grid-cols-[280px_1fr] overflow-y-auto rounded-lg bg-white shadow-md">
            <MessageSidebar
              onSelectDM={(dm) => handleSelectItem(dm, "messages")}
              onSelectResearchRoom={(room) =>
                handleSelectItem(room, "research")
              }
              onSelectWorkflow={(workflow) =>
                handleSelectItem(workflow, "workflow")
              }
              onCreateWorkflow={handleCreateWorkflow}
              onCreateRoom={handleCreateRoom}
              rooms={rooms}
              workflows={workflows}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
            />
            <div className="flex-1 w-full md:w-auto">
              <div className="h-full overflow-y-auto bg-white">
                {!selectedItem && activeView !== "workflow" ? (
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
                    {activeView === "workflow" && (
                      <Workflow
                        workflow={selectedWorkflow}
                        onToggleSidebar={toggleSidebar}
                        onAddTask={handleAddTask}
                        onAssignTask={handleAssignTask}
                      />
                    )}
                  </>
                )}
              </div>
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
