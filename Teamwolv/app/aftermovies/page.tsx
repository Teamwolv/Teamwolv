"use client"

import { SiteDataProvider } from "@/providers/site-data-provider"
import { AftermoviesProvider } from "@/providers/aftermovies-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AftermoviesSection } from "@/components/aftermovies-section"

export default function AftermoviesPage() {
  return (
    <SiteDataProvider>
      <AftermoviesProvider>
        <SiteHeader />
        <main>
          <AftermoviesSection />
        </main>
        <SiteFooter />
      </AftermoviesProvider>
    </SiteDataProvider>
  )
}
