"use client"

import type React from "react"
import { useState } from "react"
import { useSiteData } from "@/providers/site-data-provider"
import { SaveButton } from "@/components/save-button"

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
  const [hasChanges, setHasChanges] = useState(false)
  const [localAbout, setLocalAbout] = useState(about)

  const handleInputChange = (field: string, value: string) => {
    setLocalAbout(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    await updateAbout(localAbout)
    setHasChanges(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">About Us</h2>
        <SaveButton onSave={handleSave} disabled={!hasChanges} />
      </div>
      
      <Field label="Heading">
        <input
          className="rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
          value={localAbout.heading}
          onChange={(e) => handleInputChange('heading', e.target.value)}
        />
      </Field>
      <Field label="Content">
        <textarea
          rows={6}
          className="mt-3 rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
          value={localAbout.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
        />
      </Field>
    </div>
  )
}
