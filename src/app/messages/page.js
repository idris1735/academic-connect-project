'use client'

import { useState } from 'react'
import MessageSidebar from '@/components/MessageSidebar'
import MessageView from '@/components/MessageView'
import ResearchRoom from '@/components/ResearchRoom'
import Workflow from '@/components/Workflow'
import { useToast } from "@/components/ui/use-toast"

export default function MessagesPage() {
  const [activeView, setActiveView] = useState('messages')
  const [selectedItem, setSelectedItem] = useState(null)
  const [rooms, setRooms] = useState([
    { id: 1, name: 'AI in Healthcare', members: 5, type: 'research' },
    { id: 2, name: 'Climate Change Mitigation', members: 8, type: 'research' },
  ])
  const { toast } = useToast()

  const handleSelectItem = (item, type) => {
    setSelectedItem(item)
    setActiveView(type)
  }

  const handleCreateRoom = (name, description) => {
    const newRoom = {
      id: rooms.length + 1,
      name,
      description,
      members: 1,
      type: 'research'
    }
    setRooms([...rooms, newRoom])
    toast({
      title: "Room Created",
      description: `Your new room "${name}" has been created successfully.`,
    })
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/4 border-r border-gray-200">
        <MessageSidebar
          onSelectDiscussion={(discussion) => handleSelectItem(discussion, 'discussion')}
          onSelectDM={(dm) => handleSelectItem(dm, 'messages')}
          onSelectResearchRoom={(room) => handleSelectItem(room, 'research')}
          onSelectWorkflow={(workflow) => handleSelectItem(workflow, 'workflow')}
          onCreateRoom={handleCreateRoom}
          rooms={rooms}
        />
      </div>
      <div className="w-3/4">
        {activeView === 'messages' && <MessageView conversation={selectedItem} onCreateRoom={handleCreateRoom} />}
        {activeView === 'discussion' && <MessageView conversation={selectedItem} onCreateRoom={handleCreateRoom} />}
        {activeView === 'research' && <ResearchRoom room={selectedItem} />}
        {activeView === 'workflow' && <Workflow workflow={selectedItem} />}
      </div>
    </div>
  )
}




