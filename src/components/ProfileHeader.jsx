import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GraduationCap, MapPin, MessageSquare, Users } from "lucide-react"

export default function ProfileHeader() {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 sm:h-48 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
      <div className="p-4 sm:p-6 -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white">
            <AvatarImage src="https://picsum.photos/seed/researcher/200" alt="Researcher" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="flex-1 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dr. Jane Smith</h1>
            <p className="text-lg sm:text-xl text-gray-600">Computer Science Researcher</p>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 gap-2 sm:gap-4">
              <span className="flex items-center">
                <GraduationCap className="w-4 h-4 mr-1" />
                Stanford University
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Stanford, CA
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button className="bg-[#6366F1] hover:bg-[#5457E5]">
              <Users className="w-4 h-4 mr-2" />
              Connect
            </Button>
            <Button variant="outline" className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}