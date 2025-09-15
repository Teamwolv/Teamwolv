import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { Suspense } from "react"
import { AuthProvider } from "@/providers/auth-provider"
import { SiteDataProvider } from "@/providers/site-data-provider"
import { Loader2 } from "lucide-react"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { ErrorBoundary } from "@/components/error-boundary"
import { PerformanceOptimizer } from "@/components/performance-optimizer"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Team Wolv - Event Management Platform",
    template: "%s | Team Wolv"
  },
  description: "Your premier event management platform for organizing and managing events. Create, manage, and showcase your events with professional tools.",
  keywords: ["event management", "events", "party planning", "event organization", "Team Wolv"],
  authors: [{ name: "Team Wolv" }],
  creator: "Team Wolv",
  publisher: "Team Wolv",
  generator: "Team Wolv",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://teamwolv.com',
    title: 'Team Wolv - Event Management Platform',
    description: 'Your premier event management platform for organizing and managing events.',
    siteName: 'Team Wolv',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Team Wolv - Event Management Platform',
    description: 'Your premier event management platform for organizing and managing events.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">
        <ErrorBoundary>
          <AuthProvider>
            <SiteDataProvider>
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">Loading Team Wolv...</p>
                  </div>
                </div>
              }>
                {children}
              </Suspense>
            </SiteDataProvider>
          </AuthProvider>
        </ErrorBoundary>
        <PerformanceMonitor />
        <PerformanceOptimizer />
        <Analytics />
      </body>
    </html>
  )
}
