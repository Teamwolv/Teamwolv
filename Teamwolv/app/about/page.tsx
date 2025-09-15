"use client"

import Link from "next/link"
import { SiteDataProvider, useSiteData } from "@/providers/site-data-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

function AboutContent() {
  const { about } = useSiteData()
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-pretty text-3xl font-semibold md:text-4xl">{about.heading}</h1>
      <p className="mt-6 text-base leading-relaxed text-foreground/70">{about.content}</p>
      <Link href="/admin/about" className="mt-6 inline-block text-sm text-primary hover:underline">
        Edit in Admin
      </Link>
    </div>
  )
}

export default function AboutPage() {
  return (
    <SiteDataProvider>
      <SiteHeader />
      <main>
        <AboutContent />
      </main>
      <SiteFooter />
    </SiteDataProvider>
  )
}
