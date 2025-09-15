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
  const { siteSettings, updateSettings } = useSiteData()
  const settings = siteSettings[0] || {}
  
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-xl font-semibold">Site Settings</h2>
      <div className="grid gap-4">
        <Field label="Site Name">
          <input
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={settings.site_name || ''}
            onChange={(e) => updateSettings({ site_name: e.target.value })}
            placeholder="Enter site name..."
          />
        </Field>
        <Field label="Site Description">
          <textarea
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            rows={3}
            value={settings.site_description || ''}
            onChange={(e) => updateSettings({ site_description: e.target.value })}
            placeholder="Enter site description..."
          />
        </Field>
        <Field label="Primary Color">
          <input
            type="color"
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm h-12"
            value={settings.primary_color || '#000000'}
            onChange={(e) => updateSettings({ primary_color: e.target.value })}
          />
        </Field>
        <Field label="Logo URL">
          <input
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={settings.logo_url || ''}
            onChange={(e) => updateSettings({ logo_url: e.target.value })}
            placeholder="Enter logo URL..."
          />
        </Field>
      </div>

      <h3 className="mt-10 mb-3 text-sm font-semibold text-foreground/80">Contact</h3>
      <div className="grid gap-4">
        <Field label="Email">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={settings.contact_email || ''} onChange={(e) => updateSettings({ contact_email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={settings.contact_phone || ''} onChange={(e) => updateSettings({ contact_phone: e.target.value })} />
        </Field>
        <Field label="Location">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={settings.contact_location || ''} onChange={(e) => updateSettings({ contact_location: e.target.value })} />
        </Field>
      </div>

      <h3 className="mt-10 mb-3 text-sm font-semibold text-foreground/80">Social Links</h3>
      <div className="grid gap-4">
        <Field label="Facebook">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={settings.social_facebook || ''} onChange={(e) => updateSettings({ social_facebook: e.target.value })} />
        </Field>
        <Field label="Twitter/X">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={settings.social_twitter || ''} onChange={(e) => updateSettings({ social_twitter: e.target.value })} />
        </Field>
        <Field label="Instagram">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={settings.social_instagram || ''} onChange={(e) => updateSettings({ social_instagram: e.target.value })} />
        </Field>
        <Field label="LinkedIn">
          <input className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm" value={settings.social_linkedin || ''} onChange={(e) => updateSettings({ social_linkedin: e.target.value })} />
        </Field>
      </div>

      <div className="mt-8 p-4 bg-muted/40 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Current Settings</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <div><strong>Site Name:</strong> {settings.site_name || 'Not set'}</div>
          <div><strong>Description:</strong> {settings.site_description || 'Not set'}</div>
          <div><strong>Primary Color:</strong> {settings.primary_color || 'Not set'}</div>
          <div><strong>Logo URL:</strong> {settings.logo_url || 'Not set'}</div>
          <div><strong>Email:</strong> {settings.contact_email || 'Not set'}</div>
          <div><strong>Phone:</strong> {settings.contact_phone || 'Not set'}</div>
          <div><strong>Location:</strong> {settings.contact_location || 'Not set'}</div>
          <div><strong>Facebook:</strong> {settings.social_facebook || 'Not set'}</div>
          <div><strong>Twitter:</strong> {settings.social_twitter || 'Not set'}</div>
          <div><strong>Instagram:</strong> {settings.social_instagram || 'Not set'}</div>
          <div><strong>LinkedIn:</strong> {settings.social_linkedin || 'Not set'}</div>
        </div>
      </div>
    </div>
  )
}
