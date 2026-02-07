import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AVATARS, AGES } from './constants'
import type { KidProfile } from '@/types/onboarding'

type KidsSetupStepProps = {
  kidIndex: number
  totalKids: number
  kid: KidProfile
  onChange: (kid: KidProfile) => void
  onNext: () => void
  onBack?: () => void
}

export function KidsSetupStep({ kidIndex, totalKids, kid, onChange, onNext, onBack }: KidsSetupStepProps) {
  const canContinue = Boolean(kid.name.trim() && kid.age)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-charcoal-light">Adventurer {kidIndex + 1} of {totalKids}</p>
        <h2 className="text-3xl font-black text-charcoal">Tell us about Adventurer #{kidIndex + 1}</h2>
        <p className="text-charcoal-light">We'll use this to customize quests.</p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-charcoal-light">Name</label>
        <Input
          placeholder="Enter their quest name..."
          value={kid.name}
          onChange={(event) => onChange({ ...kid, name: event.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-charcoal-light">Age</label>
        <div className="relative">
          <select
            value={kid.age ?? ''}
            onChange={(event) => onChange({ ...kid, age: event.target.value ? Number(event.target.value) : null })}
            className="w-full h-12 border-4 border-charcoal rounded-md px-4 text-lg font-bold bg-white shadow-[4px_4px_0px_0px_rgba(74,68,83,0.6)] focus:outline-none focus:ring-2 focus:ring-lavender"
          >
            <option value="" disabled>
              Select age (3-12)
            </option>
            {AGES.map((age) => (
              <option key={age} value={age}>
                {age} years old
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-charcoal-light">Pick an avatar</label>
        <div className="grid grid-cols-5 gap-3">
          {AVATARS.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => onChange({ ...kid, avatar })}
              className={`h-16 text-3xl rounded-xl border-4 transition-all ${
                kid.avatar === avatar
                  ? 'bg-lavender-light border-lavender scale-105'
                  : 'bg-white border-charcoal/30 hover:border-charcoal'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {onBack && (
          <Button variant="outline" className="flex-1" onClick={onBack}>
            ← Back
          </Button>
        )}
        <Button className="flex-1 bg-sage text-charcoal hover:bg-sage-light" disabled={!canContinue} onClick={onNext}>
          Next →
        </Button>
      </div>
    </div>
  )
}
