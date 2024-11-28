import { CheckCircle, Instagram, Linkedin, Twitter, Globe, Building2, User } from 'lucide-react'

export function ProfileHeader({ data }) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
      <div className="h-32 w-32 rounded-full bg-[#B666D2] flex items-center justify-center text-4xl text-white font-medium">
        m
      </div>
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
          {data.verified && (
            <CheckCircle className="h-5 w-5 text-blue-500 fill-current" />
          )}
        </div>
        <div className="text-gray-600">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>{data.department}, {data.institution}</span>
            </div>
            <button className="text-blue-500 text-sm hover:underline">Show less</button>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <User className="h-4 w-4" />
            <span>Member for {data.memberSince}</span>
          </div>
        </div>
        <div className="flex justify-center sm:justify-start gap-3">
          {data.socialLinks.instagram && (
            <a href={data.socialLinks.instagram} className="text-gray-400 hover:text-gray-600">
              <Instagram className="h-5 w-5" />
            </a>
          )}
          {data.socialLinks.linkedin && (
            <a href={data.socialLinks.linkedin} className="text-gray-400 hover:text-gray-600">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {data.socialLinks.twitter && (
            <a href={data.socialLinks.twitter} className="text-gray-400 hover:text-gray-600">
              <Twitter className="h-5 w-5" />
            </a>
          )}
          {data.socialLinks.website && (
            <a href={data.socialLinks.website} className="text-gray-400 hover:text-gray-600">
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}



