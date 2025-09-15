"use client"

import { SiteDataProvider } from "@/providers/site-data-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
// import { Gallery3D } from "@/components/3d-gallery/3d-gallery"

function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-semibold">Gallery</h1>
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">3D Gallery temporarily disabled - install 3D packages to enable</p>
      </div>
    </div>
  )
}

export default function GalleryPageWrapper() {
  return (
    <SiteDataProvider>
      <SiteHeader />
      <main>
        <GalleryPage />
      </main>
      <SiteFooter />
    </SiteDataProvider>
  )
}
