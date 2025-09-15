"use client"

import { AftermoviesProvider } from "@/providers/aftermovies-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"
import dynamic from "next/dynamic"

// Lazy load heavy components
const FeaturedEventsSection = dynamic(() => import("@/components/featured-events").then(mod => ({ default: mod.FeaturedEventsSection })), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-pulse bg-gray-200 h-64 w-full rounded-lg"></div></div>
})

const AftermoviesSection = dynamic(() => import("@/components/aftermovies-section").then(mod => ({ default: mod.AftermoviesSection })), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-pulse bg-gray-200 h-64 w-full rounded-lg"></div></div>
})

export default function HomePage() {
  return (
    <AftermoviesProvider>
      <SiteHeader />
      <main>
        <Hero />
        <FeaturedEventsSection />
        <AftermoviesSection />
        <AboutSection />
      </main>
      <SiteFooter />
    </AftermoviesProvider>
  )
}
