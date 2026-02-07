import { Button } from '@/components/ui/button'
import { FOCUS_AREAS } from './constants'
import type { FocusAreaId, KidProfile } from '@/types/onboarding'

type FocusAreasStepProps = {
  kid: KidProfile
  onToggle: (area: FocusAreaId) => void
  onNext: () => void
  onBack: () => void
}

export function FocusAreasStep({ kid, onToggle, onNext, onBack }: FocusAreasStepProps) {
  const limitReached = kid.focusAreas.length >= 3

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-charcoal-light">Adventurer focus</p>
        <h2 className="text-3xl font-black text-charcoal">What should {kid.name || 'this hero'} work on?</h2>
        <p className="text-charcoal-light">Pick up to 3 areas.</p>
      </div>

      <div className="space-y-3">
        {FOCUS_AREAS.map((area) => {
          const selected = kid.focusAreas.includes(area.id)
          const disabled = limitReached && !selected
          return (
            <button
              key={area.id}
              type="button"
              onClick={() => onToggle(area.id)}
              disabled={disabled}
              className={`w-full text-left border-4 rounded-2xl p-4 transition-all ${
                selected
                  ? 'bg-lavender-light border-lavender shadow-[6px_6px_0px_0px_rgba(74,68,83,0.6)]'
                  : 'bg-white border-charcoal/30 hover:border-charcoal'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-black text-charcoal">
                    {selected ? '✓' : '□'} {area.emoji} {area.label}
                  </p>
                  <p className="text-sm font-bold text-charcoal-light">{area.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {limitReached && (
        <p className="text-xs font-bold text-charcoal-light text-center">Max 3 areas per kid to keep things achievable.</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          ← Back
        </Button>
        <Button
          className="flex-1 bg-lavender hover:bg-lavender-light"
          onClick={onNext}
          disabled={kid.focusAreas.length === 0}
        >
          Generate habits →
        </Button>
      </div>
    </div>
  )
}
