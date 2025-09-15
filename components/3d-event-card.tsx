"use client"
import Image from "next/image"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { EventModal } from "@/components/event-modal"

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

interface EventCardProps {
  event: Event
}

// Client-side date formatting component to prevent hydration issues
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

export function EventCard3D({ event }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="mb-8">
        <CardContainer className="inter-var">
          <CardBody 
            className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black/20 dark:border-white/[0.1] border-black/[0.05] w-auto sm:w-[22rem] h-auto rounded-xl p-4 border-[0.5px] backdrop-blur-sm bg-white/10 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={handleCardClick}
          >
          {/* Event Image */}
          <CardItem translateZ="100" className="w-full mb-4">
            <Image
              src={event.image_url || "/placeholder.svg?height=1350&width=1080&query=event image"}
              height="1350"
              width="1080"
              className="h-56 w-full object-cover rounded-lg group-hover/card:shadow-xl"
              alt={event.title}
              priority={false}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </CardItem>

          {/* Event Title */}
          <CardItem translateZ="50" className="text-lg font-bold text-neutral-600 dark:text-white mb-3">
            {event.title}
          </CardItem>

          {/* Event Description */}
          <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mb-4 dark:text-neutral-300">
            {event.description}
          </CardItem>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {/* Event Date */}
            {event.date && (
              <CardItem translateZ="30" className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Calendar className="w-4 h-4 text-primary" />
                <ClientDate date={event.date} type="date" />
              </CardItem>
            )}

            {/* Event Time */}
            {event.date && (
              <CardItem translateZ="30" className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Clock className="w-4 h-4 text-primary" />
                <ClientDate date={event.date} type="time" />
              </CardItem>
            )}

            {/* Event Location */}
            {event.location && (
              <CardItem translateZ="30" className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{event.location}</span>
              </CardItem>
            )}
          </div>

          {/* External Booking Link Button */}
          {event.booking_url ? (
            <CardItem
              translateZ="20"
              as="a"
              href={event.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors w-full text-center flex items-center justify-center space-x-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 w-4" />
              <span>Get Tickets</span>
            </CardItem>
          ) : (
            <CardItem
              translateZ="20"
              className="px-4 py-2 rounded-lg bg-gray-400 text-white text-sm font-semibold w-full text-center cursor-not-allowed opacity-50"
            >
              Tickets Not Available
            </CardItem>
          )}
        </CardBody>
      </CardContainer>
    </div>

    {/* Event Modal */}
    <EventModal 
      event={event}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
    />
  </>
  )
}
