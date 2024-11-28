import Link from "next/link"
import { Home, Activity, Book, Award, Coins, Archive, Grid, FlaskRound, BookMarked } from 'lucide-react'
import { cn } from "@/lib/utils"

export function Sidebar({ className }) {
  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Activity, label: "Live", href: "/live" },
    { icon: Book, label: "RH Journal", href: "/journal", badge: "NEW" },
    { icon: Award, label: "Grants", href: "/grants" },
    { icon: Coins, label: "Funding", href: "/funding" },
    { icon: Archive, label: "Journals", href: "/journals" },
    { icon: Grid, label: "Hubs", href: "/hubs" },
    { icon: FlaskRound, label: "Lab Notebook", href: "/lab" },
    { icon: BookMarked, label: "Reference Manager", href: "/references", badge: "BETA" }
  ]

  return (
    <div className={cn("w-64 h-full border-r bg-background lg:block hidden", className)}>
      <div className="p-4 space-y-4">
        <Link
          href="/new"
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md"
        >
          <span>+ New</span>
        </Link>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-md"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

