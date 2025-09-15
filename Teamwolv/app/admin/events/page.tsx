"use client"

import { useState } from "react"
import { useSiteData } from "@/providers/site-data-provider"
import { ImageUpload, PasswordInput } from "@/components/ui/image-upload"

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-foreground/60">{label}</span>
      <input
        type={type}
        className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export default function AdminEventsPage() {
  const { events, addEvent, updateEvent, deleteEvent, error } = useSiteData()
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    imageUrl: "",
    featured: false,
    booking_url: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleImageUpload = (file: File) => {
    setSelectedImage(file)
    // Convert file to data URL for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setForm(prev => ({ ...prev, imageUrl: e.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setMessage("Please enter an event title")
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    try {
      const eventData = {
        ...form,
        title: form.title.trim(),
        imageUrl: form.imageUrl || "/placeholder.svg?height=1350&width=1080&query=event image"
      }
      
      addEvent(eventData)
      setForm({
        title: "",
        date: "",
        location: "",
        description: "",
        imageUrl: "",
        featured: false,
        booking_url: "",
      })
      setSelectedImage(null)
      setMessage("Event added successfully!")
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error adding event:', error)
      setMessage("Failed to add event. Please try again.")
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent(id)
      setMessage("Event deleted successfully!")
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleFeature = (id: string, featured: boolean) => {
    updateEvent(id, { featured: !featured })
    setMessage(`Event ${!featured ? 'featured' : 'unfeatured'} successfully!`)
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="grid gap-8 md:grid-cols-[400px_1fr]">
      {(message || error) && (
        <div className={`md:col-span-2 p-4 border rounded-md ${
          error ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
        }`}>
          {error || message}
        </div>
      )}
      
      <div className="rounded-xl border border-border/40 bg-muted/40 p-6">
        <h3 className="mb-6 text-lg font-semibold">Add New Event</h3>
        <div className="grid gap-4">
          <Input label="Event Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          </div>
          
          <label className="grid gap-1">
            <span className="text-xs text-foreground/60">Description</span>
            <textarea
              className="rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter event description..."
            />
          </label>
          
          <Input 
            label="Booking URL (External Event Website)" 
            value={form.booking_url} 
            onChange={(v) => setForm({ ...form, booking_url: v })}
          />
          
          <div className="space-y-2">
            <span className="text-xs text-foreground/60">Event Image</span>
            <ImageUpload onImageUpload={handleImageUpload} />
          </div>
          
          <label className="inline-flex items-center gap-2 text-sm text-foreground/70">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded border-border/50"
            />
            Mark as Featured Event
          </label>
          
          <button
            onClick={handleSubmit}
            disabled={!form.title}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Event
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Current Events ({events.length})</h3>
        {events.map((ev) => (
          <div
            key={ev.id}
            className="grid gap-4 rounded-xl border border-border/40 bg-muted/40 p-4 md:grid-cols-[1fr_200px]"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-sm font-semibold">{ev.title}</strong>
                {ev.featured ? (
                  <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] text-primary font-medium">FEATURED</span>
                ) : null}
              </div>
              
              <div className="text-xs text-foreground/60 space-y-1">
                {ev.date && <div>📅 {new Date(ev.date).toLocaleDateString()}</div>}
                {ev.location && <div>📍 {ev.location}</div>}
                {ev.booking_url && <div>🔗 <a href={ev.booking_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Booking Link</a></div>}
              </div>
              
              <p className="text-sm text-foreground/70">{ev.description}</p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFeature(ev.id, ev.featured)}
                  className="rounded-md border border-border/50 bg-muted px-3 py-1.5 text-xs hover:border-primary/40 transition-colors"
                >
                  {ev.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="rounded-md border border-border/50 bg-muted px-3 py-1.5 text-xs text-red-500 hover:border-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg border border-border/30">
              <img
                src={ev.image_url || ev.imageUrl || "/placeholder.svg?height=300&width=500&query=event preview"}
                alt={ev.title}
                className="h-40 w-full object-cover"
              />
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No events yet. Add your first event using the form on the left!</p>
          </div>
        )}
      </div>
    </div>
  )
}
