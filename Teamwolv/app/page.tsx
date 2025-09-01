"use client"

import { SiteDataProvider } from "@/providers/site-data-provider"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { FeaturedEventsSection } from "@/components/featured-events"
import { AboutSection } from "@/components/about-section"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <SiteDataProvider>
      <SiteHeader />
      <main>
        <Hero />
        <FeaturedEventsSection />
        {/* <PhotoGallerySection /> */}
        <AboutSection />
      </main>
      <SiteFooter />
    </SiteDataProvider>
  )
}
