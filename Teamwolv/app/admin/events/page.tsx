"use client"

import { useState } from "react"
import { useSiteData, type EventItem } from "@/providers/site-data-provider"

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
  const { data, addEvent, updateEvent, deleteEvent } = useSiteData()
  const [form, setForm] = useState<Omit<EventItem, "id">>({
    title: "",
    date: "",
    location: "",
    description: "",
    imageUrl: "",
    featured: false,
  })

  return (
    <div className="grid gap-8 md:grid-cols-[360px_1fr]">
      <div className="rounded-xl border border-border/40 bg-muted/40 p-4">
        <h3 className="mb-4 text-base font-medium">Add Event</h3>
        <div className="grid gap-3">
          <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          </div>
          <Input label="Image URL" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
          <label className="inline-flex items-center gap-2 text-xs text-foreground/70">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-foreground/60">Description</span>
            <textarea
              className="rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <button
            onClick={() => {
              if (!form.title) return
              addEvent(form)
              setForm({
                title: "",
                date: "",
                location: "",
                description: "",
                imageUrl: "",
                featured: false,
              })
            }}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Add Event
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {data.events.map((ev) => (
          <div
            key={ev.id}
            className="grid gap-3 rounded-xl border border-border/40 bg-muted/40 p-4 md:grid-cols-[1fr_200px]"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-sm">{ev.title}</strong>
                {ev.featured ? (
                  <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] text-primary">FEATURED</span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-foreground/60">
                {ev.date || "—"} • {ev.location || "—"}
              </p>
              <p className="mt-2 text-sm text-foreground/70">{ev.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => updateEvent(ev.id, { featured: !ev.featured })}
                  className="rounded-md border border-border/50 bg-muted px-3 py-1.5 text-xs hover:border-primary/40"
                >
                  {ev.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => deleteEvent(ev.id)}
                  className="rounded-md border border-border/50 bg-muted px-3 py-1.5 text-xs text-primary hover:border-primary/40"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-border/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  ev.imageUrl ||
                  "/placeholder.svg?height=300&width=500&query=premium event preview" ||
                  "/placeholder.svg"
                }
                alt={ev.title}
                className="h-40 w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
