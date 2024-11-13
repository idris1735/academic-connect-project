import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Microscope, Calendar, BookOpen, Hash } from 'lucide-react'

export function NetworkSidebar() {
  const navItems = [
    { Icon: Users, label: 'Connections', count: 1274 },
    { Icon: UserPlus, label: 'Discover Researchers' },
    { Icon: Microscope, label: 'Research Groups', count: 5 },
    { Icon: Calendar, label: 'Conferences', count: 3 },
    { Icon: BookOpen, label: 'Publications', count: 89 },
    { Icon: Hash, label: 'Research Topics' },
  ]

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="border-b border-indigo-100">
        <CardTitle className="text-2xl font-bold text-indigo-900">Academic Network</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <nav>
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="flex items-center justify-between text-indigo-900 hover:bg-indigo-100 rounded-md p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.Icon className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-sm font-bold bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  )
}