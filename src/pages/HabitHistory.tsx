import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowLeft, ChevronLeft, ChevronRight, Check, X, Clock } from "lucide-react"
import { useChildSession } from "@/contexts/ChildContext"
import { supabase } from "@/lib/supabase"
import { SiblingSelector } from "@/components/SiblingSelector"
import type { Child, Habit, HabitCompletion } from "@/types"
import { useEffect, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"

type CompletionWithHabit = HabitCompletion & {
  habit: Pick<Habit, 'id' | 'title' | 'is_core'>
}

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Add padding for first week
  const startPad = firstDay.getDay()
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push(d)
  }
  
  // Add actual month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  
  // Add padding for last week
  const endPad = 6 - lastDay.getDay()
  for (let i = 1; i <= endPad; i++) {
    days.push(new Date(year, month + 1, i))
  }
  
  return days
}

function formatDateISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function HabitHistory() {
  const { id: childId } = useParams()
  const navigate = useNavigate()
  useChildSession()

  const [child, setChild] = useState<Pick<Child, 'id' | 'name' | 'stars' | 'avatar'> | null>(null)
  const [habits, setHabits] = useState<Array<Pick<Habit, 'id' | 'title' | 'is_core'>>>([])
  const [completions, setCompletions] = useState<CompletionWithHabit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const monthDays = useMemo(
    () => getMonthDays(viewMonth.year, viewMonth.month),
    [viewMonth.year, viewMonth.month]
  )

  const monthName = new Date(viewMonth.year, viewMonth.month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    if (!childId) {
      navigate('/')
      return
    }

    void (async () => {
      setLoading(true)
      try {
        // Fetch child data
        const { data: childData } = await supabase
          .from('children')
          .select('id,name,stars,avatar')
          .eq('id', childId)
          .single()
        
        if (childData) setChild(childData as Pick<Child, 'id' | 'name' | 'stars' | 'avatar'>)

        // Fetch habits
        const { data: habitsData } = await supabase
          .from('habits')
          .select('id,title,is_core')
          .eq('child_id', childId)
          .eq('active', true)
        
        if (habitsData) setHabits(habitsData as Array<Pick<Habit, 'id' | 'title' | 'is_core'>>)

        // Fetch completions for last 90 days
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
        const startDate = formatDateISO(ninetyDaysAgo)

        const { data: completionsData } = await supabase
          .from('habit_completions')
          .select('*, habit:habits(id,title,is_core)')
          .eq('child_id', childId)
          .gte('completed_date', startDate)
          .order('completed_date', { ascending: false })
        
        if (completionsData) {
          setCompletions(completionsData as CompletionWithHabit[])
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [childId, navigate])

  // Group completions by date
  const completionsByDate = useMemo(() => {
    const map = new Map<string, CompletionWithHabit[]>()
    for (const c of completions) {
      const date = c.completed_date ?? ''
      if (!map.has(date)) map.set(date, [])
      map.get(date)!.push(c)
    }
    return map
  }, [completions])

  // Calculate which days have all core habits done
  const coreHabitIds = useMemo(() => new Set(habits.filter(h => h.is_core).map(h => h.id)), [habits])
  
  const getDayStatus = (dateISO: string): 'complete' | 'partial' | 'none' => {
    const dayCompletions = completionsByDate.get(dateISO)
    if (!dayCompletions || dayCompletions.length === 0) return 'none'
    
    const approvedHabitIds = new Set(
      dayCompletions
        .filter(c => c.approved_at && !c.rejected_at)
        .map(c => c.habit_id)
    )
    
    if (coreHabitIds.size > 0 && Array.from(coreHabitIds).every(id => approvedHabitIds.has(id))) {
      return 'complete'
    }
    
    return dayCompletions.length > 0 ? 'partial' : 'none'
  }

  const selectedCompletions = selectedDate ? completionsByDate.get(selectedDate) ?? [] : []

  const today = formatDateISO(new Date())

  const prevMonth = () => {
    setViewMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 }
      return { ...prev, month: prev.month - 1 }
    })
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setViewMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 }
      return { ...prev, month: prev.month + 1 }
    })
    setSelectedDate(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-lavender-light p-4">
      <div className="max-w-md mx-auto">
        {/* Sibling Selector */}
        {childId && <SiblingSelector currentChildId={childId} className="mt-4 mb-2" />}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2 bg-gold-light px-4 py-2 rounded-full border-4 border-charcoal shadow-[4px_4px_0px_0px_rgba(74,68,83,0.6)]">
            <Star className="w-6 h-6 fill-gold text-charcoal" />
            <span className="text-xl font-black text-charcoal">{child?.stars ?? 0}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-charcoal">Quest History</h1>
          <p className="text-lg font-bold text-charcoal-light">
            {child?.avatar ?? '⭐'} {child?.name ?? 'Explorer'}'s journey!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-charcoal-light font-bold">Loading history...</p>
          </div>
        ) : (
          <>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <h2 className="text-xl font-black text-charcoal">{monthName}</h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <Card className="bg-card mb-6">
              <CardContent className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-sm font-bold text-charcoal-light">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((date, i) => {
                    const dateISO = formatDateISO(date)
                    const isCurrentMonth = date.getMonth() === viewMonth.month
                    const isToday = dateISO === today
                    const isSelected = dateISO === selectedDate
                    const status = getDayStatus(dateISO)

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(isSelected ? null : dateISO)}
                        className={`
                          aspect-square flex items-center justify-center text-sm font-bold rounded-lg
                          transition-all
                          ${!isCurrentMonth ? 'opacity-30' : ''}
                          ${isToday ? 'ring-2 ring-lavender' : ''}
                          ${isSelected ? 'ring-2 ring-charcoal' : ''}
                          ${status === 'complete' ? 'bg-sage text-white' : ''}
                          ${status === 'partial' ? 'bg-gold-light text-charcoal' : ''}
                          ${status === 'none' && isCurrentMonth ? 'bg-gray-100 text-charcoal-light hover:bg-gray-200' : ''}
                        `}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 mt-4 text-xs font-bold text-charcoal-light">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-sage" />
                    <span>All done</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-gold-light" />
                    <span>Some done</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Day Details */}
            {selectedDate && (
              <Card className="bg-card">
                <CardContent className="p-4">
                  <h3 className="font-black text-lg text-charcoal mb-3">
                    {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  
                  {selectedCompletions.length === 0 ? (
                    <p className="text-charcoal-light text-center py-4">No quests completed this day</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedCompletions.map((c) => (
                        <div
                          key={c.id}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            c.approved_at && !c.rejected_at
                              ? 'bg-sage-light'
                              : c.rejected_at
                                ? 'bg-coral-light'
                                : 'bg-gold-light'
                          }`}
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            {c.approved_at && !c.rejected_at ? (
                              <Check className="w-5 h-5 text-sage" />
                            ) : c.rejected_at ? (
                              <X className="w-5 h-5 text-coral" />
                            ) : (
                              <Clock className="w-5 h-5 text-gold" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-charcoal">{c.habit?.title ?? 'Quest'}</p>
                            <p className="text-xs text-charcoal-light">
                              {c.habit?.is_core ? 'Core Quest' : 'Bonus Quest'}
                              {c.stars_earned > 0 && ` • +${c.stars_earned} ⭐`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Back button */}
        <Button
          className="w-full mt-6"
          variant="outline"
          onClick={() => navigate(`/child/${childId}`)}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
