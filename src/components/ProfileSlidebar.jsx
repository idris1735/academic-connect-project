'use client'

import { useState } from 'react'
import { Pencil } from "lucide-react"

export default function ProfileSidebar() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Researcher',
    title: 'Computer Science PhD Student',
    views: 205,
    connections: 500
  })

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically send an API request to update the profile
  }

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  return (
    <aside className="md:col-span-1">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <div className="h-20 w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full bg-white border-4 border-white">
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-xl font-medium">
              {profile.name.charAt(0)}
            </div>
          </div>
        </div>
        <div className="pt-12 pb-6 px-4 text-center">
          {isEditing ? (
            <div className="space-y-2">
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
              <input
                name="title"
                value={profile.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-[#6366F1] text-white rounded-md hover:bg-[#5457E5]"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.title}</p>
              <button 
                onClick={handleEdit}
                className="mt-2 flex items-center gap-2 px-4 py-2 text-[#6366F1] hover:bg-gray-100 rounded-md mx-auto"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            </>
          )}
          <div className="mt-4 border-t pt-4">
            <p className="text-sm">
              <span className="font-bold">{profile.views}</span> profile views
            </p>
            <p className="text-sm mt-2">
              <span className="font-bold">{profile.connections}</span> connections
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}