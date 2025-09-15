"use client"

import type React from "react"
import { useState } from "react"
import { SaveButton } from "@/components/save-button"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-foreground/60">{label}</span>
      {children}
    </label>
  )
}

export default function AdminProfilePage() {
  const [name, setName] = useState("Admin User")
  const [email, setEmail] = useState("admin@example.com")
  const [hasChanges, setHasChanges] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    if (field === 'name') setName(value)
    if (field === 'email') setEmail(value)
    setHasChanges(true)
  }

  const handleSave = async () => {
    // Save to localStorage for demo
    localStorage.setItem('adminProfile', JSON.stringify({ name, email }))
    setHasChanges(false)
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <SaveButton onSave={handleSave} disabled={!hasChanges} />
      </div>
      
      <div className="grid gap-3">
        <Field label="Name">
          <input
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </Field>
        <Field label="Email">
          <input
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </Field>
      </div>
      <p className="mt-6 text-xs text-foreground/60">
        Demo panel uses localStorage. Connect a database later for multi-user auth and real persistence.
      </p>
    </div>
  )
}
