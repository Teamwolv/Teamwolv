"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, MapPin, Clock, ExternalLink, Star } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date?: string | null
  location?: string | null
  image_url?: string
  featured?: boolean
  booking_url?: string
}

interface EventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

// Client-side date formatting component
function ClientDate({ date, type }: { date: string; type: 'date' | 'time' }) {
  const [formatted, setFormatted] = useState('')
  
  useEffect(() => {
    const dateObj = new Date(date)
    if (type === 'date') {
      setFormatted(dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
    } else {
      setFormatted(dateObj.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }))
    }
  }, [date, type])
  
  return <span>{formatted}</span>
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !event) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Backdrop with blur and dark overlay */}
      <div 
        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content - Card Style */}
      <div 
        className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Event Image/Banner */}
        <div className="relative h-64 md:h-80">
          <Image
            src={event.image_url || "/placeholder.svg?height=800&width=1200&query=event image"}
            alt={event.title}
            fill
            className="object-cover rounded-t-xl"
            priority
          />
          {/* Featured badge */}
          {event.featured && (
            <div className="absolute top-4 left-4 flex items-center space-x-1 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>Featured</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Event Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {event.title}
          </h2>

          {/* Event Description */}
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-4 mb-8">
            {/* Date */}
            {event.date && (
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Date</p>
                  <ClientDate date={event.date} type="date" />
                </div>
              </div>
            )}

            {/* Time */}
            {event.date && (
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Time</p>
                  <ClientDate date={event.date} type="time" />
                </div>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Location</p>
                  <p>{event.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {event.booking_url ? (
            <a
              href={event.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Get Tickets</span>
            </a>
          ) : (
            <div className="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg text-center cursor-not-allowed opacity-50">
              Tickets Not Available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
