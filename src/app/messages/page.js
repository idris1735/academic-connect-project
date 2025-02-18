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

import { useDispatch, useSelector } from "react-redux";
import { createWorkflow, fetchWorkflows, addTask, updateTaskStatus, updateWorkflowFromWebsocket } from "@/redux/features/workflowSlice";

function MessagesContent() {
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState("messages");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  const [rooms, setRooms] = useState({
    directMessages: [],
    researchRooms: [],
  });

  const { toast } = useToast();


  const workflows = useSelector((state) => state.workflow.workflows);

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
          researchRooms: data.rooms.RR || [],
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

  useEffect(() => {
    // Fetch workflows when component mounts
    dispatch(fetchWorkflows())
      .unwrap()
      .then((fetchedWorkflows) => {
        console.log('Fetched workflows:', fetchedWorkflows);
      })
      .catch((err) => {
        console.error('Error fetching workflows:', err);
      });
  }, [dispatch]);

  // // Add polling for workflow updates
  // useEffect(() => {
  //   const pollInterval = setInterval(() => {
  //     dispatch(fetchWorkflows())
  //       .unwrap()
  //       .catch((err) => {
  //         console.error('Error polling workflows:', err);
  //       });
  //   }, 10000); // Poll every 10 seconds

  //   return () => clearInterval(pollInterval);
  // }, [dispatch]);

  useEffect(() => {
    const eventSource = new EventSource('/api/workflows/events');
    console.log('EventSource created');

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.onmessage = (event) => {
      console.log('SSE message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('Parsed SSE data:', data);
        
        if (data.type === 'connected') {
          console.log('SSE connection established');
        } else if (data.type === 'WORKFLOW_UPDATED') {
          console.log('Dispatching workflow update:', data);
          dispatch(updateWorkflowFromWebsocket(data));
        } else {
          console.log('Unknown event type:', data.type);
        }
      } catch (error) {
        console.error('Error processing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return () => {
      console.log('Closing SSE connection');
      eventSource.close();
    };
  }, [dispatch]);

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
        name,
        description,
        avatar: `https://picsum.photos/seed/${name}/200`,
        members: [],
        resources: [],
        schedule: [],
      };

      const roomData = { ...newRoom, roomType: "RR", participants: [] };
      console.log(roomData);

      const response = await fetch("/api/messages/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomData }),
      });
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to create room");
      }
      const createdRoom = await response.json();

      setRooms((prevRooms) => ({
        ...prevRooms,
        researchRooms: [...prevRooms.researchRooms, createdRoom.room],
      }));

      toast({
        title: "Room Created",
        description: `Your new room "${name}" has been created successfully.`,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleCreateWorkflow = async (name) => {
    try {
      console.log('Creating workflow:', name);
      const result = await dispatch(createWorkflow({ name })).unwrap();
      console.log('Workflow created:', result);
      
      toast({
        title: "Workflow Created",
        description: `Your new workflow "${name}" has been created successfully.`,
      });

      return result.id;
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create workflow",
        variant: "destructive",
      });
      throw error;
    } 
  };

  const handleAddTask = async (task, title, description, assignedTo, dueDate, workflowId) => {
    try {
      const result = await dispatch(addTask({ 
        workflowId, 
        title, 
        description, 
        assignedTo, 
        dueDate 
      })).unwrap();
      
      toast({
        title: "Task Added",
        description: "New task has been added successfully.",
      });

      return result.task.id; // Return the new task ID
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleAssignTask = async (workflowId, taskId, taskData) => {
    try {
      await dispatch(updateTaskStatus({ 
        workflowId, 
        taskId, 
        status: taskData.status 
      })).unwrap();
      
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
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
          const response = await fetch(`/api/messages/rooms?id=${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch room data");
          }
          console.log('GOt room data\n\n\n')
          const data = await response.json();
          console.log('data.rooms', data.rooms)
          setSelectedItem(data.rooms);
          
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
              workflows={workflows ? workflows : []}
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
