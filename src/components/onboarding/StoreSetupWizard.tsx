import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CURRENCY_OPTIONS, MOTIVATOR_OPTIONS, FAMILY_VALUE_OPTIONS } from './constants'
import type { FamilyValueId, StoreMotivatorId, StorePlan } from '@/types/onboarding'

type StoreSetupWizardProps = {
  screen: 'currency' | 'budget' | 'motivators' | 'values'
  store: StorePlan
  onCurrencyChange: (currency: string) => void
  onCustomCurrencyChange: (custom: string) => void
  onBudgetChange: (budget: number) => void
  onToggleMotivator: (id: StoreMotivatorId) => void
  onToggleValue: (id: FamilyValueId) => void
  onNext: () => void
  onBack?: () => void
}

export function StoreSetupWizard({
  screen,
  store,
  onCurrencyChange,
  onCustomCurrencyChange,
  onBudgetChange,
  onToggleMotivator,
  onToggleValue,
  onBack,
  onNext,
}: StoreSetupWizardProps) {
  const limitMotivators = store.motivators.length >= 3
  const limitValues = store.values.length >= 2

  const renderCurrency = () => (
    <div className="space-y-4">
      <h2 className="text-3xl font-black text-charcoal">Choose the Star Store currency</h2>
      <p className="text-charcoal-light">We'll tailor reward values to match.</p>
      <div className="space-y-3">
        {CURRENCY_OPTIONS.map((option) => (
          <button
            key={option.code}
            type="button"
            onClick={() => onCurrencyChange(option.code)}
            className={`w-full text-left border-4 rounded-2xl p-4 transition-all ${
              store.currency === option.code
                ? 'bg-sage-light border-sage shadow-[6px_6px_0px_0px_rgba(74,68,83,0.6)]'
                : 'bg-white border-charcoal/30 hover:border-charcoal'
            }`}
          >
            <p className="text-xl font-black text-charcoal">{option.label}</p>
            <p className="text-sm font-bold text-charcoal-light">{option.hint}</p>
          </button>
        ))}
      </div>
      {store.currency === 'OTHER' && (
        <Input
          placeholder="Enter your currency name"
          value={store.customCurrency ?? ''}
          onChange={(event) => onCustomCurrencyChange(event.target.value)}
        />
      )}
    </div>
  )

  const renderBudget = () => {
    const displayCurrency =
      store.currency === 'IDR'
        ? 'Rp'
        : store.currency === 'OTHER'
          ? store.customCurrency || '⭐'
          : store.currency || '⭐'

    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-charcoal">What's your monthly reward budget?</h2>
        <p className="text-charcoal-light">We use this to scale small treats vs big adventures.</p>
        <div className="bg-white border-4 border-charcoal rounded-2xl p-4 space-y-3">
          <input
            type="range"
            min={0}
            max={500000}
            step={10000}
            value={store.budget}
            onChange={(event) => onBudgetChange(Number(event.target.value))}
            className="w-full accent-lavender"
          />
          <p className="text-center text-2xl font-black text-charcoal">
            {displayCurrency} {store.budget.toLocaleString()}
          </p>
          <p className="text-xs text-center text-charcoal-light">Max reward ≈ two weeks of earning, so dream big!</p>
        </div>
        <Input
          type="number"
          min={0}
          value={store.budget}
          onChange={(event) => onBudgetChange(Number(event.target.value) || 0)}
          className="text-right"
        />
      </div>
    )
  }

  const renderMotivators = () => (
    <div className="space-y-4">
      <h2 className="text-3xl font-black text-charcoal">What motivates your crew?</h2>
      <p className="text-charcoal-light">Pick their top 3 motivators.</p>
      <div className="grid grid-cols-1 gap-3">
        {MOTIVATOR_OPTIONS.map((option) => {
          const selected = store.motivators.includes(option.id)
          const disabled = limitMotivators && !selected
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggleMotivator(option.id)}
              disabled={disabled}
              className={`text-left border-4 rounded-2xl p-4 transition-all ${
                selected
                  ? 'bg-lavender-light border-lavender shadow-[6px_6px_0px_0px_rgba(74,68,83,0.6)]'
                  : 'bg-white border-charcoal/30 hover:border-charcoal'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <p className="text-xl font-black text-charcoal">{selected ? '✓' : '□'} {option.label}</p>
              <p className="text-sm font-bold text-charcoal-light">{option.description}</p>
            </button>
          )
        })}
      </div>
      {limitMotivators && (
        <p className="text-xs font-bold text-charcoal-light text-center">Locked in! Tap one again to deselect.</p>
      )}
    </div>
  )

  const renderValues = () => (
    <div className="space-y-4">
      <h2 className="text-3xl font-black text-charcoal">What matters to your family?</h2>
      <p className="text-charcoal-light">Pick 1-2 guiding values.</p>
      <div className="grid grid-cols-1 gap-3">
        {FAMILY_VALUE_OPTIONS.map((option) => {
          const selected = store.values.includes(option.id)
          const disabled = limitValues && !selected
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggleValue(option.id)}
              disabled={disabled}
              className={`text-left border-4 rounded-2xl p-4 transition-all ${
                selected
                  ? 'bg-sage-light border-sage shadow-[6px_6px_0px_0px_rgba(74,68,83,0.6)]'
                  : 'bg-white border-charcoal/30 hover:border-charcoal'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <p className="text-xl font-black text-charcoal">{selected ? '●' : '○'} {option.label}</p>
              <p className="text-sm font-bold text-charcoal-light">{option.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )

  let stepContent: ReactNode | null = null
  switch (screen) {
    case 'currency':
      stepContent = renderCurrency()
      break
    case 'budget':
      stepContent = renderBudget()
      break
    case 'motivators':
      stepContent = renderMotivators()
      break
    case 'values':
      stepContent = renderValues()
      break
  }

  const canContinue =
    (screen === 'currency' && (!!store.currency && (store.currency !== 'OTHER' || (store.customCurrency ?? '').trim()))) ||
    (screen === 'budget' && store.budget >= 0) ||
    (screen === 'motivators' && store.motivators.length > 0) ||
    (screen === 'values' && store.values.length > 0)

  return (
    <div className="space-y-6">
      {stepContent}
      <div className="flex gap-3 pt-4">
        {onBack && (
          <Button variant="outline" className="flex-1" onClick={onBack}>
            ← Back
          </Button>
        )}
        <Button className="flex-1 bg-lavender hover:bg-lavender-light" onClick={onNext} disabled={!canContinue}>
          Next →
        </Button>
      </div>
    </div>
  )
}
