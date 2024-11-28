import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function StatsSection({ data }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
      <Card>
        <CardHeader>
          <CardTitle>ACHIEVEMENTS</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <div className="text-gray-500 text-center">
            This user has not unlocked any achievements yet.
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>KEY STATS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-600">
          <div>Upvotes received: {data.stats.upvotes}</div>
          <div>Publications: {data.stats.publications}</div>
          <div>Cited by: {data.stats.citations}</div>
          <div>h-index: {data.stats.hIndex} / i10-index: {data.stats.i10Index}</div>
        </CardContent>
      </Card>
      
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>REPUTATION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(data.reputation).map(([field, value]) => (
            <div key={field} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{field}</span>
                <span className="text-gray-600">&lt; {Math.round(value * 100)}%</span>
              </div>
              <Progress value={value * 100} />
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <button className="text-blue-500 hover:underline">Show more</button>
            <button className="text-blue-500 hover:underline">How is this calculated?</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



