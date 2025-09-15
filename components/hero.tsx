"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const [imageError, setImageError] = useState(false)
  const [videoError, setVideoError] = useState(false)

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

  const handleVideoError = () => {
    setVideoError(true)
    console.warn('Video failed to load, falling back to image')
  }

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center pt-0 -mt-0">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.3)' }}
            onError={handleVideoError}
          >
            <source src="/concert.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        )}
      </div>
      
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Background glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>
      
      {/* Main content */}
      <div ref={ref} className="section-reveal relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="flex flex-col justify-center items-center text-center">
          {/* Logo */}
          {!imageError ? (
            <Image
              src="/logo.png"
              alt="Team Wolv Logo"
              width={300}
              height={300}
              className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
              priority
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-48 h-48 md:w-64 md:h-64 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-4xl md:text-6xl">TW</span>
            </div>
          )}
          
          {/* Hero Text */}
          <div className="mt-8 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Team Wolv
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Crafting unforgettable nights where sound, light, and space converge. 
              From intimate gatherings to large-scale productions, we bring your vision to life.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
