import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { RewardIdea, RewardTier, StorePlan } from '@/types/onboarding'

const TIER_LABELS: Record<RewardTier, string> = {
  quick: 'Quick Wins (5-15 ⭐)',
  earned: 'Earned Rewards (20-50 ⭐)',
  big: 'Big Adventures (75+ ⭐)',
}

type StoreSuggestionsStepProps = {
  store: StorePlan
  loading: boolean
  error: string | null
  onRewardChange: (tier: RewardTier, index: number, reward: RewardIdea) => void
  onRewardAdd: (tier: RewardTier) => void
  onRewardRemove: (tier: RewardTier, index: number) => void
  onRegenerate: () => void
  onNext: () => void
  onBack: () => void
}

function RewardEditor({
  reward,
  onChange,
  onRemove,
}: {
  reward: RewardIdea
  onChange: (updates: RewardIdea) => void
  onRemove: () => void
}) {
  return (
    <Card className="bg-white border-charcoal/30">
      <CardContent className="space-y-3 p-4">
        <Input
          value={reward.title}
          onChange={(event) => onChange({ ...reward, title: event.target.value })}
        />
        <textarea
          value={reward.description ?? ''}
          onChange={(event) => onChange({ ...reward, description: event.target.value })}
          className="w-full min-h-[60px] border-4 border-charcoal rounded-md p-3 text-sm font-bold text-charcoal resize-none bg-white shadow-[4px_4px_0px_0px_rgba(74,68,83,0.6)]"
          placeholder="Add why this reward is special"
        />
        <div className="flex items-center gap-3">
          <span className="font-black text-gold">⭐</span>
          <Input
            type="number"
            min={1}
            value={reward.starCost}
            onChange={(event) => onChange({ ...reward, starCost: Math.max(1, Number(event.target.value) || 1) })}
            className="w-32"
          />
          <button type="button" onClick={onRemove} className="text-coral font-black text-xl ml-auto">
            ×
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export function StoreSuggestionsStep({
  store,
  loading,
  error,
  onRewardChange,
  onRewardAdd,
  onRewardRemove,
  onRegenerate,
  onNext,
  onBack,
}: StoreSuggestionsStepProps) {
  const helper =
    store.rewardSource === 'ai'
      ? '✨ Musang AI prioritized family time & growth. Tweak anything!'
      : 'Here is a wholesome ladder of rewards by default.'

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-charcoal-light">Star Store preview</p>
        <h2 className="text-3xl font-black text-charcoal">Here is your Star Store</h2>
        <p className="text-charcoal-light">Currency: {store.currency}{store.customCurrency ? ` (${store.customCurrency})` : ''}</p>
      </div>

      {loading && (
        <div className="bg-white border-4 border-charcoal rounded-2xl p-4 text-center font-bold">
          Dreaming up stellar rewards...
        </div>
      )}

      {!loading && (
        <>
          <p className="text-sm font-bold text-sage">{helper}</p>
          {error && <p className="text-sm font-bold text-coral">{error}</p>}
          {(Object.keys(TIER_LABELS) as RewardTier[]).map((tier) => (
            <section key={tier} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-charcoal">{TIER_LABELS[tier]}</h3>
                <Button variant="outline" size="sm" onClick={() => onRewardAdd(tier)}>
                  + Add
                </Button>
              </div>
              {store.suggestions[tier].map((reward, index) => (
                <RewardEditor
                  key={reward.id}
                  reward={reward}
                  onChange={(updates) => onRewardChange(tier, index, updates)}
                  onRemove={() => onRewardRemove(tier, index)}
                />
              ))}
            </section>
          ))}
        </>
      )}

      <div className="flex flex-wrap gap-3 pt-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="outline" onClick={onRegenerate} disabled={loading}>
          ↻ Regenerate store
        </Button>
        <Button className="flex-1 bg-sage text-charcoal hover:bg-sage-light" onClick={onNext} disabled={loading}>
          Save & continue →
        </Button>
      </div>
    </div>
  )
}
