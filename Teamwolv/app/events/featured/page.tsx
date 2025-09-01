"use client"

import { SiteDataProvider, useSiteData } from "@/providers/site-data-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { EventCard3D } from "@/components/3d-event-card"

function FeaturedOnly() {
  const { data } = useSiteData()
  const featured = data.events.filter((e) => e.featured)
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-semibold">Featured Events</h1>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {featured.map((ev) => (
          <div key={ev.id} className="flex justify-center">
            <EventCard3D event={ev} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FeaturedEventsPage() {
  return (
    <SiteDataProvider>
      <SiteHeader />
      <main>
        <FeaturedOnly />
      </main>
      <SiteFooter />
    </SiteDataProvider>
  )
}
