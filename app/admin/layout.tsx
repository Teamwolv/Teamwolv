"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/providers/auth-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Image, Settings, Users, LogOut, Play } from "lucide-react"

const menuItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: Settings,
  },
  {
    href: "/admin/events",
    label: "Events",
    icon: Calendar,
  },
  {
    href: "/admin/aftermovies",
    label: "Aftermovies",
    icon: Play,
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: Image,
  },
  {
    href: "/admin/about",
    label: "About",
    icon: Settings,
  },
  {
    href: "/admin/site-settings",
    label: "Site Settings",
    icon: Settings,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { signOut } = useAuth()
  const pathname = usePathname()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 border-r border-border/40 bg-muted/20">
            <div className="p-6">
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="px-3">
              <ul className="space-y-1">
                {menuItems.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/70 hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            
            {/* Sign Out Button */}
            <div className="mt-auto p-3">
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
