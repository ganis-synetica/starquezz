import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type {
  FamilyValueId,
  FocusAreaId,
  HabitIdea,
  KidProfile,
  OnboardingStep,
  RewardIdea,
  RewardTier,
  StoreMotivatorId,
  StorePlan,
} from '@/types/onboarding'
import { KidsSetupStep } from './KidsSetupStep'
import { FocusAreasStep } from './FocusAreasStep'
import { HabitSuggestionsStep } from './HabitSuggestionsStep'
import { StoreSetupWizard } from './StoreSetupWizard'
import { StoreSuggestionsStep } from './StoreSuggestionsStep'
import { generateHabitSuggestions, generateRewardSuggestions } from '@/services/ai'
import { AVATARS } from './constants'

const WIZARD_STATE_KEY = 'starquezz.onboarding.wizard'
const ONBOARDED_KEY = 'starquezz.onboarded'

const STORE_STEPS: Array<OnboardingStep & { stage: 'store' }> = [
  { stage: 'store', screen: 'currency' },
  { stage: 'store', screen: 'budget' },
  { stage: 'store', screen: 'motivators' },
  { stage: 'store', screen: 'values' },
]

const defaultStorePlan = (): StorePlan => ({
  currency: '',
  customCurrency: '',
  budget: 150_000,
  motivators: [],
  values: [],
  suggestions: { quick: [], earned: [], big: [] },
})

const defaultState: {
  step: OnboardingStep
  kidCount: number | null
  kids: KidProfile[]
  store: StorePlan
} = {
  step: { stage: 'welcome' },
  kidCount: null,
  kids: [],
  store: defaultStorePlan(),
}

function loadWizardState() {
  if (typeof window === 'undefined') return defaultState
  const raw = localStorage.getItem(WIZARD_STATE_KEY)
  if (!raw) return defaultState
  try {
    const parsed = JSON.parse(raw) as typeof defaultState
    return {
      ...defaultState,
      ...parsed,
      kids: parsed.kids ?? [],
      store: parsed.store ?? defaultStorePlan(),
    }
  } catch {
    return defaultState
  }
}

function createKidDraft(index: number): KidProfile {
  const randomId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  return {
    id: `kid-${index}-${randomId}`,
    name: '',
    age: null,
    avatar: AVATARS[index % AVATARS.length],
    notes: '',
    focusAreas: [],
    habits: { core: [], bonus: [] },
  }
}

function mapCategory(area: FocusAreaId | undefined): 'learning' | 'helping' | 'self_care' | 'growth' {
  if (area === 'learning' || area === 'helping' || area === 'self_care') return area
  return 'growth'
}

