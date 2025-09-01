"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useSiteData } from "@/providers/site-data-provider"

export function Hero() {
  const { data } = useSiteData()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("in-view")
      },
      { threshold: 0.2 },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div ref={ref} className="section-reveal mx-auto max-w-6xl px-4 py-24 md:py-32">
        <h1 className="text-pretty text-4xl font-semibold tracking-tight md:text-6xl">{data.settings.heroTitle}</h1>
        <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-foreground/70 md:text-lg">
          {data.settings.heroSubtitle}
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href={data.settings.ctaHref}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {data.settings.ctaText}
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-md border border-border/60 bg-muted px-5 py-3 text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  )
}
