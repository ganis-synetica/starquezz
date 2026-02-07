export type FocusAreaId = 'learning' | 'helping' | 'self_care' | 'creativity' | 'social'

export type HabitIdea = {
  id: string
  title: string
  description: string
  type: 'core' | 'bonus'
}

export type KidProfile = {
  id: string
  name: string
  age: number | null
  avatar: string
  notes: string
  focusAreas: FocusAreaId[]
  habits: {
    core: HabitIdea[]
    bonus: HabitIdea[]
  }
  habitSource?: 'ai' | 'fallback'
}

export type StoreMotivatorId =
  | 'screen_time'
  | 'board_games'
  | 'treats'
  | 'creative'
  | 'books'
  | 'outdoor'
  | 'toys'
  | 'family_time'

export type FamilyValueId = 'time_together' | 'earning' | 'independence' | 'delight'

export type RewardTier = 'quick' | 'earned' | 'big'

export type RewardIdea = {
  id: string
  title: string
  starCost: number
  tier: RewardTier
  description?: string
}

export type StorePlan = {
  currency: string
  customCurrency?: string
  budget: number
  motivators: StoreMotivatorId[]
  values: FamilyValueId[]
  suggestions: {
    quick: RewardIdea[]
    earned: RewardIdea[]
    big: RewardIdea[]
  }
  rewardSource?: 'ai' | 'fallback'
}

export type OnboardingStep =
  | { stage: 'welcome' }
  | { stage: 'kid-count' }
  | { stage: 'kid-details'; index: number }
  | { stage: 'focus'; index: number }
  | { stage: 'habits'; index: number }
  | { stage: 'store'; screen: 'currency' | 'budget' | 'motivators' | 'values' }
  | { stage: 'store-suggestions' }
  | { stage: 'ready' }
