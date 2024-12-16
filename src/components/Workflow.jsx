'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, User, Menu } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Workflow({ workflow, onToggleSidebar }) {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: [],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      taskIds: [],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: [],
    }
  })
  const [tasks, setTasks] = useState({})
  const [newTaskContent, setNewTaskContent] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (workflow?.tasks) {
      // Convert workflow tasks to our format
      const taskMap = {}
      const columnMap = {
        todo: { id: 'todo', title: 'To Do', taskIds: [] },
        inProgress: { id: 'inProgress', title: 'In Progress', taskIds: [] },
        done: { id: 'done', title: 'Done', taskIds: [] }
      }

      workflow.tasks.forEach(task => {
        taskMap[task.id] = {
          id: task.id,
          content: task.title,
          assignee: task.assignedTo ? {
            id: task.assignedTo,
            name: task.assignedToName,
            avatar: task.assignedToAvatar
          } : null
        }

        // Add task to appropriate column
        switch (task.status) {
          case 'To do':
            columnMap.todo.taskIds.push(task.id)
            break
          case 'In Progress':
            columnMap.inProgress.taskIds.push(task.id)
            break
          case 'Done':
            columnMap.done.taskIds.push(task.id)
            break
        }
      })

      setTasks(taskMap)
      setColumns(columnMap)
    }
  }, [workflow])

  const moveTask = async (taskId, sourceColumn, targetColumn) => {
    try {
      const response = await fetch(`/api/workflows/${workflow.id}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: targetColumn === 'todo' ? 'To do' : 
                 targetColumn === 'inProgress' ? 'In Progress' : 'Done'
        }),
      })

      if (response.ok) {
        const updatedColumns = { ...columns }
        updatedColumns[sourceColumn].taskIds = updatedColumns[sourceColumn].taskIds
          .filter(id => id !== taskId)
        updatedColumns[targetColumn].taskIds.push(taskId)
        setColumns(updatedColumns)
      } else {
        throw new Error('Failed to update task status')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to move task',
        variant: 'destructive',
      })
    }
  }

  const addNewTask = async () => {
    if (newTaskContent.trim() === '') return

    try {
      const response = await fetch(`/api/workflows/${workflow.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskContent,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const newTaskId = data.task.id
        const newTask = {
          id: newTaskId,
          content: newTaskContent,
          assignee: null
        }

        setTasks({ ...tasks, [newTaskId]: newTask })
        setColumns({
          ...columns,
          todo: { ...columns.todo, taskIds: [...columns.todo.taskIds, newTaskId] },
        })
        setNewTaskContent('')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add task',
        variant: 'destructive',
      })
    }
  }

  const assignTask = async (taskId, user) => {
    try {
      const response = await fetch(`/api/workflows/${workflow.id}/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedTo: user.id
        }),
      })

      if (response.ok) {
        setTasks({
          ...tasks,
          [taskId]: { ...tasks[taskId], assignee: user },
        })
        toast({
          title: 'Success',
          description: `Task assigned to ${user.name}`,
        })
      } else {
        throw new Error('Failed to assign task')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign task',
        variant: 'destructive',
      })
    }
    setSelectedTaskId(null)
  }

  const handleCreateWorkflow = async (name, description) => {
    try {
      const response = await fetch('/api/workflows/create_workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Workflow Created',
          description: `Your new workflow "${data.workflow.name}" has been created successfully.`,
        });
        // Optionally, refresh the workflow list or update state
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to create workflow.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while creating the workflow.',
        variant: 'destructive',
      });
    }
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
          <h2 className="text-2xl font-bold">{workflow?.name || 'Workflow'}</h2>
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="New task"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={addNewTask}>Add Task</Button>
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
                    <div key={taskId} className="bg-white p-3 mb-2 rounded shadow">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm">{task.content}</p>
                        <Dialog open={selectedTaskId === taskId} onOpenChange={(open) => setSelectedTaskId(open ? taskId : null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {task.assignee ? (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={task.assignee?.avatar} />
                                  <AvatarFallback>{task.assignee?.name?.[0] || '?'}</AvatarFallback>
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
                                {workflow?.participants?.map((user) => (
                                  <CommandItem
                                    key={user?.uid || 'default'}
                                    onSelect={() => assignTask(taskId, user)}
                                    className="flex items-center"
                                  >
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage src={user?.avatar} />
                                      <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
                                    </Avatar>
                                    {user?.name || 'Unknown User'}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="flex justify-end space-x-1">
                        {column.id !== 'todo' && (
                          <Button size="sm" variant="outline" onClick={() => moveTask(taskId, column.id, 'todo')}>
                            To Do
                          </Button>
                        )}
                        {column.id !== 'inProgress' && (
                          <Button size="sm" variant="outline" onClick={() => moveTask(taskId, column.id, 'inProgress')}>
                            In Progress
                          </Button>
                        )}
                        {column.id !== 'done' && (
                          <Button size="sm" variant="outline" onClick={() => moveTask(taskId, column.id, 'done')}>
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
  )
}
