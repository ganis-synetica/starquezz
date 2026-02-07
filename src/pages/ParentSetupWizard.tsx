import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type ChildDraft = {
  name: string
  avatar: string
}

type HabitDraft = {
  id: string
  title: string
  description: string
  category: string
  is_core: boolean
}

type RewardDraft = {
  id: string
  title: string
  star_cost: number
}

const AVATARS = ['🦊', '🦋', '🐱', '🐶', '🦁', '🐰', '🐼', '🦝', '🦄', '🐸']

const DEFAULT_HABITS: HabitDraft[] = [
  { id: '1', title: '🎹 Practice Piano', description: '15 minutes', category: 'learning', is_core: true },
  { id: '2', title: '✏️ Writing Exercise', description: 'Practice letters', category: 'learning', is_core: true },
  { id: '3', title: '📖 Reading Time', description: '20 minutes', category: 'learning', is_core: true },
  { id: '4', title: '🛏️ Make Your Bed', description: 'Tidy up in the morning', category: 'helping', is_core: false },
  { id: '5', title: '🧹 Tidy Room', description: 'Keep your space clean', category: 'helping', is_core: false },
  { id: '6', title: '🪥 Brush Teeth', description: 'Morning and night', category: 'self_care', is_core: false },
]

const DEFAULT_REWARDS: RewardDraft[] = [
  { id: '1', title: 'Ice Cream Trip 🍦', star_cost: 10 },
  { id: '2', title: 'Movie Night 🎬', star_cost: 25 },
  { id: '3', title: 'Pizza Party 🍕', star_cost: 50 },
]

type Step = 'welcome' | 'child' | 'habits' | 'rewards' | 'summary'

