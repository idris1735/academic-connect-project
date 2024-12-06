import { CheckCircle, Instagram, Linkedin, Twitter, Globe, Building2, User, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function ProfileHeader({ data, isOrganization }) {
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="relative">
      <div className="h-48 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-24 text-center">
          <Avatar className="h-32 w-32 rounded-full ring-4 ring-white inline-flex">
            <AvatarFallback className="text-4xl font-semibold bg-[#6366F1] text-white">
              {data.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 flex items-center justify-center">
            {data.name}
            {data.verified && (
              <CheckCircle className="h-5 w-5 text-[#6366F1] fill-current ml-2" />
            )}
          </h1>
        </div>
        <div className="mt-6 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center text-gray-600 text-sm">
              <Building2 className="h-4 w-4 mr-1" />
              <span>{data.institution}</span>
            </div>
            {!isOrganization && data.department && (
              <div className="flex items-center justify-center text-gray-600 text-sm">
                <User className="h-4 w-4 mr-1" />
                <span>{data.department}</span>
              </div>
            )}
            <div className="flex items-center justify-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{data.location}</span>
            </div>
            <div className="flex items-center justify-center text-gray-600 text-sm">
              <User className="h-4 w-4 mr-1" />
              <span>Member for {data.memberSince}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <Button className="bg-[#6366F1] hover:bg-[#5355CC]">Connect</Button>
            <Button variant="outline" className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10">
              Message
            </Button>
          </div>
          <div className="mt-6 flex justify-center space-x-6">
            {Object.entries(data.socialLinks).map(([platform, url]) => {
              const Icon = { instagram: Instagram, linkedin: Linkedin, twitter: Twitter, website: Globe }[platform]
              return (
                <a key={platform} href={url} className="text-gray-500 hover:text-[#6366F1] transition-colors">
                  <span className="sr-only">{platform}</span>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}





