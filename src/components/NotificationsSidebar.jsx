'use client'

import { Bell, MessageSquare, Users, Briefcase, Settings } from 'lucide-react'
import { useSelector } from 'react-redux'

export default function NotificationsSidebar({ activeFilter, setActiveFilter }) {
  const notifications = useSelector(state => state?.notifications?.items) || [];

  const filters = [
    {
      id: 'all',
      label: 'All Notifications',
      icon: Bell,
      count: notifications.filter(n => !n.read).length
    },
    {
      id: 'interactions',
      label: 'Interactions',
      icon: MessageSquare,
      count: notifications.filter(n => 
        !n.read && 
        (n.type === 'POST_LIKE' || n.type === 'POST_COMMENT')
      ).length
    },
    {
      id: 'connections',
      label: 'Connection Requests',
      icon: Users,
      count: notifications?.filter(n => 
        !n.read && 
        n.type === 'CONNECTION_REQUEST'
      ).length || 0
    },
    {
      id: 'projects',
      label: 'Research & Projects',
      icon: Briefcase,
      count: notifications?.filter(n => 
        !n.read && 
        (n.type === 'WORKFLOW_ASSIGNMENT' || n.type === 'RESEARCH_ROOM_INVITE')
      ).length || 0
    }
  ]

  return (
    <aside className="bg-white rounded-lg shadow-md p-4">
      <h2 className="font-semibold text-lg mb-4">Notifications</h2>
      <nav>
        <ul className="space-y-2">
          {filters.map((filter) => (
            <li key={filter.id}>
              <button
                onClick={() => setActiveFilter(filter.id)}
                className={`w-full flex items-center justify-between p-2 rounded-md ${
                  activeFilter === filter.id
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
