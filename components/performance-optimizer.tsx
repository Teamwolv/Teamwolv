"use client"

import { useEffect } from 'react'

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement('link')
      fontLink.rel = 'preload'
      fontLink.href = '/fonts/geist-sans.woff2'
      fontLink.as = 'font'
      fontLink.type = 'font/woff2'
      fontLink.crossOrigin = 'anonymous'
      document.head.appendChild(fontLink)

      // Preload critical images
      const imageLink = document.createElement('link')
      imageLink.rel = 'preload'
      imageLink.href = '/logo.png'
      imageLink.as = 'image'
      document.head.appendChild(imageLink)
    }

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]')
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ''
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach(img => imageObserver.observe(img))
    }

    // Add performance monitoring
    const monitorPerformance = () => {
      if ('performance' in window) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            if (perfData) {
              console.log('Performance Metrics:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
              })
            }
          }, 0)
        })
      }
    }

    // Initialize optimizations
    preloadCriticalResources()
    optimizeImages()
    monitorPerformance()

    // Cleanup
    return () => {
      // Cleanup if needed
    }
  }, [])

  return null
}


