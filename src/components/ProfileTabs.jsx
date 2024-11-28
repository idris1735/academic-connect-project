import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function ProfileTabs({ data }) {
  return (
    <Tabs defaultValue="overview" className="w-full mt-6">
      <TabsList className="border-b border-gray-200 rounded-none w-full justify-start h-auto p-0 overflow-x-auto bg-gray-50">
        <TabsTrigger
          value="overview"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-6 py-2"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="publications"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-6 py-2"
        >
          Publications ({data.stats.publications})
        </TabsTrigger>
        <TabsTrigger
          value="peer-reviews"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-6 py-2"
        >
          Peer Reviews
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-6 py-2"
        >
          Comments
        </TabsTrigger>
        <TabsTrigger
          value="grants"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-6 py-2"
        >
          Grants
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">RECENT ACTIVITY</h3>
          {data.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-[#B666D2] flex items-center justify-center text-white shrink-0">
                m
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 truncate">{data.name}</span>
                  <span className="text-gray-500">{activity.type}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">{activity.date}</span>
                </div>
                <div className="text-gray-600 truncate">{activity.content}</div>
              </div>
              <button className="ml-auto shrink-0 text-gray-400">•••</button>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}


