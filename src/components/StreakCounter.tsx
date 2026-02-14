import { Flame } from 'lucide-react'
import { getChildStreak } from '@/services/completions'
import { useEffect, useState } from 'react'

interface StreakCounterProps {
  childId: string
  className?: string
  variant?: 'default' | 'compact'
}

export function StreakCounter({ childId, className = '', variant = 'default' }: StreakCounterProps) {
  const [streak, setStreak] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const { streak: currentStreak } = await getChildStreak(childId)
        setStreak(currentStreak)
      } catch {
        // Silently fail - streak is optional
        setStreak(0)
      } finally {
        setLoading(false)
      }
    })()
  }, [childId])

  if (loading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Flame className="w-5 h-5 text-charcoal-light animate-pulse" />
        <span className="text-charcoal-light">...</span>
      </div>
    )
  }

  // Determine streak color and message
  const getStreakStyle = () => {
    if (streak === 0) {
      return {
        color: 'text-charcoal-light',
        bgColor: 'bg-gray-100',
        fillColor: '',
        message: 'New streak!',
      }
    }
    if (streak >= 7) {
      return {
        color: 'text-coral',
        bgColor: 'bg-coral-light',
        fillColor: 'fill-coral',
        message: streak >= 14 ? '🔥 On fire!' : '🔥 Week streak!',
      }
    }
    if (streak >= 3) {
      return {
        color: 'text-orange-500',
        bgColor: 'bg-orange-100',
        fillColor: 'fill-orange-500',
        message: 'Keep going!',
      }
    }
    return {
      color: 'text-gold',
      bgColor: 'bg-gold-light',
      fillColor: 'fill-gold',
      message: 'Building...',
    }
  }

  const style = getStreakStyle()

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Flame className={`w-4 h-4 ${style.color} ${style.fillColor}`} />
        <span className={`font-bold ${style.color}`}>{streak}</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${style.bgColor} ${className}`}>
      <Flame className={`w-5 h-5 ${style.color} ${style.fillColor}`} />
      <span className={`font-black text-lg ${style.color}`}>{streak}</span>
      <span className={`text-sm font-bold ${style.color} opacity-80`}>
        {streak === 1 ? 'day' : 'days'}
      </span>
    </div>
  )
}
