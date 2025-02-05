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
  Check,
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
import { Badge } from "@/components/ui/badge";


export default function MessageSidebar({
  onSelectDM,
  onSelectResearchRoom,
  onSelectWorkflow,
  onCreateRoom,
  onCreateWorkflow,
  rooms,
  workflows,
  isSidebarOpen,
  onToggleSidebar,
}) {
  const [dmsExpanded, setDmsExpanded] = useState(true);
  const [researchRoomsExpanded, setResearchRoomsExpanded] = useState(true);
  const [workflowsExpanded, setWorkflowsExpanded] = useState(true);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [filteredWorkflows, setFilteredWorkflows] = useState(workflows);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const filtered = {
      directMessages: rooms.directMessages.filter((dm) =>
        dm.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      researchRooms: rooms.researchRooms.filter((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    };
    setFilteredRooms(filtered);

    const filteredWf = workflows.filter((workflow) =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWorkflows(filteredWf);
    console.log('here filetefworkflows', filteredWorkflows);
  }, [searchQuery, rooms, workflows]);

  const handleCreateRoom = () => {
    if (newRoomName.trim() === "") {
      toast({
        title: "Error",
        description: "Room name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    onCreateRoom(newRoomName, newRoomDescription);
    setNewRoomName("");
    setNewRoomDescription("");
    setIsCreateRoomOpen(false);
  };

  const handleCreateWorkflow = async () => {

    if (newWorkflowName.trim() === "") {
          toast({
            title: "Error",
            description: "Workflow name cannot be empty.",
            variant: "destructive",
          });
          return;
        }
   
      onCreateWorkflow(newWorkflowName);
      setNewWorkflowName("");
      setIsCreateWorkflowOpen(false);
  };


  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0"
      )}
    >
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
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

      <div className="flex-shrink-0 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search messages..."
            className="w-full pl-9 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-6">
          <SidebarSection
            title="Direct Messages"
            icon={MessageCircle}
            items={filteredRooms.directMessages}
            expanded={dmsExpanded}
            setExpanded={setDmsExpanded}
            onSelect={onSelectDM}
          />

          <SidebarSection
            title="Research Rooms"
            icon={Users}
            items={filteredRooms.researchRooms}
            expanded={researchRoomsExpanded}
            setExpanded={setResearchRoomsExpanded}
            onSelect={onSelectResearchRoom}
          />

          <SidebarSection
            title="Workflows"
            icon={Edit}
            items={filteredWorkflows}
            expanded={workflowsExpanded}
            setExpanded={setWorkflowsExpanded}
            onSelect={onSelectWorkflow}
          />
        </div>
      </ScrollArea>

      <div className="flex-shrink-0 p-4 border-t mt-auto space-y-2">
        <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
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

        <Dialog
          open={isCreateWorkflowOpen}
          onOpenChange={setIsCreateWorkflowOpen}
        >
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateWorkflow();
              }}
            >
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Workflow Name"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white"
              >
                Create Workflow
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  icon: Icon,
  items,
  expanded,
  setExpanded,
  onSelect,
}) {
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
          {items?.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.name}</span>
                  {item.lastMessage && (
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">
                      {item.lastMessage}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.unreadCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500 text-white"
                  >
                    {item.unreadCount}
                  </Badge>
                )}
                {item.status === "sent" && (
                  <Check className="h-4 w-4 text-gray-400" />
                )}
                {item.status === "delivered" && (
                  <div className="flex">
                    <Check className="h-4 w-4 text-gray-400" />
                    <Check className="h-4 w-4 -ml-2 text-gray-400" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
