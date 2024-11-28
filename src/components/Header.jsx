import Link from "next/link"
import { Search, Menu, Bell } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header({ onMenuToggle }) {
  return (
    <header className="flex h-14 items-center px-4 border-b border-gray-200 bg-white">
      <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={onMenuToggle}>
        <Menu className="h-5 w-5" />
      </Button>
      <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
        <span className="text-teal-500 text-xl">⚗️</span> ResearchHub
      </Link>
      <div className="flex items-center ml-4 flex-1 gap-4">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-gray-600">
          ← Author
        </Button>
        <div className="flex-1 relative max-w-xl">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 border-gray-200 focus:border-gray-300 focus:ring-0"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-gray-600">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" className="hidden sm:inline-flex text-gray-600">
          0 RSC
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-teal-500 text-white">
          A
        </Button>
      </div>
    </header>
  )
}


