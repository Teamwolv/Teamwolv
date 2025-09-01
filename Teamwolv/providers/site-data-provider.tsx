"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type EventItem = {
  id: string
  title: string
  date: string
  location: string
  description: string
  imageUrl: string
  featured?: boolean
}

export type GalleryPhoto = {
  id: string
  url: string
  alt?: string
}

export type SiteSettings = {
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  ctaHref: string
}

export type AboutContent = {
  heading: string
  content: string
}

type SiteData = {
  settings: SiteSettings
  events: EventItem[]
  gallery: GalleryPhoto[]
  about: AboutContent
}

type SiteDataContextType = {
  data: SiteData
  updateSettings: (partial: Partial<SiteSettings>) => void
  addEvent: (e: Omit<EventItem, "id">) => void
  updateEvent: (id: string, partial: Partial<EventItem>) => void
  deleteEvent: (id: string) => void
  addPhoto: (p: Omit<GalleryPhoto, "id">) => void
  updatePhoto: (id: string, partial: Partial<GalleryPhoto>) => void
  deletePhoto: (id: string) => void
  updateAbout: (partial: Partial<AboutContent>) => void
}

const DEFAULTS: SiteData = {
  settings: {
    heroTitle: "Crafting Unforgettable Events",
    heroSubtitle: "Premium planning, production, and experiences — elevated in black and blood red.",
    ctaText: "Explore Events",
    ctaHref: "/events",
  },
  events: [
    {
      id: "e1",
      title: "Midnight Gala 2025",
      date: "2025-10-31",
      location: "Noir Hall, NYC",
      description: "An immersive black-tie experience with live performances and curated gastronomy.",
      imageUrl: "/elegant-midnight-gala-with-crimson-lighting.png",
      featured: true,
    },
    {
      id: "e2",
      title: "Crimson Sound Festival",
      date: "2025-06-21",
      location: "Shoreline Arena",
      description: "A high-energy music festival with bespoke stages and interactive art.",
      imageUrl: "/crimson-themed-outdoor-music-festival-night-crowd.png",
      featured: true,
    },
    {
      id: "e3",
      title: "Executive Summit",
      date: "2025-11-12",
      location: "Glass Tower, SF",
      description: "C-suite sessions, precision hospitality, and flawless production.",
      imageUrl: "/premium-corporate-summit-with-black-stage-lighting.png",
      featured: false,
    },
  ],
  gallery: [
    {
      id: "g1",
      url: "/red-light-stage-with-dramatic-black-shadows.png",
      alt: "Red light stage",
    },
    {
      id: "g2",
      url: "/black-tie-gala-dinner-with-crimson-accents.png",
      alt: "Gala dinner",
    },
    {
      id: "g3",
      url: "/concert-crowd-under-red-spotlights.png",
      alt: "Concert crowd",
    },
    {
      id: "g4",
      url: "/premium-corporate-event-stage-in-black-and-red.png",
      alt: "Corporate event",
    },
    {
      id: "g5",
      url: "/crimson-stage-with-smoke-and-beams.png",
      alt: "Crimson stage",
    },
  ],
  about: {
    heading: "We design moments that matter.",
    content:
      "From intimate launches to arena-scale spectacles, our team crafts premium, end-to-end event experiences. Strategy, design, production, and hospitality — delivered flawlessly.",
  },
}

const KEY = "eventco-cms"

const SiteDataContext = createContext<SiteDataContextType | null>(null)

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>(DEFAULTS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setData(JSON.parse(raw))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {}
  }, [data, hydrated])

  const api = useMemo<SiteDataContextType>(
    () => ({
      data,
      updateSettings: (partial) => setData((d) => ({ ...d, settings: { ...d.settings, ...partial } })),
      addEvent: (e) => setData((d) => ({ ...d, events: [{ id: crypto.randomUUID(), ...e }, ...d.events] })),
      updateEvent: (id, partial) =>
        setData((d) => ({
          ...d,
          events: d.events.map((ev) => (ev.id === id ? { ...ev, ...partial } : ev)),
        })),
      deleteEvent: (id) => setData((d) => ({ ...d, events: d.events.filter((ev) => ev.id !== id) })),
      addPhoto: (p) => setData((d) => ({ ...d, gallery: [{ id: crypto.randomUUID(), ...p }, ...d.gallery] })),
      updatePhoto: (id, partial) =>
        setData((d) => ({
          ...d,
          gallery: d.gallery.map((ph) => (ph.id === id ? { ...ph, ...partial } : ph)),
        })),
      deletePhoto: (id) => setData((d) => ({ ...d, gallery: d.gallery.filter((ph) => ph.id !== id) })),
      updateAbout: (partial) => setData((d) => ({ ...d, about: { ...d.about, ...partial } })),
    }),
    [data],
  )

  return <SiteDataContext.Provider value={api}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext)
  if (!ctx) throw new Error("useSiteData must be used within SiteDataProvider")
  return ctx
}
