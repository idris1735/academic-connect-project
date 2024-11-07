'use client'

import { useState } from 'react'
import { Bell, Home, MessageSquare, Search, Briefcase, Users2, Grid, Menu } from "lucide-react"
import Link from "next/link"

export default function NavComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality here
    console.log('Searching for:', searchQuery)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="#" className="text-2xl font-bold text-[#6366F1]">
              AcademicConnect
            </Link>
            <div className="hidden md:block">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    className="w-[300px] rounded-full border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    placeholder="Search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <NavLink href="#" icon={<Home className="h-6 w-6" />} text="Home" active />
            <NavLink href="#" icon={<Users2 className="h-6 w-6" />} text="Network" />
            <NavLink href="#" icon={<Briefcase className="h-6 w-6" />} text="Jobs" />
            <NavLink href="#" icon={<MessageSquare className="h-6 w-6" />} text="Messages" />
            <NavLink href="#" icon={<Bell className="h-6 w-6" />} text="Notifications" />
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
              AC
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Grid className="h-6 w-6" />
            </button>
          </nav>
          <button className="md:hidden p-2" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  className="w-full rounded-full border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  placeholder="Search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <NavLink href="#" icon={<Home className="h-6 w-6" />} text="Home" active />
            <NavLink href="#" icon={<Users2 className="h-6 w-6" />} text="Network" />
            <NavLink href="#" icon={<Briefcase className="h-6 w-6" />} text="Jobs" />
            <NavLink href="#" icon={<MessageSquare className="h-6 w-6" />} text="Messages" />
            <NavLink href="#" icon={<Bell className="h-6 w-6" />} text="Notifications" />
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, icon, text, active = false }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 p-2 rounded-lg ${
        active ? 'text-[#6366F1] font-medium' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </Link>
  )
}