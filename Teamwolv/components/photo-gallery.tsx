"use client"

import { useEffect, useRef } from "react"
import { useSiteData } from "@/providers/site-data-provider"

export function PhotoGallerySection() {
  const { data } = useSiteData()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("in-view")
      },
      { threshold: 0.15 },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  return (
    <section className="relative">
      <div ref={ref} className="section-reveal mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="mb-8 text-2xl font-semibold md:text-3xl">Photo Gallery</h2>
        <div className="columns-1 gap-4 md:columns-3">
          {data.gallery.map((ph) => (
            <figure
              key={ph.id}
              className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border/40 bg-muted/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ph.url || "/placeholder.svg?height=700&width=700&query=gallery image"}
                alt={ph.alt || "Gallery image"}
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {ph.alt ? <figcaption className="p-2 text-xs text-foreground/60">{ph.alt}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
