'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import MessageSidebar from '@/components/MessageSidebar'
import MessageView from '@/components/MessageView'
import ResearchRoom from '@/components/ResearchRoom'
import Workflow from '@/components/Workflow'
import { useToast } from '@/components/ui/use-toast'
import NavComponent from '@/components/NavComponent'
import { cn } from '@/lib/utils'

function MessagesContent() {
  const [activeView, setActiveView] = useState('messages')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: 'AI in Healthcare',
      members: [
        {
          id: 1,
          name: 'Alice',
          avatar: 'https://picsum.photos/seed/alice/200',
        },
        { id: 2, name: 'Bob', avatar: 'https://picsum.photos/seed/bob/200' },
      ],
      type: 'research',
    },
    {
      id: 2,
      name: 'Climate Change Mitigation',
      members: [
        {
          id: 1,
          name: 'Charlie',
          avatar: 'https://picsum.photos/seed/charlie/200',
        },
        { id: 2, name: 'Dana', avatar: 'https://picsum.photos/seed/dana/200' },
      ],
      type: 'research',
    },
  ])

  const { toast } = useToast()

  const handleSelectItem = (item, type) => {
    setSelectedItem(item)
    setActiveView(type)
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  const handleCreateRoom = (name, description) => {
    const newRoom = {
      id: rooms.length + 1,
      name,
      description,
      members: [],
      type: 'research',
    }
    setRooms([...rooms, newRoom])
    toast({
      title: 'Room Created',
      description: `Your new room "${name}" has been created successfully.`,
    })
  }

  const handleCreateWorkflow = (name, description) => {
    // In a real application, you would add the workflow to your state or database
    toast({
      title: 'Workflow Created',
      description: `Your new workflow "${name}" has been created successfully.`,
    })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      <NavComponent />
      <main className='container mx-auto px-4 '>
        <div className='flex flex-1 overflow-hidden'>
          <MessageSidebar
            onSelectDM={(dm) => handleSelectItem(dm, 'messages')}
            onSelectResearchRoom={(room) => handleSelectItem(room, 'research')}
            onSelectWorkflow={(workflow) =>
              handleSelectItem(workflow, 'workflow')
            }
            onCreateRoom={handleCreateRoom}
            onCreateWorkflow={handleCreateWorkflow}
            rooms={rooms}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
          <div className='flex-1 w-full md:w-auto'>
            <div className='h-full overflow-y-auto bg-white'>
              {!selectedItem ? (
                <div className='flex items-center justify-center h-full text-gray-500'>
                  Select a conversation to start messaging
                </div>
              ) : (
                <>
                  {activeView === 'messages' && (
                    <MessageView
                      conversation={selectedItem}
                      onToggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  )}
                  {activeView === 'research' && (
                    <ResearchRoom
                      room={selectedItem}
                      onToggleSidebar={toggleSidebar}
                    />
                  )}
                  {activeView === 'workflow' && (
                    <Workflow
                      workflow={selectedItem}
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
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesContent />
    </Suspense>
  )
}
