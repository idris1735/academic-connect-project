'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, Bell, MessageSquare, User, Menu, X, Search } from 'lucide-react'
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { dummyNotifications } from '@/lib/dummyNotifications'
import { fetchWithErrorHandling } from '@/lib/api'

// Dummy data for testing
const dummyUsers = [
  {
    id: '1',
    name: 'Dr. Afolabi Akorede',
    title: 'Professor of Computer Science',
    avatar: 'https://picsum.photos/seed/afolabi/200'
  },
  {
    id: '2',
    name: 'Prof. Mohamed Aden',
    title: 'Research Lead, AI & Healthcare',
    avatar: 'https://picsum.photos/seed/mohamed/200'
  },
  {
    id: '3',
    name: 'Dr. Naledi Dikgale',
    title: 'Associate Professor, Data Science',
    avatar: 'https://picsum.photos/seed/naledi/200'
  },
  {
    id: '4',
    name: 'Habeeb Musa',
    title: 'PhD Candidate, Machine Learning',
    avatar: 'https://picsum.photos/seed/habeeb/200'
  },
  {
    id: '5',
    name: 'Dr. Marvin Nyalik',
    title: 'Senior Researcher, Robotics',
    avatar: 'https://picsum.photos/seed/marvin/200'
  }
]

// ... previous imports and dummy data remain the same ...
// ... previous imports remain the same ...

export default function NavComponent() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    // For testing with dummy data
    // const unreadNotifications = dummyNotifications.filter(n => !n.read).length
    // setUnreadCount(unreadNotifications)

    // Real API implementation (commented out)
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications/get_notifications')
        if (!response.ok) throw new Error('Failed to fetch notifications')
        const data = await response.json()
        const unreadCount = data.notifications.filter(n => !n.read).length
        setUnreadCount(unreadCount)
      } catch (error) {
        console.error('Error fetching unread count:', error)
        setUnreadCount(0) // Fallback to 0 on error
      }
    }
    
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Poll every 30 seconds
    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWithErrorHandling('/api/users/get_profiles')
        if (response) {
          setUsers(response.profiles)
          console.log(response.profiles)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        setUsers([])
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers([])
    }
  }, [searchQuery, users])

  // Add navItems definition
  const navItems = [
    { icon: Home, label: 'Home', href: '/feeds' },
    { icon: Users, label: 'Network', href: '/network' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { 
      icon: Bell, 
      label: 'Notifications', 
      href: '/notifications',
      count: unreadCount > 0 ? unreadCount : null 
    },
    { icon: User, label: 'Profile', href: '/profile/individual' },
  ]

  // // Filter users based on search query
  // const filteredUsers = dummyUsers.filter(user =>
  //   user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   user.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  // )

  // Handle user selection
  const handleSelectUser = (userId) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    router.push(`/profile/${userId}`)
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setIsSearchOpen(true)
  }


  // ... previous state declarations and navItems remain the same ...

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-600">AcademicConnect</span>
            </Link>
          </div>

          {/* Search Component - Now visible on all screens */}
          <div className="flex items-center flex-1 max-w-sm sm:max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search researchers..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-8 pr-4 border-gray-200 focus:ring-indigo-500"
              />
              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No researchers found
                    </div>
                  ) : (
                    <div className="max-h-[60vh] overflow-auto">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.pid}
                          onClick={() => handleSelectUser(user.pid)}
                          className="flex items-center space-x-3 p-2 hover:bg-indigo-50 cursor-pointer"
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={user.avatar} alt={user.displayName} />
                            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm truncate">{user.displayName}</span>
                            <span className="text-xs text-gray-500 truncate">{user.occupation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? 'text-indigo-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <item.icon className="h-6 w-6 mb-1" />
                  {item.count && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 text-base font-medium ${
                pathname === item.href
                  ? 'text-indigo-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className="h-6 w-6 mr-3" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}