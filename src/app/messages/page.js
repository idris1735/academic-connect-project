'use client'

import { useState } from 'react'
import NavComponent from '../../components/NavComponent'
import MessageSidebar from '../../components/MessageSidebar'
import MessageView from '../../components/MessageView'

export default function MessagesPage() {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null)
  const [selectedDM, setSelectedDM] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavComponent />
      <main className="h-[calc(100vh-4rem)]">
        <div className="mx-auto h-full max-w-7xl">
          <div className="grid h-full grid-cols-[280px_1fr] overflow-hidden rounded-lg bg-white shadow-md">
            <MessageSidebar 
              onSelectDiscussion={setSelectedDiscussion} 
              onSelectDM={setSelectedDM}
              selectedDiscussion={selectedDiscussion}
              selectedDM={selectedDM}
            />
            <div className="border-l">
              {(selectedDiscussion || selectedDM) ? (
                <MessageView conversation={selectedDiscussion || selectedDM} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Select a discussion or conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}