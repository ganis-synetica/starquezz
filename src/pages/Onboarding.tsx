import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'starquezz.onboarded'

const screens = [
  {
    title: 'Turn chores into quests!',
    subtitle: 'Make daily tasks feel like exciting adventures',
    image: '/illustrations/onboarding-1-quests.png',
    emoji: '⚔️',
    bgColor: 'from-amber-100 to-orange-100',
  },
  {
    title: 'Earn stars for good habits!',
    subtitle: 'Complete quests and watch your stars grow',
    image: '/illustrations/onboarding-2-stars.png',
    emoji: '⭐',
    bgColor: 'from-yellow-100 to-amber-100',
  },
  {
    title: 'Redeem for real rewards!',
    subtitle: 'Trade your stars for awesome prizes',
    image: '/illustrations/onboarding-3-rewards.png',
    emoji: '🎁',
    bgColor: 'from-pink-100 to-purple-100',
  },
]

export function Onboarding() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const navigate = useNavigate()

  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    navigate('/')
  }

  const nextScreen = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevScreen = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1)
    }
  }

  const screen = screens[currentScreen]
  const isLastScreen = currentScreen === screens.length - 1

  return (
    <div className={`min-h-screen bg-gradient-to-b ${screen.bgColor} p-6 flex flex-col`}>
      {/* Skip button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          className="text-gray-600 font-bold"
          onClick={completeOnboarding}
        >
          Skip
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto">
        {/* Illustration */}
        <div className="w-64 h-64 mb-8 rounded-3xl overflow-hidden bg-white/50 flex items-center justify-center border-4 border-black/10">
          <img
            src={screen.image}
            alt={screen.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to emoji if image not found
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <span className="text-8xl hidden">{screen.emoji}</span>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-black text-center mb-3 text-gray-800">
          {screen.title}
        </h1>
        <p className="text-lg text-center text-gray-600 font-medium mb-8">
          {screen.subtitle}
        </p>

        {/* Dots indicator */}
        <div className="flex gap-2 mb-8">
          {screens.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentScreen
                  ? 'bg-purple-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 max-w-md mx-auto w-full">
        {currentScreen > 0 && (
          <Button
            variant="outline"
            className="flex-1 border-4 border-black bg-white"
            onClick={prevScreen}
          >
            Back
          </Button>
        )}
        <Button
          className={`flex-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            isLastScreen
              ? 'bg-green-400 hover:bg-green-300 text-black'
              : 'bg-purple-500 hover:bg-purple-400'
          }`}
          onClick={nextScreen}
        >
          {isLastScreen ? "Let's Go! 🚀" : 'Next'}
        </Button>
      </div>
    </div>
  )
}

export function checkOnboarded(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}
