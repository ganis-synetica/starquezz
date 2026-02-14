import { useEffect, useState } from 'react'
import { Star, Sparkles } from 'lucide-react'

interface CompletionAnimationProps {
  show: boolean
  onComplete?: () => void
  type?: 'habit' | 'bonus'
}

export function CompletionAnimation({ show, onComplete, type = 'habit' }: CompletionAnimationProps) {
  const [visible, setVisible] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (show) {
      setVisible(true)
      // Generate particles
      setParticles(
        Array.from({ length: 12 }, (_, i) => ({
          id: i,
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          delay: Math.random() * 0.3,
        }))
      )
      
      // Auto-hide after animation
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!visible) return null

  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    // Simple fade for reduced motion
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="text-6xl animate-pulse">
          {type === 'bonus' ? '🌟' : '⭐'}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Central star */}
      <div className="relative">
        <div 
          className="text-8xl animate-[bounce_0.5s_ease-out]"
          style={{
            animation: 'celebrateStar 0.6s ease-out forwards',
          }}
        >
          {type === 'bonus' ? '🌟' : '⭐'}
        </div>
        
        {/* Sparkles */}
        <Sparkles 
          className="absolute -top-4 -right-4 w-8 h-8 text-gold animate-ping"
          style={{ animationDuration: '0.8s' }}
        />
        <Sparkles 
          className="absolute -bottom-4 -left-4 w-6 h-6 text-gold animate-ping"
          style={{ animationDuration: '1s', animationDelay: '0.2s' }}
        />
      </div>

      {/* Particle explosion */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            animation: `particleExplode 0.8s ease-out forwards`,
            animationDelay: `${particle.delay}s`,
            '--particle-x': `${particle.x}px`,
            '--particle-y': `${particle.y}px`,
          } as React.CSSProperties}
        >
          {particle.id % 3 === 0 ? (
            <Star className="w-6 h-6 text-gold fill-gold" />
          ) : particle.id % 3 === 1 ? (
            <span className="text-2xl">✨</span>
          ) : (
            <span className="text-xl">🎉</span>
          )}
        </div>
      ))}

      {/* CSS for animations */}
      <style>{`
        @keyframes celebrateStar {
          0% {
            transform: scale(0) rotate(-20deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(10deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes particleExplode {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--particle-x), var(--particle-y)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Hook for triggering completion animation
export function useCompletionAnimation() {
  const [animating, setAnimating] = useState(false)
  const [animationType, setAnimationType] = useState<'habit' | 'bonus'>('habit')

  const triggerAnimation = (type: 'habit' | 'bonus' = 'habit') => {
    setAnimationType(type)
    setAnimating(true)
  }

  const Animation = (
    <CompletionAnimation
      show={animating}
      type={animationType}
      onComplete={() => setAnimating(false)}
    />
  )

  return { triggerAnimation, Animation, isAnimating: animating }
}
