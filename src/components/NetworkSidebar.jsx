import { Users, UserPlus, UsersRectangle, Calendar, Newspaper, Hash } from 'lucide-react'

export default function NetworkSidebar() {
  const navItems = [
    { Icon: Users, label: 'Connections', count: 1274 },
    { Icon: UserPlus, label: 'Following & Followers' },
    { Icon: UsersRectangle, label: 'Groups', count: 5 },
    { Icon: Calendar, label: 'Events', count: 1 },
    { Icon: Newspaper, label: 'Pages', count: 89 },
    { Icon: Newspaper, label: 'Newsletters', count: 8 },
    { Icon: Hash, label: 'Hashtags' },
  ]

  return (
    <aside className="bg-white rounded-lg shadow-md p-4">
      <h2 className="font-semibold text-lg mb-4">Manage my network</h2>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="flex items-center justify-between text-gray-700 hover:bg-gray-100 rounded-md p-2"
              >
                <div className="flex items-center gap-3">
                  {/* <item.Icon className="h-5 w-5" /> */}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && <span className="text-gray-500">{item.count}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}