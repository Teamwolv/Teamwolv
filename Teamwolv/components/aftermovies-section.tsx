"use client"

import { useEffect, useRef, useState } from "react"
import { listAftermovies } from "@/lib/aftermovies"

export function AftermoviesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<any[]>([])
  const [glowIntensity, setGlowIntensity] = useState(0.3)
  const [accordionScale, setAccordionScale] = useState(1)
  const [backgroundTone, setBackgroundTone] = useState(0.5)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.classList.add("in-view")
    }, { threshold: 0.15 })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  useEffect(() => {
    listAftermovies()
      .then(setItems)
      .catch((error) => {
        console.error('Error fetching aftermovies:', error)
        // Set empty array as fallback
        setItems([])
      })
  }, [])

  const getBackgroundGradient = () => {
    const i = backgroundTone
    if (i < 0.2) return "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)"
    if (i < 0.4) return "radial-gradient(ellipse at center, #1a0a1a 0%, #0a0a0a 50%, #000000 100%)"
    if (i < 0.6) return "radial-gradient(ellipse at center, #0a1a1a 0%, #0a0a0a 40%, #000000 100%)"
    if (i < 0.8) return "radial-gradient(ellipse at center, #1a1a0a 0%, #0a0a0a 30%, #000000 100%)"
    return "radial-gradient(ellipse at center, #2a1a0a 0%, #1a0a0a 20%, #000000 100%)"
  }

  return (
    <section className="relative py-16 md:py-24">
      <div ref={ref} className="section-reveal mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Aftermovies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Relive the magic of our events through stunning aftermovies.</p>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden transition-all duration-1000"
          style={{ background: getBackgroundGradient() }}
        >
          <div className="absolute inset-0 opacity-30 transition-opacity duration-1000" style={{ opacity: glowIntensity }}>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
          </div>

          <div className="absolute top-1/2 left-8 -translate-y-1/2 space-y-3 z-10">
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-3 border border-white/8">
              <input type="range" min="0" max="1" step="0.1" value={glowIntensity} onChange={(e) => setGlowIntensity(parseFloat(e.target.value))} className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-3 border border-white/8">
              <input type="range" min="0.7" max="1.3" step="0.1" value={accordionScale} onChange={(e) => setAccordionScale(parseFloat(e.target.value))} className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-3 border border-white/8">
              <input type="range" min="0" max="1" step="0.1" value={backgroundTone} onChange={(e) => setBackgroundTone(parseFloat(e.target.value))} className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>

          <div className="flex items-stretch justify-center gap-3 h-[420px] md:h-[520px] p-8" style={{ transform: `scale(${accordionScale})` }}>
            {Array.from({ length: 5 }, (_, index) => {
              const item = items[index]
              return (
                <div key={index} className="relative h-full w-28 md:w-40 lg:w-48 rounded-3xl overflow-hidden border border-white/10 bg-white/6 transition-all duration-500 hover:w-72 md:hover:w-96">
                  {item ? (
                    <>
                      <video src={item.video_url} className="absolute inset-0 w-full h-full object-cover" loop muted autoPlay playsInline />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-semibold text-sm md:text-base truncate">{item.title}</h3>
                        {item.event && <span className="text-white/80 text-xs">{item.event}</span>}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-white/60">Empty</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
