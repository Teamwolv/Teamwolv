"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { listAftermovies, uploadVideoToBucket, createAftermovie, updateAftermovieRow, deleteAftermovieRow, type AftermovieRecord } from "@/lib/aftermovies"

export interface AftermovieItem {
  id: string
  title: string
  description?: string
  event?: string
  videoUrl: string
  uploadDate: string
}

interface AftermoviesContextType {
  items: AftermovieItem[]
  refresh: () => Promise<void>
  addFile: (file: File, fields: { title: string; description?: string; event?: string }) => Promise<void>
  update: (id: string, updates: Partial<{ title: string; description: string; event: string }>) => Promise<void>
  remove: (id: string) => Promise<void>
}

const AftermoviesContext = createContext<AftermoviesContextType | undefined>(undefined)

export function AftermoviesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<AftermovieItem[]>([])

  const hydrate = async () => {
    const rows = await listAftermovies()
    setItems(rows.map(mapRow))
  }

  useEffect(() => {
    hydrate().catch(console.error)
  }, [])

  const addFile: AftermoviesContextType["addFile"] = async (file, fields) => {
    const publicUrl = await uploadVideoToBucket(file)
    await createAftermovie({ title: fields.title, description: fields.description, event: fields.event, video_url: publicUrl })
    await hydrate()
  }

  const update: AftermoviesContextType["update"] = async (id, updates) => {
    await updateAftermovieRow(id, updates)
    await hydrate()
  }

  const remove: AftermoviesContextType["remove"] = async (id) => {
    await deleteAftermovieRow(id)
    await hydrate()
  }

  const value = useMemo(() => ({ items, refresh: hydrate, addFile, update, remove }), [items])

  return <AftermoviesContext.Provider value={value}>{children}</AftermoviesContext.Provider>
}

function mapRow(r: AftermovieRecord): AftermovieItem {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? undefined,
    event: r.event ?? undefined,
    videoUrl: r.video_url,
    uploadDate: r.created_at,
  }
}

export function useAftermovies() {
  const ctx = useContext(AftermoviesContext)
  if (!ctx) throw new Error("useAftermovies must be used within AftermoviesProvider")
  return ctx
}
