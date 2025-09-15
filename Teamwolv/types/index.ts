// Event types
export interface Event {
  id: string
  title: string
  description: string
  date: string | null | undefined
  location: string | null | undefined
  image_url?: string
  imageUrl?: string
  featured: boolean
  booking_url?: string
  created_at: string
  updated_at: string
}

// User types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

// Site Settings types
export interface SiteSettings {
  id: string
  site_name: string | null
  site_description: string | null
  logo_url: string | null
  primary_color: string | null
  contact_email: string | null
  contact_phone: string | null
  contact_location: string | null
  social_facebook: string | null
  social_twitter: string | null
  social_instagram: string | null
  social_linkedin: string | null
  created_at: string
  updated_at: string
}

// Aftermovie types
export interface Aftermovie {
  id: string
  title: string
  description?: string
  event?: string
  video_url: string
  created_at: string
  updated_at: string
}

// About section types
export interface AboutSection {
  heading: string
  content: string
  features: Array<{
    title: string
    description: string
  }>
  signature: {
    company: string
    tagline: string
  }
}

// Gallery card types
export interface GalleryCard {
  id: string
  title: string
  alt: string
  description?: string
  category?: string
  imageUrl: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Form types
export interface EventFormData {
  title: string
  date: string
  location: string
  description: string
  imageUrl: string
  featured: boolean
  booking_url: string
}

export interface AftermovieFormData {
  title: string
  description: string
  event: string
}

export interface UserFormData {
  email: string
  password: string
  fullName: string
}

// Component Props types
export interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export interface AdminCardProps {
  title: string
  description: string
  href: string
}

// Error types
export interface AppError {
  message: string
  code?: string
  details?: any
}
