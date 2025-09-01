"use client"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-xs text-foreground/60">
        <div className="flex items-center justify-between">
          <p>© {new Date().getFullYear()} EventCo. All rights reserved.</p>
          <p className="hidden md:block">Premium black + blood red theme.</p>
        </div>
      </div>
    </footer>
  )
}
