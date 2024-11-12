'use client'

import { useState } from 'react'
import NavComponent from '../../components/NavComponent'
import NotificationsSidebar from '../../components/NotificationsSidebar'
import NotificationsFeed from '../../components/NotificationsFeed'

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  return (
    <div className="min-h-screen bg-gray-100">
      <NavComponent />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <NotificationsSidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          <div className="md:col-span-3">
            <NotificationsFeed activeFilter={activeFilter} />
          </div>
        </div>
      </main>
    </div>
  )
}