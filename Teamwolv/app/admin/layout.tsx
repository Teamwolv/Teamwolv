"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SiteDataProvider } from "@/providers/site-data-provider"
import { Home, Settings, CalendarCheck2, ImageIcon, Info, User } from "lucide-react"

const items = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/site-settings", label: "Site Settings", icon: Settings },
  { href: "/admin/events", label: "Events", icon: CalendarCheck2 },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/about", label: "About Us", icon: Info },
  { href: "/admin/profile", label: "Profile", icon: User },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <SiteDataProvider>
      <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="border-r border-border/40 bg-muted/40">
          <div className="px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_24px] shadow-primary/50" />
              <span className="text-sm font-medium tracking-widest text-foreground/80">ADMIN</span>
            </div>
          </div>
          <nav className="px-2">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group my-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    active ? "bg-primary/15 text-foreground" : "hover:bg-muted/80 text-foreground/70",
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4", active ? "text-primary" : "text-foreground/60 group-hover:text-primary")}
                  />
                  <span className="rollup">
                    <span>{label}</span>
                    <span>{label}</span>
                  </span>
                </Link>
              )
            })}
          </nav>
        </aside>
        <main className="min-h-dvh">
          <div className="border-b border-border/40 bg-muted/20 px-6 py-4">
            <h1 className="text-lg font-medium">Dashboard</h1>
          </div>
          <div className="px-6 py-6">{children}</div>
        </main>
      </div>
    </SiteDataProvider>
  )
}
