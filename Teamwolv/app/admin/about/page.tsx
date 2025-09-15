"use client"

import type React from "react"

import { useSiteData } from "@/providers/site-data-provider"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-foreground/60">{label}</span>
      {children}
    </label>
  )
}

export default function AdminAboutPage() {
  const { about, updateAbout } = useSiteData()
  return (
    <div className="mx-auto max-w-2xl">
      <Field label="Heading">
        <input
          className="rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
          value={about.heading}
          onChange={(e) => updateAbout({ heading: e.target.value })}
        />
      </Field>
      <Field label="Content">
        <textarea
          rows={6}
          className="mt-3 rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
          value={about.content}
          onChange={(e) => updateAbout({ content: e.target.value })}
        />
      </Field>
    </div>
  )
}
