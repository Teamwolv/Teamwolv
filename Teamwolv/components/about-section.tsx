"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function AboutSection() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) el.classList.add("opacity-100", "translate-y-0")
        })
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 bg-[#111316] p-8 md:p-12",
            "opacity-0 translate-y-6 transition-all duration-700 ease-out",
          )}
        >
          {/* subtle blood-red edge glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
          <div className="pointer-events-none absolute -inset-px rounded-2xl [mask-image:linear-gradient(transparent,black,transparent)]">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#B10018]/30 blur-[2px]" />
            <div className="absolute right-0 top-0 h-full w-1 bg-[#B10018]/20 blur-[2px]" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">About Us</h2>
            <p className="mt-4 text-balance text-sm/6 text-[#CBD5E1] md:text-base/7">
              We craft unforgettable nights—curating premium productions where sound, light, and space converge. Our
              team blends precision logistics with bold creative to stage events that feel effortless and extraordinary.
            </p>
          </div>

          {/* 3-pill highlights */}
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Feature title="Curation" desc="Lineups and experiences designed with intention—no filler, just flow." />
            <Feature
              title="Production"
              desc="Audiophile-grade systems, cinematic lighting, and detail-first staging."
            />
            <Feature title="Experience" desc="From door to encore, every touch-point is considered and elevated." />
          </div>

          {/* signature block */}
          <div className="mt-10 flex flex-col items-center gap-3 md:flex-row md:justify-center">
            <div className="h-10 w-10 rounded-full border border-white/15 bg-[#0B0B0E]" aria-hidden />
            <div className="text-center md:text-left">
              <p className="text-sm text-white">Event Co.</p>
              <p className="text-xs text-white/60">Est. 2017 — Black & Blood Red. Built for the night.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({
  title,
  desc,
}: {
  title: string
  desc: string
}) {
  return (
    <div className="group rounded-xl border border-white/10 bg-[#0B0B0E] p-5 transition-colors hover:border-[#B10018]/50">
      <div className="flex items-center gap-3">
        <span className="inline-block h-2 w-2 rounded-full bg-[#B10018] shadow-[0_0_12px_#B10018]"></span>
        <h3 className="text-base font-medium">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-white/70">{desc}</p>
    </div>
  )
}
