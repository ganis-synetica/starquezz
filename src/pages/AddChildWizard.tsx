import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { KidsSetupStep } from '@/components/onboarding/KidsSetupStep'
import { FocusAreasStep } from '@/components/onboarding/FocusAreasStep'
import { HabitSuggestionsStep } from '@/components/onboarding/HabitSuggestionsStep'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { generateHabitSuggestions } from '@/services/ai'
import { AVATARS } from '@/components/onboarding/constants'
import type { FocusAreaId, HabitIdea, KidProfile } from '@/types/onboarding'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Step = 'kid-details' | 'focus' | 'habits'

function createKidDraft(): KidProfile {
  const randomId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  return {
    id: `kid-${randomId}`,
    name: '',
    age: null,
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    notes: '',
    focusAreas: [],
    habits: { core: [], bonus: [] },
  }
}

function mapCategory(area: FocusAreaId | undefined): 'learning' | 'helping' | 'self_care' | 'growth' {
  if (area === 'learning' || area === 'helping' || area === 'self_care') return area
  return 'growth'
}

export function AddChildWizard() {
  const { status, user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('kid-details')
  const [kid, setKid] = useState<KidProfile>(createKidDraft)

  const [habitLoading, setHabitLoading] = useState(false)
  const [habitError, setHabitError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const updateKid = (updates: KidProfile) => {
    setKid(updates)
  }

  const toggleFocusArea = (area: FocusAreaId) => {
    setKid((prev) => {
      const nextAreas = prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area].slice(0, 3)
      return { ...prev, focusAreas: nextAreas }
    })
  }

  const addHabit = (type: 'core' | 'bonus') => {
    const newHabit: HabitIdea = {
      id: `${type}-${Date.now()}`,
      title: type === 'core' ? 'New core habit' : 'New bonus habit',
      description: '',
      type,
    }
    setKid((prev) => ({
      ...prev,
      habits: {
        ...prev.habits,
        [type]: [...prev.habits[type], newHabit],
      },
    }))
  }

  const updateHabit = (type: 'core' | 'bonus', habitIndex: number, habit: HabitIdea) => {
    setKid((prev) => {
      const nextHabits = prev.habits[type].slice()
      nextHabits[habitIndex] = habit
      return {
        ...prev,
        habits: {
          ...prev.habits,
          [type]: nextHabits,
        },
      }
    })
  }

  const removeHabit = (type: 'core' | 'bonus', habitIndex: number) => {
    setKid((prev) => {
      const nextHabits = prev.habits[type].filter((_, i) => i !== habitIndex)
      return {
        ...prev,
        habits: {
          ...prev.habits,
          [type]: nextHabits,
        },
      }
    })
  }

  const runHabitGeneration = useCallback(async () => {
    if (!kid.name || !kid.age) {
      setHabitError('Please add name and age first.')
      return
    }
    setHabitLoading(true)
    setHabitError(null)
    try {
      const result = await generateHabitSuggestions({
        childName: kid.name,
        age: kid.age,
        focusAreas: kid.focusAreas,
        notes: kid.notes,
      })
      setKid((prev) => ({
        ...prev,
        habits: { core: result.core, bonus: result.bonus },
        habitSource: result.source,
      }))
    } catch (error) {
      setHabitError(error instanceof Error ? error.message : 'Could not generate habits.')
    } finally {
      setHabitLoading(false)
    }
  }, [kid.name, kid.age, kid.focusAreas, kid.notes])

  // Auto-generate habits when entering habits step with empty habits
  useEffect(() => {
    if (step === 'habits' && kid.habits.core.length === 0 && kid.habits.bonus.length === 0 && !habitLoading) {
      void runHabitGeneration()
    }
  }, [step, kid.habits.core.length, kid.habits.bonus.length, habitLoading, runHabitGeneration])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSaveError(null)
    try {
      // Insert child
      const { data: childData, error: childError } = await supabase
        .from('children')
        .insert({
          parent_id: user.id,
          name: kid.name,
          avatar: kid.avatar,
          pin_hash: null,
          stars: 0,
        })
        .select('id')
        .single()

      if (childError) throw childError
      const childId = childData.id as string

      // Insert habits
      const category = mapCategory(kid.focusAreas[0])
      const habitRows = [...kid.habits.core, ...kid.habits.bonus]
        .filter((habit) => habit.title.trim())
        .map((habit) => ({
          parent_id: user.id,
          child_id: childId,
          title: habit.title.trim(),
          description: habit.description?.trim() || null,
          category,
          is_core: habit.type === 'core',
          active: true,
        }))

      if (habitRows.length > 0) {
        const { error: habitInsertError } = await supabase.from('habits').insert(habitRows)
        if (habitInsertError) throw habitInsertError
      }

      navigate('/parent/approvals')
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save child.')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-coral-light p-4 flex items-center justify-center">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-coral-light p-4 flex items-center justify-center">
        <Card className="bg-white/90 border-4 border-charcoal">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-2xl font-black">Parents only!</p>
            <p className="font-bold text-charcoal-light">Sign in to add a child.</p>
            <Button onClick={() => navigate('/login')}>Go to login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-coral-light p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-charcoal-light">Add New Adventurer</p>
            <h1 className="text-3xl font-black text-charcoal">🦝 Musang's Quest Builder</h1>
          </div>
          <Button variant="ghost" className="text-charcoal" onClick={() => navigate('/parent/approvals')}>
            ← Cancel
          </Button>
        </div>

        <Card className="bg-white/90 backdrop-blur border-4 border-charcoal">
          <CardContent className="p-6">
            {step === 'kid-details' && (
              <KidsSetupStep
                kidIndex={0}
                totalKids={1}
                kid={kid}
                onChange={updateKid}
                onNext={() => setStep('focus')}
              />
            )}

            {step === 'focus' && (
              <FocusAreasStep
                kid={kid}
                onToggle={toggleFocusArea}
                onBack={() => setStep('kid-details')}
                onNext={() => setStep('habits')}
              />
            )}

            {step === 'habits' && (
              <>
                <HabitSuggestionsStep
                  kid={kid}
                  loading={habitLoading}
                  error={habitError}
                  source={kid.habitSource}
                  onHabitAdd={addHabit}
                  onHabitChange={updateHabit}
                  onHabitRemove={removeHabit}
                  onRegenerate={runHabitGeneration}
                  onBack={() => setStep('focus')}
                  onNext={handleSave}
                />
                {saveError && (
                  <p className="text-sm font-bold text-coral mt-4">{saveError}</p>
                )}
                {saving && (
                  <p className="text-sm font-bold text-sage mt-4">Saving adventurer...</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
