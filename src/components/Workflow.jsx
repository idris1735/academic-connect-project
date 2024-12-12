'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, User, Menu } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const initialColumns = {
  todo: {
    id: 'todo',
    title: 'To Do',
    taskIds: ['task-1', 'task-2', 'task-3'],
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: ['task-4', 'task-5'],
  },
  done: {
    id: 'done',
    title: 'Done',
    taskIds: ['task-6'],
  },
}

const initialTasks = {
  'task-1': { id: 'task-1', content: 'Literature review', assignee: null },
  'task-2': { id: 'task-2', content: 'Data collection', assignee: null },
  'task-3': { id: 'task-3', content: 'Methodology design', assignee: null },
  'task-4': { id: 'task-4', content: 'Data analysis', assignee: null },
  'task-5': { id: 'task-5', content: 'Write introduction', assignee: null },
  'task-6': { id: 'task-6', content: 'Define research question', assignee: null },
}

// Mock users data for task assignment
const allUsers = [
  { id: 1, name: 'Dr. Afolabi Akorede', avatar: 'https://picsum.photos/seed/afolabi/200' },
  { id: 2, name: 'Prof. Mohamed Aden Ighe', avatar: 'https://picsum.photos/seed/mohamed/200' },
  { id: 3, name: 'Dr. Naledi Dikgale', avatar: 'https://picsum.photos/seed/naledi/200' },
  { id: 4, name: 'Habeeb Efiamotu Musa', avatar: 'https://picsum.photos/seed/habeeb/200' },
  { id: 5, name: 'Dr. Marvin Nyalik', avatar: 'https://picsum.photos/seed/marvin/200' },
]

export default function Workflow({ workflow, onToggleSidebar }) {
  const [columns, setColumns] = useState(initialColumns)
  const [tasks, setTasks] = useState(initialTasks)
  const [newTaskContent, setNewTaskContent] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const { toast } = useToast()

  const moveTask = (taskId, sourceColumn, targetColumn) => {
    const updatedColumns = { ...columns }
    updatedColumns[sourceColumn].taskIds = updatedColumns[sourceColumn].taskIds.filter(id => id !== taskId)
    updatedColumns[targetColumn].taskIds.push(taskId)
    setColumns(updatedColumns)
  }

  const addNewTask = () => {
    if (newTaskContent.trim() === '') return

    const newTaskId = `task-${Object.keys(tasks).length + 1}`
    const newTask = { id: newTaskId, content: newTaskContent, assignee: null }

    setTasks({ ...tasks, [newTaskId]: newTask })
    setColumns({
      ...columns,
      todo: { ...columns.todo, taskIds: [...columns.todo.taskIds, newTaskId] },
    })

    setNewTaskContent('')
  }

  const assignTask = (taskId, user) => {
    setTasks({
      ...tasks,
      [taskId]: { ...tasks[taskId], assignee: user },
    })
    toast({
      title: 'Task Assigned',
      description: `Task assigned to ${user.name}`,
    })
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
                {column.taskIds.map((taskId) => (
                  <div key={taskId} className="bg-white p-3 mb-2 rounded shadow">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm">{tasks[taskId].content}</p>
                      <Dialog open={selectedTaskId === taskId} onOpenChange={(open) => setSelectedTaskId(open ? taskId : null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {tasks[taskId].assignee
                              ? (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={tasks[taskId].assignee.avatar} />
                                <AvatarFallback>{tasks[taskId].assignee.name[0]}</AvatarFallback>
                              </Avatar>
                                )
                              : (
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
                              {allUsers.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  onSelect={() => assignTask(taskId, user)}
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
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
