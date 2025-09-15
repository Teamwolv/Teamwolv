"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CalendarDays, Info, Play } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/aftermovies", label: "Aftermovies", icon: Play },
  { href: "/about", label: "About Us", icon: Info },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-center py-4">
          <nav
            aria-label="Primary"
            className="mx-auto inline-flex items-center rounded-2xl border border-white/20 bg-black/20 backdrop-blur-sm px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
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
                        active ? "text-white bg-white/10" : "text-white/90 hover:text-white hover:bg-white/10",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform duration-200",
                          "group-hover:-translate-y-0.5",
                          active ? "text-white" : "text-white/80 group-hover:text-white",
                        )}
                        aria-hidden="true"
                      />
                      <span className={cn(active ? "text-white" : "text-white/80 group-hover:text-white")}>{label}</span>
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