export function OnboardingWizard() {
  const navigate = useNavigate()
  const { status, user } = useAuth()

  const initialState = useMemo(loadWizardState, [])
  const [step, setStep] = useState<OnboardingStep>(initialState.step)
  const [kidCount, setKidCount] = useState<number | null>(initialState.kidCount)
  const [kids, setKids] = useState<KidProfile[]>(initialState.kids)
  const [store, setStore] = useState<StorePlan>(initialState.store)

  const [habitLoading, setHabitLoading] = useState(false)
  const [habitError, setHabitError] = useState<string | null>(null)
  const [rewardLoading, setRewardLoading] = useState(false)
  const [rewardError, setRewardError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!kidCount) return
    if (kids.length >= kidCount) return
    setKids((prev) => {
      const next = [...prev]
      while (next.length < kidCount) {
        next.push(createKidDraft(next.length))
      }
      return next
    })
  }, [kidCount, kids.length])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(
      WIZARD_STATE_KEY,
      JSON.stringify({ step, kidCount, kids, store }),
    )
  }, [step, kidCount, kids, store])

  const handleStartOver = () => {
    setStep({ stage: 'welcome' })
    setKidCount(null)
    setKids([])
    setStore(defaultStorePlan())
    setHabitError(null)
    setRewardError(null)
    setSaveError(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(WIZARD_STATE_KEY)
    }
  }

  const ensureKidSlots = (count: number) => {
    setKids((prev) => {
      const next = [...prev]
      while (next.length < count) {
        next.push(createKidDraft(next.length))
      }
      return next.slice(0, count)
    })
  }

  const handleKidCountSelect = (count: number) => {
    setKidCount(count)
    ensureKidSlots(count)
    setStep({ stage: 'kid-details', index: 0 })
  }

  const updateKid = (index: number, updates: KidProfile) => {
    setKids((prev) => prev.map((kid, idx) => (idx === index ? updates : kid)))
  }

  const toggleFocusArea = (index: number, area: FocusAreaId) => {
    setKids((prev) =>
      prev.map((kid, idx) => {
        if (idx !== index) return kid
        const nextAreas = kid.focusAreas.includes(area)
          ? kid.focusAreas.filter((a) => a !== area)
          : [...kid.focusAreas, area].slice(0, 3)
        return { ...kid, focusAreas: nextAreas }
      }),
    )
  }

  const addHabit = (kidIndex: number, type: 'core' | 'bonus') => {
    const newHabit: HabitIdea = {
      id: `${type}-${Date.now()}`,
      title: type === 'core' ? 'New core habit' : 'New bonus habit',
      description: '',
      type,
    }
    setKids((prev) =>
      prev.map((kid, idx) => {
        if (idx !== kidIndex) return kid
        return {
          ...kid,
          habits: {
            ...kid.habits,
            [type]: [...kid.habits[type], newHabit],
          },
        }
      }),
    )
  }

  const updateHabit = (kidIndex: number, type: 'core' | 'bonus', habitIndex: number, habit: HabitIdea) => {
    setKids((prev) =>
      prev.map((kid, idx) => {
        if (idx !== kidIndex) return kid
        const nextHabits = kid.habits[type].slice()
        nextHabits[habitIndex] = habit
        return {
          ...kid,
          habits: {
            ...kid.habits,
            [type]: nextHabits,
          },
        }
      }),
    )
  }

  const removeHabit = (kidIndex: number, type: 'core' | 'bonus', habitIndex: number) => {
    setKids((prev) =>
      prev.map((kid, idx) => {
        if (idx !== kidIndex) return kid
        const nextHabits = kid.habits[type].filter((_, i) => i !== habitIndex)
        return {
          ...kid,
          habits: {
            ...kid.habits,
            [type]: nextHabits,
          },
        }
      }),
    )
  }

  const runHabitGeneration = useCallback(async (kidIndex: number, kid: KidProfile | undefined) => {
    if (!kid || !kid.name || !kid.age) {
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
      setKids((prev) =>
        prev.map((existing, idx) => {
          if (idx !== kidIndex) return existing
          return {
            ...existing,
            habits: { core: result.core, bonus: result.bonus },
            habitSource: result.source,
          }
        }),
      )
    } catch (error) {
      setHabitError(error instanceof Error ? error.message : 'Could not generate habits.')
    } finally {
      setHabitLoading(false)
    }
  }, [])

  useEffect(() => {
    if (step.stage !== 'habits') return
    const kid = kids[step.index]
    if (!kid) return
    if ((kid.habits.core.length === 0 && kid.habits.bonus.length === 0) && !habitLoading) {
      void runHabitGeneration(step.index, kid)
    }
  }, [step, kids, habitLoading, runHabitGeneration])

  const runRewardGeneration = useCallback(async (plan: StorePlan, firstChildName?: string) => {
    setRewardLoading(true)
    setRewardError(null)
    try {
      const result = await generateRewardSuggestions({
        familyName: firstChildName,
        budget: plan.budget,
        currency: plan.currency,
        motivators: plan.motivators,
        values: plan.values,
      })
      setStore((prev) => ({
        ...prev,
        suggestions: {
          quick: result.quick,
          earned: result.earned,
          big: result.big,
        },
        rewardSource: result.source,
      }))
    } catch (error) {
      setRewardError(error instanceof Error ? error.message : 'Could not generate rewards.')
    } finally {
      setRewardLoading(false)
    }
  }, [])

  useEffect(() => {
    if (step.stage !== 'store-suggestions') return
    if (
      store.suggestions.quick.length === 0 &&
      store.suggestions.earned.length === 0 &&
      store.suggestions.big.length === 0 &&
      !rewardLoading
    ) {
      void runRewardGeneration(store, kids[0]?.name)
    }
  }, [step, store, rewardLoading, runRewardGeneration, kids])

  const handleStoreChange = (updates: Partial<StorePlan>) => {
    setStore((prev) => ({ ...prev, ...updates }))
  }

  const toggleMotivator = (id: StoreMotivatorId) => {
    setStore((prev) => ({
      ...prev,
      motivators: prev.motivators.includes(id)
        ? prev.motivators.filter((item) => item !== id)
        : [...prev.motivators, id].slice(0, 3),
    }))
  }

  const toggleValue = (id: FamilyValueId) => {
    setStore((prev) => ({
      ...prev,
      values: prev.values.includes(id)
        ? prev.values.filter((item) => item !== id)
        : [...prev.values, id].slice(0, 2),
    }))
  }

  const handleRewardChange = (tier: RewardTier, index: number, reward: RewardIdea) => {
    setStore((prev) => ({
      ...prev,
      suggestions: {
        ...prev.suggestions,
        [tier]: prev.suggestions[tier].map((item, idx) => (idx === index ? reward : item)),
      },
    }))
  }

  const handleRewardRemove = (tier: RewardTier, index: number) => {
    setStore((prev) => ({
      ...prev,
      suggestions: {
        ...prev.suggestions,
        [tier]: prev.suggestions[tier].filter((_, idx) => idx !== index),
      },
    }))
  }

  const handleRewardAdd = (tier: RewardTier) => {
    const base: RewardIdea = {
      id: `${tier}-${Date.now()}`,
      title: tier === 'quick' ? 'New quick win' : tier === 'earned' ? 'New earned reward' : 'Dream reward',
      description: '',
      starCost: tier === 'quick' ? 10 : tier === 'earned' ? 30 : 90,
      tier,
    }
    setStore((prev) => ({
      ...prev,
      suggestions: {
        ...prev.suggestions,
        [tier]: [...prev.suggestions[tier], base],
      },
    }))
  }

  const goToNextKidOrStore = (currentKidIndex: number) => {
    if (!kidCount) return
    if (currentKidIndex + 1 < kidCount) {
      setStep({ stage: 'kid-details', index: currentKidIndex + 1 })
    } else {
      setStep({ stage: 'store', screen: 'currency' })
    }
  }

  const handleStoreStepNext = (current: OnboardingStep & { stage: 'store' }) => {
    const index = STORE_STEPS.findIndex((item) => item.screen === current.screen)
    if (index === STORE_STEPS.length - 1) {
      setStep({ stage: 'store-suggestions' })
    } else {
      setStep(STORE_STEPS[index + 1])
    }
  }

  const handleStoreStepBack = (current: OnboardingStep & { stage: 'store' }) => {
    const index = STORE_STEPS.findIndex((item) => item.screen === current.screen)
    if (index === 0) {
      setStep({ stage: 'habits', index: (kidCount ?? 1) - 1 })
    } else {
      setStep(STORE_STEPS[index - 1])
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSaveError(null)
    try {
      for (const kid of kids) {
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
          const { error: habitError } = await supabase.from('habits').insert(habitRows)
          if (habitError) throw habitError
        }
      }

      const rewardRows = (['quick', 'earned', 'big'] as RewardTier[])
        .flatMap((tier) => store.suggestions[tier])
        .filter((reward) => reward.title.trim())
        .map((reward) => ({
          parent_id: user.id,
          title: reward.title.trim(),
          description: reward.description?.trim() || null,
          star_cost: reward.starCost,
          active: true,
        }))

      if (rewardRows.length > 0) {
        const { error: rewardInsertError } = await supabase.from('rewards').insert(rewardRows)
        if (rewardInsertError) throw rewardInsertError
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(ONBOARDED_KEY, 'true')
        localStorage.removeItem(WIZARD_STATE_KEY)
      }

      navigate('/parent/approvals')
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save setup.')
    } finally {
      setSaving(false)
    }
  }

  const renderStep = () => {
    if (status === 'loading') {
      return <p className="text-center font-bold">Loading...</p>
    }

    if (status !== 'authenticated') {
      return (
        <div className="text-center space-y-4">
          <p className="text-2xl font-black">Parents only!</p>
          <p className="font-bold text-charcoal-light">Sign in to finish onboarding.</p>
          <Button onClick={() => navigate('/login')}>Go to login</Button>
        </div>
      )
    }

    switch (step.stage) {
      case 'welcome':
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl">🎉</div>
            <h2 className="text-4xl font-black text-charcoal">Welcome to StarqueZZ!</h2>
            <p className="text-lg font-bold text-charcoal-light">
              Let's build your family's quest headquarters.
            </p>
            <Button size="lg" className="bg-lavender hover:bg-lavender-light" onClick={() => setStep({ stage: 'kid-count' })}>
              Let's Go! →
            </Button>
          </div>
        )
      case 'kid-count':
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-black text-charcoal">How many adventurers are joining?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleKidCountSelect(count)}
                  className="text-3xl font-black border-4 border-charcoal rounded-2xl py-6 bg-white hover:bg-lavender-light"
                >
                  {count} {count === 1 ? 'kid' : 'kids'}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKidCountSelect(4)}
                className="text-3xl font-black border-4 border-charcoal rounded-2xl py-6 bg-white hover:bg-lavender-light"
              >
                4+
              </button>
            </div>
            <p className="text-sm font-bold text-charcoal-light">You can add more later!</p>
          </div>
        )
      case 'kid-details': {
        const kid = kids[step.index] ?? createKidDraft(step.index)
        return (
          <KidsSetupStep
            kidIndex={step.index}
            totalKids={kidCount ?? kids.length}
            kid={kid}
            onChange={(updated) => updateKid(step.index, updated)}
            onNext={() => setStep({ stage: 'focus', index: step.index })}
            onBack={
              step.index === 0
                ? () => setStep({ stage: 'kid-count' })
                : () => setStep({ stage: 'habits', index: step.index - 1 })
            }
          />
        )
      }
      case 'focus': {
        const kid = kids[step.index]
        if (!kid) return null
        return (
          <FocusAreasStep
            kid={kid}
            onToggle={(area) => toggleFocusArea(step.index, area)}
            onBack={() => setStep({ stage: 'kid-details', index: step.index })}
            onNext={() => setStep({ stage: 'habits', index: step.index })}
          />
        )
      }
      case 'habits': {
        const kid = kids[step.index]
        if (!kid) return null
        return (
          <HabitSuggestionsStep
            kid={kid}
            loading={habitLoading}
            error={habitError}
            source={kid.habitSource}
            onHabitAdd={(type) => addHabit(step.index, type)}
            onHabitChange={(type, idx, habit) => updateHabit(step.index, type, idx, habit)}
            onHabitRemove={(type, idx) => removeHabit(step.index, type, idx)}
            onRegenerate={() => runHabitGeneration(step.index, kid)}
            onBack={() => setStep({ stage: 'focus', index: step.index })}
            onNext={() => goToNextKidOrStore(step.index)}
          />
        )
      }
      case 'store':
        return (
          <StoreSetupWizard
            screen={step.screen}
            store={store}
            onCurrencyChange={(currency) => handleStoreChange({ currency })}
            onCustomCurrencyChange={(custom) => handleStoreChange({ customCurrency: custom })}
            onBudgetChange={(budget) => handleStoreChange({ budget })}
            onToggleMotivator={toggleMotivator}
            onToggleValue={toggleValue}
            onNext={() => handleStoreStepNext(step)}
            onBack={() => handleStoreStepBack(step)}
          />
        )
      case 'store-suggestions':
        return (
          <StoreSuggestionsStep
            store={store}
            loading={rewardLoading}
            error={rewardError}
            onRewardAdd={handleRewardAdd}
            onRewardChange={handleRewardChange}
            onRewardRemove={handleRewardRemove}
            onRegenerate={() => runRewardGeneration(store, kids[0]?.name)}
            onBack={() => setStep({ stage: 'store', screen: 'values' })}
            onNext={() => setStep({ stage: 'ready' })}
          />
        )
      case 'ready': {
        const totalHabits = kids.reduce((sum, kid) => sum + kid.habits.core.length + kid.habits.bonus.length, 0)
        const rewardCount = (['quick', 'earned', 'big'] as RewardTier[]).reduce(
          (sum, tier) => sum + store.suggestions[tier].length,
          0,
        )
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl">🚀</div>
            <h2 className="text-4xl font-black text-charcoal">Ready to quest!</h2>
            <p className="text-charcoal-light">
              {kids.length} adventurers · {totalHabits} quests · {rewardCount} rewards
            </p>
            {saveError && <p className="text-sm font-bold text-coral">{saveError}</p>}
            <Button size="lg" className="bg-sage text-charcoal hover:bg-sage-light" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Launch StarqueZZ →'}
            </Button>
          </div>
        )
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-coral-light p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-charcoal-light">StarqueZZ Onboarding</p>
            <h1 className="text-3xl font-black text-charcoal">Conversational setup wizard</h1>
          </div>
          {step.stage !== 'welcome' && (
            <Button variant="ghost" className="text-charcoal" onClick={handleStartOver}>
              ↻ Start Over
            </Button>
          )}
        </div>
        <Card className="bg-white/90 backdrop-blur border-4 border-charcoal">
          <CardContent className="p-6">{renderStep()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
