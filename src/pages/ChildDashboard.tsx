import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Check, Clock, Trophy, ArrowLeft } from "lucide-react"
import { useState } from "react"

const DEMO_HABITS = [
  { id: "1", title: "🎹 Practice Piano", description: "15 minutes of practice", isCore: true, completed: false },
  { id: "2", title: "✏️ Writing Exercise", description: "Practice your letters", isCore: true, completed: true },
  { id: "3", title: "🛏️ Make Your Bed", description: "Tidy up your room!", isCore: false, completed: false },
]

export function ChildDashboard() {
  const [habits, setHabits] = useState(DEMO_HABITS)
  const childName = "Zen"
  const stars = 24
  const coreCompleted = habits.filter(h => h.isCore && h.completed).length
  const totalCore = habits.filter(h => h.isCore).length

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-200 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2 bg-yellow-300 px-4 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Star className="w-6 h-6 fill-yellow-500 text-yellow-700" />
            <span className="text-xl font-black">{stars}</span>
          </div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black mb-1">Hey {childName}! 🦊</h1>
          <p className="text-lg font-bold text-gray-700">
            Ready to quest-ify your day?
          </p>
        </div>

        {/* Core Progress */}
        <Card className="mb-6 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500">DAILY QUESTS</p>
                <p className="text-2xl font-black">
                  {coreCompleted}/{totalCore} Core Done
                </p>
              </div>
              <Trophy className={`w-12 h-12 ${coreCompleted === totalCore ? 'text-yellow-500' : 'text-gray-300'}`} />
            </div>
            {coreCompleted === totalCore && (
              <p className="text-sm font-bold text-green-600 mt-2">
                🎉 You've earned today's star! Quest-master extraordinaire!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Core Habits */}
        <h2 className="text-lg font-black mb-3 flex items-center gap-2">
          ⚡ Must-Do Quests
        </h2>
        <div className="space-y-3 mb-6">
          {habits.filter(h => h.isCore).map((habit) => (
            <Card 
              key={habit.id} 
              className={`cursor-pointer transition-all ${habit.completed ? 'bg-green-100' : 'bg-white'}`}
              onClick={() => toggleHabit(habit.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg border-4 border-black flex items-center justify-center ${habit.completed ? 'bg-green-400' : 'bg-white'}`}>
                    {habit.completed && <Check className="w-5 h-5 text-black" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${habit.completed ? 'line-through opacity-60' : ''}`}>
                      {habit.title}
                    </h3>
                    <p className="text-sm text-gray-600">{habit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Extra Habits */}
        <h2 className="text-lg font-black mb-3 flex items-center gap-2">
          🌟 Bonus Quests
          <span className="text-sm font-normal text-gray-500">(+1 star each!)</span>
        </h2>
        <div className="space-y-3 mb-6">
          {habits.filter(h => !h.isCore).map((habit) => (
            <Card 
              key={habit.id} 
              className={`cursor-pointer transition-all ${habit.completed ? 'bg-green-100' : 'bg-white'} ${coreCompleted < totalCore ? 'opacity-50' : ''}`}
              onClick={() => coreCompleted === totalCore && toggleHabit(habit.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg border-4 border-black flex items-center justify-center ${habit.completed ? 'bg-green-400' : 'bg-white'}`}>
                    {habit.completed ? <Check className="w-5 h-5 text-black" /> : <Clock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${habit.completed ? 'line-through opacity-60' : ''}`}>
                      {habit.title}
                    </h3>
                    <p className="text-sm text-gray-600">{habit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {coreCompleted < totalCore && (
            <p className="text-center text-sm font-bold text-gray-500">
              Complete your must-do quests first! 🔒
            </p>
          )}
        </div>

        {/* Star Store Button */}
        <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300" size="lg">
          🛒 Star Store
        </Button>
      </div>
    </div>
  )
}
