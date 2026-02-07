import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FOCUS_AREAS } from './constants'
import type { HabitIdea, KidProfile } from '@/types/onboarding'

function HabitEditor({
  habit,
  onChange,
  onRemove,
}: {
  habit: HabitIdea
  onChange: (updates: HabitIdea) => void
  onRemove: () => void
}) {
  return (
    <Card className="bg-white border-charcoal/30">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <Input
            value={habit.title}
            onChange={(event) => onChange({ ...habit, title: event.target.value })}
            className="flex-1"
          />
          <button
            type="button"
            onClick={onRemove}
            className="text-coral font-black text-xl"
            aria-label="Remove habit"
          >
            ×
          </button>
        </div>
        <textarea
          value={habit.description}
          onChange={(event) => onChange({ ...habit, description: event.target.value })}
          className="w-full min-h-[60px] border-4 border-charcoal rounded-md p-3 text-sm font-bold text-charcoal resize-none bg-white shadow-[4px_4px_0px_0px_rgba(74,68,83,0.6)]"
          placeholder="Add an optional reminder (time of day, etc.)"
        />
      </CardContent>
    </Card>
  )
}

type HabitSuggestionsStepProps = {
  kid: KidProfile
  loading: boolean
  error: string | null
  source?: 'ai' | 'fallback'
  onHabitChange: (type: 'core' | 'bonus', index: number, habit: HabitIdea) => void
  onHabitAdd: (type: 'core' | 'bonus') => void
  onHabitRemove: (type: 'core' | 'bonus', index: number) => void
  onRegenerate: () => void
  onNext: () => void
  onBack: () => void
}

export function HabitSuggestionsStep({
  kid,
  loading,
  error,
  source,
  onHabitChange,
  onHabitAdd,
  onHabitRemove,
  onRegenerate,
  onNext,
  onBack,
}: HabitSuggestionsStepProps) {
  const disabledNext = kid.habits.core.length === 0

  const helper =
    source === 'ai'
      ? '✨ Powered by Musang AI suggestions. Edit anything you like.'
      : 'Using our curated library while we wait for the AI.'

  const focusLabels = kid.focusAreas
    .map((id) => FOCUS_AREAS.find((area) => area.id === id)?.label ?? id)
    .join(', ')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-charcoal-light">Quest ideas</p>
        <h2 className="text-3xl font-black text-charcoal">Here is what we suggest for {kid.name || 'your kid'}</h2>
        <p className="text-charcoal-light">
          Age {kid.age ?? '—'} · Focus: {kid.focusAreas.length ? focusLabels : 'balanced'}
        </p>
      </div>

      {loading && (
        <div className="bg-white border-4 border-charcoal rounded-2xl p-4 text-center font-bold">
          Generating cozy quests...
        </div>
      )}

      {!loading && (
        <>
          <p className="text-sm font-bold text-sage">{helper}</p>

          {error && (
            <p className="text-sm font-bold text-coral">{error}</p>
          )}

          <section className="space-y-3">
            <h3 className="text-2xl font-black text-charcoal">Core Habits (max 3)</h3>
            {kid.habits.core.map((habit, index) => (
              <HabitEditor
                key={habit.id}
                habit={habit}
                onChange={(updates) => onHabitChange('core', index, updates)}
                onRemove={() => onHabitRemove('core', index)}
              />
            ))}
            {kid.habits.core.length < 3 && (
              <Button variant="outline" onClick={() => onHabitAdd('core')}>
                + Add core habit
              </Button>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-2xl font-black text-charcoal">Bonus Habits (fun extras)</h3>
            {kid.habits.bonus.map((habit, index) => (
              <HabitEditor
                key={habit.id}
                habit={habit}
                onChange={(updates) => onHabitChange('bonus', index, updates)}
                onRemove={() => onHabitRemove('bonus', index)}
              />
            ))}
            {kid.habits.bonus.length < 5 && (
              <Button variant="outline" onClick={() => onHabitAdd('bonus')}>
                + Add bonus habit
              </Button>
            )}
          </section>
        </>
      )}

      <div className="flex flex-wrap gap-3 pt-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="outline" onClick={onRegenerate} disabled={loading}>
          ↻ Regenerate
        </Button>
        <Button className="flex-1 bg-lavender hover:bg-lavender-light" disabled={disabledNext || loading} onClick={onNext}>
          Looks good →
        </Button>
      </div>
    </div>
  )
}
