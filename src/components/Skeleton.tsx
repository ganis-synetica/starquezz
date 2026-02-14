import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-charcoal/10',
        className
      )}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-card border-4 border-charcoal/20 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(74,68,83,0.2)]">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonHabitList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-24 h-10 rounded-full" />
      </div>
      
      {/* Greeting skeleton */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-5 w-36 mx-auto" />
      </div>
      
      {/* Progress card skeleton */}
      <div className="bg-card border-4 border-charcoal/20 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
      
      {/* Habits list skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <SkeletonHabitList count={4} />
      </div>
    </div>
  )
}

export function SkeletonChildSelector({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40 mx-auto" />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border-4 border-charcoal/20 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
