import { Star, Check, Clock, Trophy, ArrowLeft } from "lucide-react"
import { useChildSession } from "@/contexts/ChildContext"
import { supabase } from "@/lib/supabase"
import { listHabitsForChild } from "@/services/habits"
import { createCompletion, listCompletionsForChildOnDate } from "@/services/completions"
import { SiblingSelector } from "@/components/SiblingSelector"
import { useCompletionAnimation } from "@/components/CompletionAnimation"
import { StreakCounter } from "@/components/StreakCounter"
import type { Child, Habit } from "@/types"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

type HabitWithStatus = Habit & { completed: boolean; pending: boolean }

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Eric Carle style - collage paper textures, bold primary colors
export function ChildDashboardEricCarle() {
  const { id } = useParams()
  const navigate = useNavigate()
  useChildSession()

  const childId = id
  const dateISO = useMemo(() => todayISO(), [])

  const [child, setChild] = useState<Pick<Child, 'id' | 'name' | 'avatar' | 'stars'> | null>(null)
  const [habits, setHabits] = useState<HabitWithStatus[]>([])
  const [error, setError] = useState<string | null>(null)
  const { triggerAnimation, Animation } = useCompletionAnimation()

  useEffect(() => {
    if (!childId) return

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
  }, [childId, dateISO, navigate])

  const coreCompleted = habits.filter((h) => h.is_core && h.completed).length
  const totalCore = habits.filter((h) => h.is_core).length

  const completeHabit = async (habit: HabitWithStatus) => {
    if (!childId) return
    if (habit.completed) return

    if (!habit.is_core && coreCompleted < totalCore) {
      setError('Finish your main quests first! 🐛')
      return
    }

    setError(null)
    try {
      await createCompletion(habit.id, childId, dateISO)
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? { ...h, completed: true, pending: true } : h)))
      // Trigger celebration animation!
      triggerAnimation(habit.is_core ? 'habit' : 'bonus')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oops! Try again!')
    }
  }

  // Eric Carle colors - bold, primary, painted
  const colors = {
    red: '#E63946',
    green: '#2D6A4F',
    yellow: '#FFD60A',
    blue: '#457B9D',
    orange: '#F77F00',
    purple: '#7B2CBF',
    cream: '#FDF6E3',
    brown: '#8B4513',
  }

  return (
    <div 
      className="min-h-screen p-4 overflow-hidden"
      style={{ 
        backgroundColor: colors.cream,
        backgroundImage: `
          radial-gradient(ellipse at 20% 80%, ${colors.green}15 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, ${colors.red}10 0%, transparent 40%),
          radial-gradient(ellipse at 50% 50%, ${colors.yellow}08 0%, transparent 60%)
        `
      }}
    >
      <div className="max-w-md mx-auto">
        
        {/* Sibling Selector */}
        {childId && <SiblingSelector currentChildId={childId} className="mb-4" />}

        {/* Header - Collage style sun with stars */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ 
              backgroundColor: colors.blue,
              boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
              transform: 'rotate(-5deg)'
            }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            {/* Streak counter */}
            {childId && <StreakCounter childId={childId} variant="compact" />}
            
            {/* Star counter - like a painted sun */}
            <div 
              className="relative px-6 py-3 flex items-center gap-3"
              style={{
                backgroundColor: colors.yellow,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                boxShadow: '6px 6px 0 rgba(0,0,0,0.15)',
                transform: 'rotate(3deg)'
              }}
            >
              {/* Sun rays */}
              <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full" style={{ backgroundColor: colors.orange }} />
              <div className="absolute -top-3 right-4 w-3 h-3 rounded-full" style={{ backgroundColor: colors.orange }} />
              <div className="absolute -bottom-1 -right-2 w-3 h-3 rounded-full" style={{ backgroundColor: colors.orange }} />
              
              <Star className="w-8 h-8" style={{ color: colors.orange, fill: colors.orange }} />
              <span className="text-3xl font-black" style={{ color: colors.brown }}>{child?.stars ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Greeting - Hand painted typography feel */}
        <div className="text-center mb-8 relative">
          {/* Decorative caterpillar dots */}
          <div className="flex justify-center gap-1 mb-3">
            {[colors.red, colors.orange, colors.yellow, colors.green, colors.blue, colors.purple].map((c, i) => (
              <div 
                key={i}
                className="w-4 h-4 rounded-full"
                style={{ 
                  backgroundColor: c,
                  transform: `rotate(${i * 5}deg) translateY(${Math.sin(i) * 2}px)`
                }}
              />
            ))}
          </div>
          
          <h1 
            className="text-4xl font-black mb-2"
            style={{ 
              color: colors.green,
              textShadow: '3px 3px 0 rgba(0,0,0,0.1)',
              transform: 'rotate(-1deg)'
            }}
          >
            Hello {child?.name ?? 'Friend'}!
          </h1>
          <p 
            className="text-xl font-bold"
            style={{ color: colors.brown }}
          >
            {child?.avatar ?? '🐛'} What will you do today?
          </p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 text-center font-bold"
            style={{ 
              backgroundColor: colors.red,
              color: 'white',
              borderRadius: '20px 60px 20px 60px',
              transform: 'rotate(-1deg)'
            }}
          >
            {error}
          </div>
        )}

        {/* Progress Card - Painted paper collage */}
        <div 
          className="mb-8 p-5 relative overflow-hidden"
          style={{
            backgroundColor: colors.blue,
            borderRadius: '30px 10px 30px 10px',
            boxShadow: '8px 8px 0 rgba(0,0,0,0.15)',
            transform: 'rotate(0.5deg)'
          }}
        >
          {/* Torn paper edge effect */}
          <div 
            className="absolute top-0 left-0 right-0 h-3"
            style={{
              background: `linear-gradient(90deg, 
                transparent 0%, ${colors.cream} 5%, transparent 10%,
                ${colors.cream} 20%, transparent 25%,
                ${colors.cream} 40%, transparent 45%,
                ${colors.cream} 60%, transparent 65%,
                ${colors.cream} 80%, transparent 85%,
                ${colors.cream} 95%, transparent 100%
              )`
            }}
          />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white/80 uppercase tracking-wide">Today's Journey</p>
              <p className="text-3xl font-black text-white mt-1">
                {coreCompleted} of {totalCore}
              </p>
            </div>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: coreCompleted === totalCore ? colors.yellow : 'rgba(255,255,255,0.2)',
                transform: 'rotate(10deg)'
              }}
            >
              <Trophy className={`w-10 h-10 ${coreCompleted === totalCore ? 'text-orange-500' : 'text-white/50'}`} />
            </div>
          </div>
          
          {coreCompleted === totalCore && (
            <p 
              className="text-sm font-bold mt-3 p-2 rounded-full text-center"
              style={{ backgroundColor: colors.yellow, color: colors.brown }}
            >
              🎉 You did it! Star earned!
            </p>
          )}
        </div>

        {/* Main Quests - Collage cards */}
        <div className="mb-6">
          <h2 
            className="text-xl font-black mb-4 flex items-center gap-2"
            style={{ color: colors.green }}
          >
            <span 
              className="inline-block w-8 h-8 rounded-full text-center leading-8"
              style={{ backgroundColor: colors.green, color: 'white' }}
            >
              ✓
            </span>
            Must Do
          </h2>
          
          <div className="space-y-4">
            {habits.filter(h => h.is_core).map((habit, idx) => (
              <div 
                key={habit.id} 
                onClick={() => completeHabit(habit)}
                className="p-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: habit.completed ? colors.green : 'white',
                  borderRadius: idx % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
                  boxShadow: '5px 5px 0 rgba(0,0,0,0.12)',
                  transform: `rotate(${idx % 2 === 0 ? -0.5 : 0.5}deg)`,
                  border: `4px solid ${habit.completed ? colors.green : colors.brown}22`
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: habit.completed ? 'white' : colors.yellow,
                      border: `3px solid ${colors.brown}33`
                    }}
                  >
                    {habit.completed ? (
                      <Check className="w-6 h-6" style={{ color: colors.green }} />
                    ) : (
                      <span className="text-lg">🐛</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 
                      className={`text-lg font-bold ${habit.completed ? 'line-through' : ''}`}
                      style={{ color: habit.completed ? 'white' : colors.brown }}
                    >
                      {habit.title}
                    </h3>
                    <p 
                      className="text-sm truncate"
                      style={{ color: habit.completed ? 'rgba(255,255,255,0.8)' : colors.brown + '99' }}
                    >
                      {habit.description}
                    </p>
                    {habit.pending && (
                      <p className="text-xs font-bold mt-1" style={{ color: colors.orange }}>
                        Waiting for grown-up ⏳
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bonus Quests */}
        <div className="mb-8">
          <h2 
            className="text-xl font-black mb-4 flex items-center gap-2"
            style={{ color: colors.purple }}
          >
            <span 
              className="inline-block w-8 h-8 rounded-full text-center leading-8"
              style={{ backgroundColor: colors.purple, color: 'white' }}
            >
              ★
            </span>
            Bonus Fun
            <span className="text-sm font-normal" style={{ color: colors.brown + '88' }}>(+1 star!)</span>
          </h2>
          
          <div className="space-y-4">
            {habits.filter(h => !h.is_core).map((habit, idx) => (
              <div 
                key={habit.id} 
                onClick={() => completeHabit(habit)}
                className={`p-4 cursor-pointer transition-all ${coreCompleted < totalCore ? 'opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                style={{
                  backgroundColor: habit.completed ? colors.purple : 'white',
                  borderRadius: idx % 2 === 0 ? '8px 24px 8px 24px' : '24px 8px 24px 8px',
                  boxShadow: '5px 5px 0 rgba(0,0,0,0.12)',
                  transform: `rotate(${idx % 2 === 0 ? 0.5 : -0.5}deg)`,
                  border: `4px dashed ${habit.completed ? colors.purple : colors.purple}44`
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: habit.completed ? 'white' : colors.orange,
                      border: `3px solid ${colors.brown}33`
                    }}
                  >
                    {habit.completed ? (
                      <Check className="w-6 h-6" style={{ color: colors.purple }} />
                    ) : (
                      <Clock className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 
                      className={`text-lg font-bold ${habit.completed ? 'line-through' : ''}`}
                      style={{ color: habit.completed ? 'white' : colors.brown }}
                    >
                      {habit.title}
                    </h3>
                    <p 
                      className="text-sm truncate"
                      style={{ color: habit.completed ? 'rgba(255,255,255,0.8)' : colors.brown + '99' }}
                    >
                      {habit.description}
                    </p>
                    {habit.pending && (
                      <p className="text-xs font-bold mt-1" style={{ color: colors.orange }}>
                        Waiting for grown-up ⏳
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {coreCompleted < totalCore && (
              <p 
                className="text-center text-sm font-bold py-2"
                style={{ color: colors.brown + '88' }}
              >
                🔒 Finish your must-dos first!
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => navigate(`/store/${childId}`)}
            className="py-4 px-4 font-black text-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: colors.red,
              color: 'white',
              borderRadius: '20px',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
              transform: 'rotate(-0.5deg)'
            }}
          >
            🛒 Star Store
          </button>
          <button
            onClick={() => navigate(`/rewards/${childId}`)}
            className="py-4 px-4 font-black text-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: colors.purple,
              color: 'white',
              borderRadius: '20px',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
              transform: 'rotate(0.5deg)'
            }}
          >
            🎁 My Rewards
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 px-6 font-bold text-lg transition-transform hover:scale-[1.02]"
          style={{
            backgroundColor: 'transparent',
            color: colors.brown,
            border: `3px solid ${colors.brown}44`,
            borderRadius: '50px'
          }}
        >
          Switch Friend
        </button>
        
        {/* Bottom decoration */}
        <div className="flex justify-center gap-2 mt-8 mb-4">
          {[colors.green, colors.yellow, colors.red, colors.orange, colors.blue].map((c, i) => (
            <div 
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: c,
                transform: `translateY(${Math.sin(i * 1.5) * 3}px)`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Completion Animation */}
      {Animation}
    </div>
  )
}
