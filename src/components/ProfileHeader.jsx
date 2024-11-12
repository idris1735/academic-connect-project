import Image from 'next/image'
import { MapPin, Briefcase, School } from 'lucide-react'

export default function ProfileHeader() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <div className="p-6 sm:p-8 -mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
          <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden">
            <img
              src="https://picsum.photos/seed/user123/400"
            alt="Profile picture"
              width={144}
              height={144}
            />
          </div>
          <div className="mt-4 sm:mt-0 flex-1">
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-xl text-gray-600">Full Stack Developer | AI Enthusiast</p>
            <div className="mt-2 flex flex-wrap items-center text-sm text-gray-600 gap-y-1">
              <span className="flex items-center mr-4">
                <MapPin className="h-4 w-4 mr-1" /> San Francisco Bay Area
              </span>
              <span className="flex items-center mr-4">
                <Briefcase className="h-4 w-4 mr-1" /> TechCorp Inc.
              </span>
              <span className="flex items-center">
                <School className="h-4 w-4 mr-1" /> Stanford University
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            Connect
          </button>
          <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors">
            Message
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            More
          </button>
        </div>
      </div>
    </div>
  )
}