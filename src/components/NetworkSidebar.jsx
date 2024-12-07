'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Microscope, Calendar, BookOpen, Hash, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function NetworkSidebar() {
  const [networkCounts, setNetworkCounts] = useState({
    connections: 0,
    groups: 0,
    conferences: 0,
    publications: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const response = await fetch('/api/network/get_connections?status=connected')
        if (!response.ok) {
          throw new Error('Failed to load network details, reload the page')
        }
        const data = await response.json()

        // Simulate an APi call for groups, conferences and publications
        setNetworkCounts({
          connections: data.connections.length,
          groups: 0,
          conferences: 0,
          publications: 0
        })
      } catch (error) {
        console.error('Error fetching network data:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNetworkData()
  }, [])

  if (loading) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
        <CardHeader className="border-b border-indigo-100">
          <CardTitle className="text-2xl font-bold text-indigo-900">Academic Network</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-2 text-sm text-indigo-600">Loading network...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
        <CardHeader className="border-b border-indigo-100">
          <CardTitle className="text-2xl font-bold text-indigo-900">Academic Network</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-8">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const navItems = [
    { Icon: Users, label: 'Connections', count: networkCounts.connections },
    { Icon: UserPlus, label: 'Discover Researchers' },
    { Icon: Microscope, label: 'Research Groups', count: networkCounts.groups },
    { Icon: Calendar, label: 'Conferences', count: networkCounts.conferences },
    { Icon: BookOpen, label: 'Publications', count: networkCounts.publications },
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
