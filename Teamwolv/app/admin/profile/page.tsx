"use client"

import type React from "react"

import { useState } from "react"

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

  return (
    <div className="mx-auto max-w-md">
      <div className="grid gap-3">
        <Field label="Name">
          <input
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Email">
          <input
            className="w-full rounded-md border border-border/50 bg-muted/60 px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <button className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-red-800">
          Save
        </button>
      </div>
      <p className="mt-6 text-xs text-foreground/60">
        Demo panel uses localStorage. Connect a database later for multi-user auth and real persistence.
      </p>
    </div>
  )
}
