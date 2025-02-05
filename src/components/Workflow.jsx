"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, User, Menu, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateTaskStatus } from "@/redux/features/workflowSlice";


export default function Workflow({
  workflow,
  onToggleSidebar,
  onAddTask,
  onAssignTask,
}) {
  const [columns, setColumns] = useState({
    todo: { id: "todo", title: "To Do", taskIds: [] },
    inProgress: { id: "inProgress", title: "In Progress", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  });
  const [tasks, setTasks] = useState({});
  const [newTaskContent, setNewTaskContent] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(null);
  const [editTaskContent, setEditTaskContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (workflow?.tasks) {
      const taskMap = {};
      const columnMap = {
        todo: { id: "todo", title: "To Do", taskIds: [] },
        inProgress: { id: "inProgress", title: "In Progress", taskIds: [] },
        done: { id: "done", title: "Done", taskIds: [] },
      };

      workflow.tasks.forEach((task) => {
        taskMap[task.id] = {
          id: task.id,
          content: task.name || task.title,
          assignee: task.assignedTo
            ? {
                id: task.assignedTo,
                name: task.assignedToName,
                avatar: task.assignedToAvatar,
              }
            : null,
        };

        let targetColumn = "todo";
        if (task.status === "In Progress") targetColumn = "inProgress";
        if (task.status === "Done") targetColumn = "done";

        columnMap[targetColumn].taskIds.push(task.id);
      });

      setTasks(taskMap);
      setColumns(columnMap);
    }
  }, [workflow]);

  const moveTask = async (taskId, sourceColumn, targetColumn) => {
    try {
      const updatedColumns = { ...columns };
      updatedColumns[sourceColumn].taskIds = updatedColumns[
        sourceColumn
      ].taskIds.filter((id) => id !== taskId);
      updatedColumns[targetColumn].taskIds.push(taskId);
      setColumns(updatedColumns);

      const newStatus =
        targetColumn === "inProgress"
          ? "In Progress"
          : targetColumn === "done"
          ? "Done"
          : "To do";

      const task = tasks[taskId];
      if (task) {
        await onAssignTask(workflow.id, taskId, {
          ...task,
          status: newStatus,
        });
      }

      toast({
        title: "Task Moved",
        description: `Task moved to ${targetColumn}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to move task",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log('Creating a new task')
      const newTask = {
        name: newTaskContent,
        status: "To do",
        assignedTo: null,
      };

      const newTaskId = await onAddTask(newTask, newTask.name, '', null, null, workflow.id);
      console.log(newTaskId)
      if (!newTaskId) {
        setIsSubmitting(false);
        return;
      }

      const newTaskObj = {
        id: newTaskId,
        content: newTaskContent,
        assignee: null,
      };

      const updatedTasks = {
        ...tasks,
        [newTaskId]: newTaskObj,
      };

      const updatedColumns = {
        ...columns,
        todo: {
          ...columns.todo,
          taskIds: Array.from(new Set([...columns.todo.taskIds, newTaskId])),
        },
      };

      setTasks(updatedTasks);
      setColumns(updatedColumns);
      setNewTaskContent("");

      toast({
        title: "Task Added",
        description: "New task has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = async (taskId) => {
    try {
      const task = tasks[taskId];
      if (!task) return;

      setIsEditingTask(taskId);
      setEditTaskContent(task.content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to edit task",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async (taskId) => {
    try {
      if (!editTaskContent.trim()) return;

      const updatedTasks = {
        ...tasks,
        [taskId]: {
          ...tasks[taskId],
          content: editTaskContent,
        },
      };

      setTasks(updatedTasks);
      setIsEditingTask(null);
      setEditTaskContent("");

      // Update task in backend
      await onAssignTask(taskId, {
        name: editTaskContent,
      });

      toast({
        title: "Task Updated",
        description: "Task has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Remove task from columns
      const updatedColumns = { ...columns };
      Object.keys(updatedColumns).forEach((columnId) => {
        updatedColumns[columnId].taskIds = updatedColumns[
          columnId
        ].taskIds.filter((id) => id !== taskId);
      });

      // Remove task from tasks
      const updatedTasks = { ...tasks };
      delete updatedTasks[taskId];

      setColumns(updatedColumns);
      setTasks(updatedTasks);

      toast({
        title: "Task Deleted",
        description: "Task has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleAssignTask = async (taskId, user) => {
    try {
      await onAssignTask(taskId, {
        assignedTo: user.id,
        assignedToName: user.name,
        assignedToAvatar: user.avatar,
      });

      setTasks((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          assignee: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          },
        },
      }));

      toast({
        title: "Task Assigned",
        description: `Task assigned to ${user.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign task",
        variant: "destructive",
      });
    }
    setSelectedTaskId(null);
  };

  return (
    <div className="p-4 bg-white h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">{workflow?.name || "Workflow"}</h2>
        </div>
        <div className="flex space-x-2">
          <form onSubmit={handleAddTask} className="flex space-x-2">
            <Input
              placeholder="New task"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              className="max-w-xs"
            />
            <Button type="submit" disabled={isSubmitting}>
              Add Task
            </Button>
          </form>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(columns).map((column) => (
          <Card key={column.id} className="bg-gray-50">
            <CardHeader>
              <CardTitle>{column.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-250px)]">
                {column.taskIds.map((taskId) => {
                  const task = tasks[taskId];
                  if (!task) return null;

                  return (
                    <div
                      key={taskId}
                      className="bg-white p-3 mb-2 rounded shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        {isEditingTask === taskId ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSaveEdit(taskId);
                            }}
                            className="flex-1 mr-2"
                          >
                            <Input
                              value={editTaskContent}
                              onChange={(e) =>
                                setEditTaskContent(e.target.value)
                              }
                              onBlur={() => handleSaveEdit(taskId)}
                              autoFocus
                            />
                          </form>
                        ) : (
                          <p className="text-sm flex-1">{task.content}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <Dialog
                            open={selectedTaskId === taskId}
                            onOpenChange={(open) =>
                              setSelectedTaskId(open ? taskId : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {task.assignee ? (
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={task.assignee?.avatar} />
                                    <AvatarFallback>
                                      {task.assignee?.name?.[0] || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <User className="h-4 w-4" />
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Task</DialogTitle>
                              </DialogHeader>
                              <Command>
                                <CommandInput placeholder="Search members..." />
                                <CommandEmpty>No members found.</CommandEmpty>
                                <CommandGroup>
                                  {workflow?.members?.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      onSelect={() =>
                                        handleAssignTask(taskId, user)
                                      }
                                      className="flex items-center"
                                    >
                                      <Avatar className="h-6 w-6 mr-2">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>
                                          {user.name[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      {user.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditTask(taskId)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteTask(taskId)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-1">
                        {column.id !== "todo" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveTask(taskId, column.id, "todo")}
                          >
                            To Do
                          </Button>
                        )}
                        {column.id !== "inProgress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              moveTask(taskId, column.id, "inProgress")
                            }
                          >
                            In Progress
                          </Button>
                        )}
                        {column.id !== "done" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveTask(taskId, column.id, "done")}
                          >
                            Done
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
