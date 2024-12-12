'use client'

import { Bell, Briefcase, Users, Star, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotificationsSidebar({ activeFilter, setActiveFilter }) {
  const [counts, setCounts] = useState({
    all: 0,
    projects: 0,
    connections: 0,
    mentions: 0,
  })

  useEffect(() => {
    // // Calculate counts from dummy data
    // const categoryCounts = dummyNotifications.reduce((acc, notification) => {
    //   if (!notification.read) {
    //     acc.all += 1
    //     switch (notification.type) {
    //       case 'CONNECTION_REQUEST':
    //         acc.connections += 1
    //         break
    //       case 'MESSAGE':
    //         acc.mentions += 1
    //         break
    //       case 'PROJECT':
    //         acc.projects += 1
    //         break
    //     }
    //   }
    //   return acc
    // }, { all: 0, projects: 0, connections: 0, mentions: 0 })

    // setCounts(categoryCounts)

    // Real API implementation (commented out)
    const fetchNotificationCounts = async () => {
      try {
        const response = await fetch('/api/notifications/get_notifications')
        if (!response.ok) throw new Error('Failed to fetch notifications')
        const data = await response.json()
        const categoryCounts = data.notifications.reduce((acc, notification) => {
          if (!notification.read) {
            acc.all += 1
            switch (notification.type) {
              case 'CONNECTION_REQUEST':
                acc.connections += 1
                break
              case 'MESSAGE':
                acc.mentions += 1
                break
              case 'PROJECT':
                acc.projects += 1
                break
            }
          }
          return acc
        }, { all: 0, projects: 0, connections: 0, mentions: 0 })
        setCounts(categoryCounts)
      } catch (error) {
        console.error('Error fetching notification counts:', error)
      }
    }

    fetchNotificationCounts()
    const interval = setInterval(fetchNotificationCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const filters = [
    { icon: Bell, label: 'All', value: 'all', count: counts.all },
    { icon: Briefcase, label: 'My projects', value: 'projects', count: counts.projects },
    { icon: Users, label: 'Connections', value: 'connections', count: counts.connections },
    { icon: Star, label: 'Mentions', value: 'mentions', count: counts.mentions },
  ]

  return (
    <aside className="bg-white rounded-lg shadow-md p-4">
      <h2 className="font-semibold text-lg mb-4">Notifications</h2>
      <nav>
        <ul className="space-y-2">
          {filters.map((filter) => (
            <li key={filter.value}>
              <button
                onClick={() => setActiveFilter(filter.value)}
                className={`w-full flex items-center justify-between p-2 rounded-md ${
                  activeFilter === filter.value
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <filter.icon className="h-5 w-5" />
                  <span>{filter.label}</span>
                </div>
                {filter.count > 0 && (
                  <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">
                    {filter.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <Settings className="h-5 w-5" />
          <span>View settings</span>
        </button>
      </div>
    </aside>
  )
}
