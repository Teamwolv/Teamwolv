"use client"

import Image from "next/image"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  date?: string
  location?: string
  imageUrl?: string
  featured?: boolean
}

interface EventCardProps {
  event: Event
}

export function EventCard3D({ event }: EventCardProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
          {event.title}
        </CardItem>
        <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {event.description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src={event.imageUrl || "/placeholder.svg?height=240&width=460&query=event image"}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={event.title}
          />
        </CardItem>
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            {event.date ? new Date(event.date).toLocaleDateString() : "TBA"} • {event.location || "—"}
          </CardItem>
          <CardItem
            translateZ={20}
            as={Link}
            href={`/events/${event.id}`}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            View Details →
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  )
}
