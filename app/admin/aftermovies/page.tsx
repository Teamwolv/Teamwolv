"use client"

import { useEffect, useState } from "react"
import { SiteDataProvider } from "@/providers/site-data-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Upload, Trash2, Edit, X } from "lucide-react"
import { fetchAftermovies, uploadVideoAndCreate, updateAftermovie, deleteAftermovie } from "@/lib/aftermovies"

export default function AdminAftermoviesPage() {
  const [items, setItems] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event: "",
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAftermovies().then(setItems).catch(console.error)
  }, [])

  const refresh = async () => setItems(await fetchAftermovies())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId && !videoFile) return alert('Please choose a video file')
    try {
      setSaving(true)
      if (editingId) {
        await updateAftermovie(editingId, formData)
        setEditingId(null)
      } else {
        await uploadVideoAndCreate(videoFile!, formData)
      }
      setFormData({ title: "", description: "", event: "" })
      setVideoFile(null)
      setIsAdding(false)
      await refresh()
    } catch (err) {
      console.error(err)
      alert('Save failed. Check console for details.')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    setEditingId(id)
    setFormData({ title: item.title, description: item.description || "", event: item.event || "" })
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this aftermovie?')) return
    try {
      await deleteAftermovie(id)
      await refresh()
    } catch (e) {
      console.error(e)
      alert('Delete failed')
    }
  }

  const resetForm = () => {
    setFormData({ title: "", description: "", event: "" })
    setVideoFile(null)
    setEditingId(null)
    setIsAdding(false)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('video/')) setVideoFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) setVideoFile(file)
  }

  return (
    <SiteDataProvider>
      <SiteHeader />
      <main className="px-6 py-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Aftermovies Management</h1>
              <p className="text-muted-foreground">Manage videos shown on homepage and the Aftermovies page</p>
            </div>
            <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Aftermovie
            </Button>
          </div>

          {isAdding && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Aftermovie" : "Add New Aftermovie"}</CardTitle>
                <CardDescription>
                  {editingId ? "Update the aftermovie information" : "Create a new aftermovie entry"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event">Event</Label>
                      <Input id="event" value={formData.event} onChange={(e) => setFormData({ ...formData, event: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                  </div>

                  {!editingId && (
                    <div className="space-y-2">
                      <Label>Video Upload</Label>
                      <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                           onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                        {videoFile ? (
                          <div className="space-y-4">
                            <video src={URL.createObjectURL(videoFile)} className="w-full max-w-md mx-auto rounded-lg" controls />
                            <Button type="button" variant="outline" onClick={() => setVideoFile(null)} className="flex items-center gap-2">
                              <X className="h-4 w-4" /> Remove Video
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                              <Upload className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-lg font-medium">Drop your video here</p>
                            <Input type="file" accept="video/*" onChange={handleFileSelect} className="max-w-xs mx-auto" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Update Aftermovie' : 'Add Aftermovie')}</Button>
                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Aftermovies ({items.length})</CardTitle>
              <CardDescription>These appear on the homepage and Aftermovies page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <video src={item.video_url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      {item.description && <p className="text-sm text-muted-foreground mb-2">{item.description}</p>}
                      {item.event && (
                        <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">{item.event}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(item.id)} className="flex items-center gap-2">
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="flex items-center gap-2">
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </SiteDataProvider>
  )
}
