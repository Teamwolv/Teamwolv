"use client"

import { useEffect, useRef } from "react"
// import { Gallery3D } from "./3d-gallery/3d-gallery"

export function PhotoGallerySection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("in-view")
      },
      { threshold: 0.15 },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  return (
    <section className="relative">
      <div ref={ref} className="section-reveal mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="mb-8 text-2xl font-semibold md:text-3xl">Photo Gallery</h2>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">3D Gallery temporarily disabled - install 3D packages to enable</p>
        </div>
      </div>
    </section>
  )
}
