import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy, BookOpen, Quote, Hash } from 'lucide-react'

export function StatsSection({ data }) {
  if (!data) {
    return null
  }

  const stats = [
    { name: 'Upvotes', value: data.stats.upvotes, icon: Trophy },
    { name: 'Publications', value: data.stats.publications, icon: BookOpen },
    { name: 'Citations', value: data.stats.citations, icon: Quote },
    { name: 'h-index', value: data.stats.hIndex, icon: Hash },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.name} className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{item.name}</CardTitle>
              <item.icon className="h-4 w-4 text-[#6366F1]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-5 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Reputation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(data.reputation).map(([field, value]) => (
            <div key={field} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{field}</span>
                <span className="text-[#6366F1]">{Math.round(value * 100)}%</span>
              </div>
              <Progress
                value={value * 100}
                className="h-2 bg-gray-100"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
