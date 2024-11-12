import { Bell, Briefcase, Users, Star, Settings } from 'lucide-react'

export default function NotificationsSidebar({ activeFilter, setActiveFilter }) {
  const filters = [
    { icon: Bell, label: 'All', value: 'all' },
    { icon: Briefcase, label: 'My Jobs', value: 'jobs' },
    { icon: Users, label: 'Connections', value: 'connections' },
    { icon: Star, label: 'Mentions', value: 'mentions' },
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
                className={`w-full flex items-center gap-3 p-2 rounded-md ${
                  activeFilter === filter.value
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <filter.icon className="h-5 w-5" />
                <span>{filter.label}</span>
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