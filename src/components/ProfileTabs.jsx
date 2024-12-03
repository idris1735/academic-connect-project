"use client"
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from './ui/button'

export function ProfileTabs({ data, isOrganization }) {
  const [activeTab, setActiveTab] = useState("overview")

  const tabItems = [
    { value: "overview", label: "Overview" },
    { value: "publications", label: "Publications" },
    { value: "peer-reviews", label: "Peer Reviews" },
    { value: "comments", label: "Comments" },
    { value: "grants", label: "Grants" },
    ...(isOrganization ? [{ value: "members", label: "Members" }] : [])
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="md:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tab" />
            </SelectTrigger>
            <SelectContent>
              {tabItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <TabsList className="hidden md:grid w-full" style={{ gridTemplateColumns: `repeat(${tabItems.length}, minmax(0, 1fr))` }}>
          {tabItems.map((item) => (
            <TabsTrigger 
              key={item.value} 
              value={item.value}
              className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#6366F1] text-white">
                        {data.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {data.name} <span className="text-[#6366F1] font-normal">{activity.type}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{activity.content}</p>
                      <p className="text-xs text-gray-400 mt-2">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {isOrganization && (
          <TabsContent value="members">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Organization Members</h3>
                <div className="grid gap-4">
                  {data.members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-[#6366F1] text-white">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-[#6366F1]">{member.role}</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {/* Other tab contents remain the same */}
      </Tabs>
    </div>
  )
}

