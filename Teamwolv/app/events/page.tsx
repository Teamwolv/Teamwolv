"use client"

import Link from "next/link"
import { SiteDataProvider, useSiteData } from "@/providers/site-data-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { EventCard3D } from "@/components/3d-event-card"

function EventsList() {
  const { data } = useSiteData()
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-end justify-between">
        <h1 className="text-3xl font-semibold">Events</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/events/featured" className="text-primary hover:underline">
            Featured
          </Link>
          <Link href="/admin/events" className="text-foreground/70 hover:text-foreground">
            Manage in Admin
          </Link>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {data.events.map((ev) => (
          <div key={ev.id} className="flex justify-center">
            <EventCard3D event={ev} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function EventsPage() {
  return (
    <SiteDataProvider>
      <SiteHeader />
      <main>
        <EventsList />
      </main>
      <SiteFooter />
    </SiteDataProvider>
  )
}
