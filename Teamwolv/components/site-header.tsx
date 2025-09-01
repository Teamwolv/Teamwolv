"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CalendarDays, ImageIcon, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/about", label: "About Us", icon: Info },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="mx-auto max-w-6xl px-4">
        {/* Center the pill nav */}
        <div className="flex items-center justify-center py-4">
          <nav
            aria-label="Primary"
            className="mx-auto inline-flex items-center rounded-2xl border border-border/40 bg-muted/60 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            <ul className="flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "group inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium tracking-normal transition-colors",
                        active ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform duration-200",
                          "group-hover:-translate-y-0.5",
                          active ? "text-foreground" : "text-foreground/80 group-hover:text-primary",
                        )}
                        aria-hidden="true"
                      />
                      <span className={cn(active ? "text-foreground" : "text-foreground/80 group-hover:text-primary")}>
                        {label}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
