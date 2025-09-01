"use client"

import { SiteDataProvider, useSiteData } from "@/providers/site-data-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

function GalleryGrid() {
  const { data } = useSiteData()
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-semibold">Gallery</h1>
      <div className="columns-1 gap-4 md:columns-3">
        {data.gallery.map((ph) => (
          <figure
            key={ph.id}
            className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border/40 bg-muted/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ph.url || "/placeholder.svg?height=700&width=700&query=gallery"}
              alt={ph.alt || "Gallery image"}
              className="w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {ph.alt ? <figcaption className="p-2 text-xs text-foreground/60">{ph.alt}</figcaption> : null}
          </figure>
        ))}
      </div>
    </div>
  )
}

export default function GalleryPage() {
  return (
    <SiteDataProvider>
      <SiteHeader />
      <main>
        <GalleryGrid />
      </main>
      <SiteFooter />
    </SiteDataProvider>
  )
}
