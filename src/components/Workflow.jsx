'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, ArrowRight } from 'lucide-react'

export default function Workflow({ workflow }) {
  const [activeTab, setActiveTab] = useState('tasks')
  const [newTask, setNewTask] = useState('')

  const handleAddTask = (e) => {
    e.preventDefault()
    // Implement add task logic here
    console.log('Adding task:', newTask)
    setNewTask('')
  }

  if (!workflow) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Select a workflow to view</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">{workflow.name}</h2>
        <p className="text-sm text-gray-500">Status: {workflow.status}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="justify-start p-2 bg-gray-100">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="task1" />
                <Label htmlFor="task1">Review literature</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="task2" />
                <Label htmlFor="task2">Draft introduction</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="task3" />
                <Label htmlFor="task3">Conduct experiments</Label>
              </div>
            </div>
          </ScrollArea>

          <form onSubmit={handleAddTask} className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-grow"
              />
              <Button type="submit" className="bg-[#6366F1] hover:bg-[#5457E5] text-white">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add task</span>
              </Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="timeline" className="flex-grow p-4">
          <h3 className="text-lg font-semibold mb-4">Workflow Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <span>Literature Review</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <span>Experiment Design</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <span>Data Collection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <span>Analysis and Interpretation</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="collaborators" className="flex-grow p-4">
          <h3 className="text-lg font-semibold mb-4">Workflow Collaborators</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span>Dr. Jane Smith - Principal Investigator</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Prof. John Doe - Co-Investigator</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Dr. Emily Johnson - Research Assistant</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


