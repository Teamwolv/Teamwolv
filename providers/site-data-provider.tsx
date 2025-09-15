"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { fetchSiteSettings, upsertSiteSettings } from "@/lib/site-settings"
import type { Event, User, SiteSettings, AboutSection } from "@/types"

// Temporary mock data until Supabase is configured
const mockEvents = [
  { id: "1", title: "Team Wolv Launch Party", description: "Join us for the official launch of Team Wolv platform", date: "2024-12-15T18:00:00Z", location: "Virtual Event", imageUrl: "/placeholder.svg?height=240&width=460&query=event image", featured: true, created_at: "2024-12-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
  { id: "2", title: "Tech Meetup 2024", description: "Connect with fellow developers and tech enthusiasts", date: "2024-12-20T19:00:00Z", location: "Downtown Conference Center", imageUrl: "/placeholder.svg?height=240&width=460&query=event image", featured: false, created_at: "2024-12-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
  { id: "3", title: "Creative Workshop", description: "Unleash your creativity in our hands-on workshop", date: "2024-12-25T14:00:00Z", location: "Community Arts Center", imageUrl: "/placeholder.svg?height=240&width=460&query=event image", featured: true, created_at: "2024-12-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" }
]

const mockProfiles: any[] = []
const defaultSettings: SiteSettings = {
  id: "main",
  site_name: "Team Wolv",
  site_description: "Your premier event management platform",
  logo_url: null,
  primary_color: "#000000",
  contact_email: "info@teamwolv.com",
  contact_phone: "+1 (555) 123-4567",
  contact_location: "New York, NY",
  social_facebook: "https://facebook.com",
  social_twitter: "https://x.com",
  social_instagram: "https://instagram.com",
  social_linkedin: "https://linkedin.com",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockAbout = {
  heading: "About Us",
  content: "We craft unforgettable nights—curating premium productions where sound, light, and space converge. Our team blends precision logistics with bold creative to stage events that feel effortless and extraordinary.",
  features: [
    { title: "Curation", description: "Lineups and experiences designed with intention—no filler, just flow." },
    { title: "Production", description: "Audiophile-grade systems, cinematic lighting, and detail-first staging." },
    { title: "Experience", description: "From door to encore, every touch-point is considered and elevated." }
  ],
  signature: { company: "Team Wolv", tagline: "Est. 2024 — Built for the night." }
}

interface SiteData {
  events: Event[]
  profiles: User[]
  siteSettings: SiteSettings[]
  about: AboutSection
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  updateAbout: (updates: Partial<AboutSection>) => void
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>
  addEvent: (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void
}

const SiteDataContext = createContext<SiteData | undefined>(undefined)

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [profiles, setProfiles] = useState<User[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings[]>([])
  const [about, setAbout] = useState<AboutSection>(mockAbout)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use cached data if available
      const cachedEvents = localStorage.getItem('cached-events')
      const cachedSettings = localStorage.getItem('cached-settings')
      
      if (cachedEvents) {
        setEvents(JSON.parse(cachedEvents))
      } else {
      setEvents(mockEvents)
        localStorage.setItem('cached-events', JSON.stringify(mockEvents))
      }
      
      setProfiles(mockProfiles)
      
      // Try to get settings from Supabase; fall back to defaults
      const remote = await fetchSiteSettings().catch(() => null)
      const settings = remote ?? defaultSettings
      setSiteSettings([settings])
      
      // Cache settings
      localStorage.setItem('cached-settings', JSON.stringify(settings))
      setAbout(mockAbout)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSiteSettings([defaultSettings])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    let isMounted = true
    
    const loadData = async () => {
      if (isMounted) {
        await fetchData()
      }
    }
    
    loadData()
    
    return () => {
      isMounted = false
    }
  }, [])

  const refreshData = async () => { await fetchData() }
  const updateAbout = (updates: any) => { setAbout((prev) => ({ ...prev, ...updates })) }

  const updateSettings = async (updates: any) => {
    setSiteSettings((prev) => [{ ...(prev[0] ?? defaultSettings), ...updates }])
    try { await upsertSiteSettings({ ...(siteSettings[0] ?? defaultSettings), ...updates }) } catch {}
  }

  // Event management functions
  const addEvent = (eventData: any) => {
    try {
      setError(null) // Clear any existing errors
      const newEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image_url: eventData.imageUrl || eventData.image_url || "/placeholder.svg?height=240&width=460&query=event image"
      }
      
      setEvents(prev => {
        const updated = [...prev, newEvent]
        localStorage.setItem('cached-events', JSON.stringify(updated))
        return updated
      })
    } catch (error) {
      console.error('Error adding event:', error)
      setError('Failed to add event. Please try again.')
    }
  }

  const updateEvent = (id: string, updates: any) => {
    setEvents(prev => {
      const updated = prev.map(event => 
        event.id === id 
          ? { 
              ...event, 
              ...updates, 
              updated_at: new Date().toISOString(),
              image_url: updates.imageUrl || event.image_url
            }
          : event
      )
      localStorage.setItem('cached-events', JSON.stringify(updated))
      return updated
    })
  }

  const deleteEvent = (id: string) => {
    setEvents(prev => {
      const updated = prev.filter(event => event.id !== id)
      localStorage.setItem('cached-events', JSON.stringify(updated))
      return updated
    })
  }

  const value = { 
    events, 
    profiles, 
    siteSettings, 
    about, 
    loading, 
    error, 
    refreshData, 
    updateAbout, 
    updateSettings,
    addEvent,
    updateEvent,
    deleteEvent
  }

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (context === undefined) { throw new Error("useSiteData must be used within a SiteDataProvider") }
  return context
}
