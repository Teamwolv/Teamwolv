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

export default function SiteSettingsPage() {
  const { data, updateSettings } = useSiteData()
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-xl font-semibold">Hero</h2>
      <div className="grid gap-4">
        <Field label="Title">
          <input
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={data.settings.heroTitle}
            onChange={(e) => updateSettings({ heroTitle: e.target.value })}
          />
        </Field>
        <Field label="Subtitle">
          <textarea
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            rows={3}
            value={data.settings.heroSubtitle}
            onChange={(e) => updateSettings({ heroSubtitle: e.target.value })}
          />
        </Field>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="CTA Text">
            <input
              className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
              value={data.settings.ctaText}
              onChange={(e) => updateSettings({ ctaText: e.target.value })}
            />
          </Field>
          <Field label="CTA Link">
            <input
              className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
              value={data.settings.ctaHref}
              onChange={(e) => updateSettings({ ctaHref: e.target.value })}
            />
          </Field>
        </div>
      </div>
    </div>
  )
}
