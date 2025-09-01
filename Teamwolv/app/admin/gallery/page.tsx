"use client"

import { useState } from "react"
import { useSiteData } from "@/providers/site-data-provider"

export default function AdminGalleryPage() {
  const { data, addPhoto, updatePhoto, deletePhoto } = useSiteData()
  const [url, setUrl] = useState("")
  const [alt, setAlt] = useState("")

  return (
    <div className="grid gap-8 md:grid-cols-[360px_1fr]">
      <div className="rounded-xl border border-border/40 bg-muted/40 p-4">
        <h3 className="mb-4 text-base font-medium">Add Photo</h3>
        <label className="grid gap-1">
          <span className="text-xs text-foreground/60">Image URL</span>
          <input
            className="rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/regal-tabby.png"
          />
        </label>
        <label className="mt-3 grid gap-1">
          <span className="text-xs text-foreground/60">Alt text</span>
          <input
            className="rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
        </label>
        <button
          onClick={() => {
            if (!url) return
            addPhoto({ url, alt })
            setUrl("")
            setAlt("")
          }}
          className="mt-3 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Add Photo
        </button>
      </div>

      <div className="columns-1 gap-4 md:columns-3">
        {data.gallery.map((ph) => (
          <div key={ph.id} className="mb-4 break-inside-avoid rounded-xl border border-border/40 bg-muted/40 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ph.url || "/placeholder.svg?height=700&width=700&query=gallery"}
              alt={ph.alt || "Gallery"}
              className="h-44 w-full rounded-lg object-cover"
            />
            <input
              className="mt-2 w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-xs"
              value={ph.alt || ""}
              placeholder="Alt text"
              onChange={(e) => updatePhoto(ph.id, { alt: e.target.value })}
            />
            <button
              onClick={() => deletePhoto(ph.id)}
              className="mt-2 inline-flex items-center justify-center rounded-md border border-border/50 bg-muted px-3 py-1.5 text-xs text-primary hover:border-primary/40"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
