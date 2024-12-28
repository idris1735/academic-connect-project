'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, User, Menu } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Workflow({ workflow, onToggleSidebar, onAddTask, onAssignTask }) {
  const [columns, setColumns] = useState({
    todo: { id: 'todo', title: 'To Do', taskIds: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', taskIds: [] },
    done: { id: 'done', title: 'Done', taskIds: [] }
  })
  const [tasks, setTasks] = useState({})
  const [newTaskContent, setNewTaskContent] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (workflow?.tasks) {
      const taskMap = {}
      const columnMap = {
        todo: { id: 'todo', title: 'To Do', taskIds: [] },
        inProgress: { id: 'inProgress', title: 'In Progress', taskIds: [] },
        done: { id: 'done', title: 'Done', taskIds: [] }
      }

      workflow.tasks.forEach(task => {
        taskMap[task.id] = {
          id: task.id,
          content: task.name,
          assignee: task.assignedTo ? {
            id: task.assignedTo,
            name: task.assignedToName,
            avatar: task.assignedToAvatar
          } : null
        }

        let targetColumn = 'todo'
        if (task.status === 'In Progress') targetColumn = 'inProgress'
        if (task.status === 'Done') targetColumn = 'done'
        
        columnMap[targetColumn].taskIds.push(task.id)
      })

      setTasks(taskMap)
      setColumns(columnMap)
    }
  }, [workflow])

  const moveTask = async (taskId, sourceColumn, targetColumn) => {
    try {
      const updatedColumns = { ...columns }
      updatedColumns[sourceColumn].taskIds = updatedColumns[sourceColumn].taskIds
        .filter(id => id !== taskId)
      updatedColumns[targetColumn].taskIds.push(taskId)
      setColumns(updatedColumns)

      const newStatus = targetColumn === 'inProgress' ? 'In Progress' : 
                       targetColumn === 'done' ? 'Done' : 'To do'

      const task = tasks[taskId]
      if (task) {
        await onAssignTask(taskId, {
          ...task,
          status: newStatus
        })
      }

      toast({
        title: "Task Moved",
        description: `Task moved to ${targetColumn}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to move task",
        variant: "destructive",
      })
    }
  }

  const handleAddTask = async () => {
    if (!newTaskContent.trim()) return

    try {
      const newTask = {
        name: newTaskContent,
        status: 'To do',
        assignedTo: null
      }

      const newTaskId = await onAddTask(newTask)

      const newTaskObj = {
        id: newTaskId,
        content: newTaskContent,
        assignee: null
      }

      setTasks(prev => ({
        ...prev,
        [newTaskId]: newTaskObj
      }))

      setColumns(prev => ({
        ...prev,
        todo: {
          ...prev.todo,
          taskIds: [...prev.todo.taskIds, newTaskId]
        }
      }))

      setNewTaskContent('')

      toast({
        title: "Task Added",
        description: "New task has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add task",
        variant: "destructive",
      })
    }
  }

  const handleAssignTask = async (taskId, user) => {
    try {
      await onAssignTask(taskId, {
        assignedTo: user.id,
        assignedToName: user.name,
        assignedToAvatar: user.avatar
      })

      setTasks(prev => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          assignee: {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          }
        }
      }))

      toast({
        title: "Task Assigned",
        description: `Task assigned to ${user.name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign task",
        variant: "destructive",
      })
    }
    setSelectedTaskId(null)
  }

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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleAddTask()
              }
            }}
          />
          <Button onClick={handleAddTask}>Add Task</Button>
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
                  const task = tasks[taskId]
                  if (!task) return null

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
                                {workflow?.members?.map((user) => (
                                  <CommandItem
                                    key={user.id}
                                    onSelect={() => handleAssignTask(taskId, user)}
                                    className="flex items-center"
                                  >
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage src={user.avatar} />
                                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    {user.name}
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
                  )
                })}
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}



