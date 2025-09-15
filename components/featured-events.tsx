"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useMemo } from "react"
import { useSiteData } from "@/providers/site-data-provider"
import { EventCard3D } from "@/components/3d-event-card"
import { EventCardSkeleton } from "@/components/loading-skeleton"

export function FeaturedEventsSection() {
  const { events } = useSiteData()
  const ref = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("in-view")
      },
      { threshold: 0.2 },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  const featured = useMemo(() => events.filter((e) => e.featured), [events])

  return (
    <section className="relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>
      <div ref={ref} className="section-reveal mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold md:text-3xl">Featured Events</h2>
          <Link href="/events/featured" className="text-sm text-primary hover:underline">
            View featured
          </Link>
        </div>
        <div className="grid gap-12 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {!isClient ? (
            // Show loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-center">
                <EventCardSkeleton />
              </div>
            ))
          ) : featured.length > 0 ? (
            featured.map((ev) => (
              <div key={ev.id} className="flex justify-center">
                <EventCard3D event={ev} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No featured events available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
