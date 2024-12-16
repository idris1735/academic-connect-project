"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  Plus,
  Search,
  Edit,
  Users,
  MessageCircle,
  X,
  MoreVertical,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import PropTypes from "prop-types";

export default function MessageSidebar({
  onSelectDM,
  onSelectResearchRoom,
  onSelectWorkflow,
  onCreateRoom,
  onCreateWorkflow,
  isSidebarOpen,
  onToggleSidebar,
}) {
  const [dmsExpanded, setDmsExpanded] = useState(true);
  const [researchRoomsExpanded, setResearchRoomsExpanded] = useState(true);
  const [workflowsExpanded, setWorkflowsExpanded] = useState(true);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowDescription, setNewWorkflowDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [rooms, setRooms] = useState({ DM: [], RR: [], GM: [] });
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [workflows, setWorkflows] = useState([]);
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const response = await fetch("/api/messages/rooms");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.rooms) {
        setRooms(data.rooms);
      } else {
        setRooms({ DM: [], RR: [], GM: [] });
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms({ DM: [], RR: [], GM: [] });
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const fetchWorkflows = async () => {
    try {
      setIsLoadingWorkflows(true);
      const response = await fetch("/api/workflows/get_workflows");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.workflows) {
        setWorkflows(data.workflows);
      } else {
        setWorkflows([]);
      }
    } catch (error) {
      console.error("Error fetching workflows:", error);
      setWorkflows([]);
    } finally {
      setIsLoadingWorkflows(false);
    }
  };

  const handleCreateRoom = async () => {
    if (newRoomName.trim() === "") {
      showToast({
        title: "Error",
        description: "Room name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/messages/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRoomName,
          description: newRoomDescription || null,
          roomType: "RR",
          participants: [],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onCreateRoom(data.room);
        setNewRoomName("");
        setNewRoomDescription("");
        setIsCreatingRoom(false);
        await fetchRooms();

        showToast({
          title: "Success",
          description: `Your new room "${newRoomName}" has been created successfully.`,
        });
      } else {
        throw new Error(data.message || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      showToast({
        title: "Error",
        description: error.message || "Failed to create room",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSendDirectMessage = (message, recipient) => {
    showToast({
      title: "Message Sent",
      description: `Message sent to ${recipient.name}: ${message}`,
    });
  };

  const filteredDirectMessages =
    rooms.DM?.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const filteredRooms =
    rooms.RR?.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkflow = async () => {
    if (newWorkflowName.trim() === "") {
      showToast({
        title: "Error",
        description: "Workflow name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/workflows/create_workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newWorkflowName,
          description: newWorkflowDescription || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onCreateWorkflow(data.workflow);
        setNewWorkflowName("");
        setNewWorkflowDescription("");
        setIsCreatingWorkflow(false);
        await fetchWorkflows();

        showToast({
          title: "Success",
          description: `Your new workflow "${newWorkflowName}" has been created successfully.`,
        });
      } else {
        throw new Error(data.message || "Failed to create workflow");
      }
    } catch (error) {
      console.error("Error creating workflow:", error);
      showToast({
        title: "Error",
        description: error.message || "Failed to create workflow",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0"
      )}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search messages..."
            className="w-full pl-9 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <ScrollArea
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 64px - 56px)" }}
      >
        <div className="px-4">
          <SidebarSection
            title="Direct Messages"
            icon={MessageCircle}
            items={filteredDirectMessages}
            expanded={dmsExpanded}
            setExpanded={setDmsExpanded}
            onSelect={onSelectDM}
            isLoading={isLoadingRooms}
            ItemIcon={({ item }) => (
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                {item.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">
                      {item.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            )}
            setItems={setRooms}
          />

          <SidebarSection
            title="Research Rooms"
            icon={Users}
            items={filteredRooms}
            expanded={researchRoomsExpanded}
            setExpanded={setResearchRoomsExpanded}
            onSelect={onSelectResearchRoom}
            isLoading={isLoadingRooms}
            setItems={setRooms}
          />

          <SidebarSection
            title="Workflows"
            icon={Edit}
            items={filteredWorkflows}
            expanded={workflowsExpanded}
            setExpanded={setWorkflowsExpanded}
            onSelect={onSelectWorkflow}
            setItems={setWorkflows}
          />
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto space-y-2">
        <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#6366F1] hover:bg-[#5457E5] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create New Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <Input
                placeholder="Room Description"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateRoom}
              className="w-full bg-[#6366F1] hover:bg-[#5457E5] text-white"
            >
              Create Room
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreatingWorkflow} onOpenChange={setIsCreatingWorkflow}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Workflow</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Workflow Name"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
              />
              <Input
                placeholder="Workflow Description"
                value={newWorkflowDescription}
                onChange={(e) => setNewWorkflowDescription(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateWorkflow}
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white"
            >
              Create Workflow
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

MessageSidebar.propTypes = {
  onSelectDM: PropTypes.func.isRequired,
  onSelectResearchRoom: PropTypes.func.isRequired,
  onSelectWorkflow: PropTypes.func.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onCreateWorkflow: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
};

function SidebarSection({
  title,
  icon: Icon,
  items,
  expanded,
  setExpanded,
  onSelect,
  onSendMessage,
  ItemIcon,
  isLoading,
  setItems,
}) {
  const [newName, setNewName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showPopup, setShowPopup] = useState(null);

  const handleEdit = (item) => {
    setNewName(item.name);
    setSelectedItemId(item.id);
    setShowEditModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItemId(item.id);
    setShowDeleteModal(true);
  };

  const confirmEdit = () => {
    if (newName.trim()) {
      setItems((prevItems) =>
        prevItems.map((i) => (i.id === selectedItemId ? { ...i, name: newName } : i))
      );
      setShowEditModal(false);
      setSelectedItemId(null);
    }
  };

  const confirmDelete = () => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== selectedItemId));
    setShowDeleteModal(false);
    setSelectedItemId(null);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-gray-900 hover:text-[#6366F1]"
      >
        <div className="flex items-center">
          <Icon className="h-4 w-4 mr-2" />
          <span>{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200",
            expanded ? "" : "-rotate-90"
          )}
        />
      </button>

      {expanded && (
        <div className="mt-1 space-y-1">
          {items.map((item) => (
            <div key={item.id} className="space-y-1 flex justify-between items-center">
              <button
                onClick={() => onSelect(item)}
                className="flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {ItemIcon ? (
                  <ItemIcon item={item} />
                ) : (
                  <Icon className="h-4 w-4 text-gray-500 mr-3" />
                )}
                <span className="ml-3 flex-1 truncate">{item.name}</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowPopup(showPopup === item.id ? null : item.id);
                    setSelectedItemId(item.id);
                  }}
                  className={`text-gray-500 hover:text-gray-900 ${
                    selectedItemId === item.id ? 'bg-indigo-100' : ''
                  } p-1 rounded`}
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {showPopup === item.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg">
                    <button
                      onClick={() => handleEdit(item)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="New Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <Button onClick={confirmEdit} className="w-full bg-[#6366F1] hover:bg-[#5457E5] text-white">
            Save
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this item?</p>
          </div>
          <Button onClick={confirmDelete} className="w-full bg-red-600 hover:bg-red-500 text-white">
            Delete
          </Button>
          <Button onClick={() => setShowDeleteModal(false)} className="w-full bg-gray-300 hover:bg-gray-200 text-black">
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

SidebarSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  items: PropTypes.array.isRequired,
  expanded: PropTypes.bool.isRequired,
  setExpanded: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func,
  ItemIcon: PropTypes.elementType,
  isLoading: PropTypes.bool.isRequired,
  setItems: PropTypes.func.isRequired,
};
