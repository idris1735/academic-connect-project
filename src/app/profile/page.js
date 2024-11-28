'use client'

import { useState } from 'react'
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/ProfileSidebar"
import { ProfileHeader } from "@/components/ProfileHeader"
import { StatsSection } from "@/components/StatsSection"
import { ProfileTabs } from "@/components/ProfileTabs"
import { profileData } from "@/data/profile-data"

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuToggle={toggleSidebar} />
      <div className="flex-1 flex">
        <Sidebar className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block fixed inset-y-0 left-0 z-50 w-64 lg:sticky lg:top-14 lg:z-0`} />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-4xl">
            <ProfileHeader data={profileData} />
            <StatsSection data={profileData} />
            <ProfileTabs data={profileData} />
          </div>
        </main>
      </div>
    </div>
  )
}

