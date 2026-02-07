import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Check, Clock, Trophy, ArrowLeft } from "lucide-react"
import { useChildSession } from "@/contexts/ChildContext"
import { supabase } from "@/lib/supabase"
import { listHabitsForChild } from "@/services/habits"
import { createCompletion, listCompletionsForChildOnDate } from "@/services/completions"
import type { Child, Habit } from "@/types"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

type HabitWithStatus = Habit & { completed: boolean; pending: boolean }

function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function ChildDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { childId: sessionChildId, logoutChild } = useChildSession()

  const childId = id
  const dateISO = useMemo(() => todayISO(), [])

  const [child, setChild] = useState<Pick<Child, 'id' | 'name' | 'avatar' | 'stars'> | null>(null)
  const [habits, setHabits] = useState<HabitWithStatus[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!childId) return
    if (sessionChildId && sessionChildId !== childId) {
      navigate('/')
      return
    }

    void (async () => {
      setError(null)
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('id,name,avatar,stars')
        .eq('id', childId)
        .single()
      if (childError) {
        setError(childError.message)
        return
      }
      setChild(childData as Pick<Child, 'id' | 'name' | 'avatar' | 'stars'>)

      const [habitRows, completionRows] = await Promise.all([
        listHabitsForChild(childId),
        listCompletionsForChildOnDate(childId, dateISO),
      ])

      const completionByHabit = new Map(completionRows.map((c) => [c.habit_id, c]))
      setHabits(
        habitRows.map((h) => {
          const c = completionByHabit.get(h.id)
          const completed = Boolean(c)
          const pending = Boolean(c && !c.approved_at && !c.rejected_at)
          return { ...h, completed, pending }
        }),
      )
    })().catch((err) => {
      setError(err instanceof Error ? err.message : 'Something went wrong loading quests.')
    })
  }, [childId, dateISO, navigate, sessionChildId])

  const coreCompleted = habits.filter((h) => h.is_core && h.completed).length
  const totalCore = habits.filter((h) => h.is_core).length

  const completeHabit = async (habit: HabitWithStatus) => {
    if (!childId) return
    if (habit.completed) return

    if (!habit.is_core && coreCompleted < totalCore) {
      setError('Bonus quests unlock after all must-do quests! 🔒')
      return
    }

    setError(null)
    try {
      await createCompletion(habit.id, childId, dateISO)
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? { ...h, completed: true, pending: true } : h)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete quest. Try again!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-200 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}
            >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2 bg-yellow-300 px-4 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Star className="w-6 h-6 fill-yellow-500 text-yellow-700" />
            <span className="text-xl font-black">{child?.stars ?? 0}</span>
          </div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black mb-1">Hey {child?.name ?? 'Explorer'}! {child?.avatar ?? '⭐'}</h1>
          <p className="text-lg font-bold text-gray-700">
            Ready to quest-ify your day?
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-4 border-black p-3 rounded-xl text-sm font-bold text-red-800">
            {error}
          </div>
        )}

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
          {habits.filter(h => h.is_core).map((habit) => (
            <Card 
              key={habit.id} 
              className={`cursor-pointer transition-all ${habit.completed ? 'bg-green-100' : 'bg-white'}`}
              onClick={() => completeHabit(habit)}
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
                    {habit.pending && (
                      <p className="text-xs font-bold text-purple-700 mt-1">Pending approval ⏳</p>
                    )}
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
          {habits.filter(h => !h.is_core).map((habit) => (
            <Card 
              key={habit.id} 
              className={`cursor-pointer transition-all ${habit.completed ? 'bg-green-100' : 'bg-white'} ${coreCompleted < totalCore ? 'opacity-50' : ''}`}
              onClick={() => completeHabit(habit)}
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
                    {habit.pending && (
                      <p className="text-xs font-bold text-purple-700 mt-1">Pending approval ⏳</p>
                    )}
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
        <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300" size="lg" onClick={() => navigate('/store')}>
          🛒 Star Store
        </Button>

        <Button
          className="w-full mt-3"
          variant="outline"
          onClick={() => {
            logoutChild()
            navigate('/')
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
