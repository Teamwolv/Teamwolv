"use client"

import { useState } from "react"
import { SiteDataProvider } from "@/providers/site-data-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
// import { Gallery3D } from "@/components/3d-gallery/3d-gallery"
// import { CardProvider, useCard } from "@/components/3d-gallery/card-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Upload } from "lucide-react"

function GalleryManagement() {
  // Temporary mock data until 3D packages are installed
  const [cards, setCards] = useState([
    { id: "1", title: "Sample Image", alt: "Sample", description: "Sample description", category: "Events", imageUrl: "/placeholder.svg" }
  ])
  
  const [isAdding, setIsAdding] = useState(false)
  const [editingCard, setEditingCard] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    alt: "",
    description: "",
    category: "",
    imageUrl: ""
  })

  const addCard = (newCard: any) => {
    setCards([...cards, { ...newCard, id: Date.now().toString() }])
  }

  const updateCard = (id: string, updatedCard: any) => {
    setCards(cards.map(card => card.id === id ? { ...card, ...updatedCard } : card))
  }

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCard) {
      updateCard(editingCard.id, formData)
      setEditingCard(null)
    } else {
      addCard(formData)
    }
    setFormData({ title: "", alt: "", description: "", category: "", imageUrl: "" })
    setIsAdding(false)
  }

  const handleEdit = (card: any) => {
    setEditingCard(card)
    setFormData({
      title: card.title,
      alt: card.alt,
      description: card.description || "",
      category: card.category || "",
      imageUrl: card.imageUrl
    })
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      deleteCard(id)
    }
  }

  const resetForm = () => {
    setFormData({ title: "", alt: "", description: "", category: "", imageUrl: "" })
    setEditingCard(null)
    setIsAdding(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground">Manage your 3D gallery cards</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Card
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCard ? "Edit Card" : "Add New Card"}</CardTitle>
            <CardDescription>
              {editingCard ? "Update the card information" : "Create a new gallery card"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Card title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input
                    id="alt"
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    placeholder="Image alt text"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Card description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Events, Team, Performances"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Image URL or path"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingCard ? "Update Card" : "Add Card"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 3D Gallery Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Preview</CardTitle>
          <CardDescription>Interactive 3D preview of your gallery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">3D Gallery temporarily disabled - install 3D packages to enable</p>
          </div>
        </CardContent>
      </Card>

      {/* Cards List */}
      <Card>
        <CardHeader>
          <CardTitle>All Cards ({cards.length})</CardTitle>
          <CardDescription>Manage existing gallery cards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div key={card.id} className="border rounded-lg p-4 space-y-3">
                <img
                  src={card.imageUrl}
                  alt={card.alt}
                  className="w-full h-32 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{card.title}</h3>
                  {card.description && (
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  )}
                  {card.category && (
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded mt-2">
                      {card.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(card)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(card.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
              Delete
                  </Button>
                </div>
          </div>
        ))}
      </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminGalleryPage() {
  return (
    <SiteDataProvider>
      <SiteHeader />
      <main className="px-6 py-6">
        <GalleryManagement />
      </main>
      <SiteFooter />
    </SiteDataProvider>
  )
}
