import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60",
        className
      )}
    />
  )
}

export function EventCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 bg-muted/40 p-4">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  )
}

export function AdminCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 bg-muted/40 p-5">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  )
}

export function ImageSkeleton() {
  return (
    <div className="w-full h-40 bg-muted/60 rounded-lg flex items-center justify-center">
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  )
}