export function ParentSetupWizard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('welcome')
  const [children, setChildren] = useState<ChildDraft[]>([])
  const [currentChild, setCurrentChild] = useState<ChildDraft>({ name: '', avatar: '🦊' })
  const [habits, setHabits] = useState<HabitDraft[]>(DEFAULT_HABITS)
  const [rewards, setRewards] = useState<RewardDraft[]>(DEFAULT_REWARDS)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // New habit/reward form state
  const [newHabitTitle, setNewHabitTitle] = useState('')
  const [newRewardTitle, setNewRewardTitle] = useState('')
  const [newRewardCost, setNewRewardCost] = useState(10)

  const addChild = () => {
    if (!currentChild.name.trim()) {
      setError("Please enter your child's name")
      return
    }
    setChildren([...children, { ...currentChild }])
    setCurrentChild({ name: '', avatar: '🦊' })
    setStep('habits')
  }

  const addHabit = () => {
    if (!newHabitTitle.trim()) return
    const newHabit: HabitDraft = {
      id: `custom-${Date.now()}`,
      title: newHabitTitle,
      description: '',
      category: 'learning',
      is_core: false,
    }
    setHabits([...habits, newHabit])
    setNewHabitTitle('')
  }

  const removeHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  const toggleHabitCore = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, is_core: !h.is_core } : h))
  }

  const addReward = () => {
    if (!newRewardTitle.trim()) return
    const newReward: RewardDraft = {
      id: `custom-${Date.now()}`,
      title: newRewardTitle,
      star_cost: newRewardCost,
    }
    setRewards([...rewards, newReward])
    setNewRewardTitle('')
    setNewRewardCost(10)
  }

  const removeReward = (id: string) => {
    setRewards(rewards.filter(r => r.id !== id))
  }

  const addAnotherChild = () => {
    setStep('child')
  }

  const saveAndFinish = async () => {
    if (!user) return
    setSaving(true)
    setError(null)

    try {
      // Insert all children
      for (const child of children) {
        const { data: childData, error: childError } = await supabase
          .from('children')
          .insert({
            parent_id: user.id,
            name: child.name,
            avatar: child.avatar,
            pin_hash: null, // No PIN needed
            stars: 0,
          })
          .select('id')
          .single()

        if (childError) throw childError

        // Insert habits for this child
        const habitsToInsert = habits.map(h => ({
          parent_id: user.id,
          child_id: childData.id,
          title: h.title,
          description: h.description || null,
          category: h.category,
          is_core: h.is_core,
          active: true,
        }))

        const { error: habitsError } = await supabase
          .from('habits')
          .insert(habitsToInsert)

        if (habitsError) throw habitsError
      }

      // Insert rewards (shared across all children)
      const rewardsToInsert = rewards.map(r => ({
        parent_id: user.id,
        title: r.title,
        description: null,
        star_cost: r.star_cost,
        active: true,
      }))

      const { error: rewardsError } = await supabase
        .from('rewards')
        .insert(rewardsToInsert)

      if (rewardsError) throw rewardsError

      // Success! Go home
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="text-center">
            <div className="text-8xl mb-6">🌟</div>
            <h1 className="text-4xl font-black mb-4">Welcome to StarqueZZ!</h1>
            <p className="text-xl text-charcoal-light mb-8">
              Let's set up your family in just a few steps
            </p>
            <Button 
              size="lg" 
              className="bg-lavender hover:bg-lavender-light text-xl px-8 py-6"
              onClick={() => setStep('child')}
            >
              Get Started 🚀
            </Button>
          </div>
        )

      case 'child':
        return (
          <div>
            <h1 className="text-3xl font-black mb-2 text-center">Add a Child</h1>
            <p className="text-charcoal-light mb-6 text-center">Who will be questing today?</p>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Child's Name</label>
              <Input
                placeholder="Enter name..."
                value={currentChild.name}
                onChange={(e) => setCurrentChild({ ...currentChild, name: e.target.value })}
                className="border-4 border-charcoal text-xl p-4"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Choose an Avatar</label>
              <div className="grid grid-cols-5 gap-3">
                {AVATARS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setCurrentChild({ ...currentChild, avatar: emoji })}
                    className={`text-4xl p-3 rounded-xl border-4 transition-all ${
                      currentChild.avatar === emoji 
                        ? 'border-lavender bg-lavender-light scale-110' 
                        : 'border-charcoal/20 hover:border-charcoal'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full bg-sage text-charcoal hover:bg-sage-light text-lg"
              onClick={addChild}
            >
              Add {currentChild.name || 'Child'} {currentChild.avatar}
            </Button>
          </div>
        )

      case 'habits':
        return (
          <div>
            <h1 className="text-3xl font-black mb-2 text-center">Daily Quests</h1>
            <p className="text-charcoal-light mb-6 text-center">
              What should {children[children.length - 1]?.name} do each day?
            </p>

            <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto">
              {habits.map(habit => (
                <Card key={habit.id} className="bg-card">
                  <CardContent className="p-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleHabitCore(habit.id)}
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        habit.is_core 
                          ? 'bg-lavender text-white' 
                          : 'bg-muted text-charcoal-light'
                      }`}
                    >
                      {habit.is_core ? 'CORE' : 'BONUS'}
                    </button>
                    <span className="flex-1 font-bold">{habit.title}</span>
                    <button
                      type="button"
                      onClick={() => removeHabit(habit.id)}
                      className="text-coral font-bold"
                    >
                      ✕
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Add custom habit..."
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                className="border-2 border-charcoal"
                onKeyDown={(e) => e.key === 'Enter' && addHabit()}
              />
              <Button onClick={addHabit}>Add</Button>
            </div>

            <Button 
              className="w-full bg-lavender hover:bg-lavender-light text-lg"
              onClick={() => setStep('rewards')}
              disabled={habits.length < 2}
            >
              Next: Rewards →
            </Button>
            {habits.length < 2 && (
              <p className="text-center text-sm text-coral mt-2">Add at least 2 habits</p>
            )}
          </div>
        )

      case 'rewards':
        return (
          <div>
            <h1 className="text-3xl font-black mb-2 text-center">Star Store</h1>
            <p className="text-charcoal-light mb-6 text-center">
              What can {children[children.length - 1]?.name} earn?
            </p>

            <div className="space-y-3 mb-6">
              {rewards.map(reward => (
                <Card key={reward.id} className="bg-card">
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="flex-1 font-bold">{reward.title}</span>
                    <span className="font-black text-gold">⭐ {reward.star_cost}</span>
                    <button
                      type="button"
                      onClick={() => removeReward(reward.id)}
                      className="text-coral font-bold"
                    >
                      ✕
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Reward name..."
                value={newRewardTitle}
                onChange={(e) => setNewRewardTitle(e.target.value)}
                className="border-2 border-charcoal flex-1"
              />
              <Input
                type="number"
                min={1}
                value={newRewardCost}
                onChange={(e) => setNewRewardCost(parseInt(e.target.value) || 1)}
                className="border-2 border-charcoal w-20"
              />
              <Button onClick={addReward}>Add</Button>
            </div>

            <Button 
              className="w-full bg-lavender hover:bg-lavender-light text-lg"
              onClick={() => setStep('summary')}
              disabled={rewards.length < 1}
            >
              Next: Summary →
            </Button>
          </div>
        )

      case 'summary':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-black mb-4">You're All Set!</h1>
            
            <Card className="bg-card mb-6">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Children:</span>
                    <span>{children.map(c => `${c.avatar} ${c.name}`).join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Habits:</span>
                    <span>{habits.length} quests ({habits.filter(h => h.is_core).length} core)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Rewards:</span>
                    <span>{rewards.length} items in store</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-coral-light border-4 border-charcoal p-3 rounded-xl text-sm font-bold text-coral mb-4">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={addAnotherChild}
              >
                + Add Another Child
              </Button>
              <Button 
                className="w-full bg-sage text-charcoal hover:bg-sage-light text-lg"
                onClick={saveAndFinish}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Start Questing! 🚀'}
              </Button>
            </div>
          </div>
        )
    }
  }

  const steps: Step[] = ['welcome', 'child', 'habits', 'rewards', 'summary']
  const currentIndex = steps.indexOf(step)

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-light to-rose-light p-6">
      <div className="max-w-md mx-auto">
        {/* Progress dots */}
        {step !== 'welcome' && (
          <div className="flex justify-center gap-2 mb-8">
            {steps.slice(1).map((s, i) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < currentIndex ? 'bg-lavender' : 
                  i === currentIndex - 1 ? 'bg-lavender w-8' : 'bg-charcoal-light'
                }`}
              />
            ))}
          </div>
        )}

        {/* Back button */}
        {step !== 'welcome' && step !== 'summary' && (
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => {
              const prevIndex = currentIndex - 1
              if (prevIndex >= 0) setStep(steps[prevIndex])
            }}
          >
            ← Back
          </Button>
        )}

        <Card className="bg-card/80 backdrop-blur border-4 border-charcoal shadow-[8px_8px_0px_0px_rgba(74,68,83,0.6)]">
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
