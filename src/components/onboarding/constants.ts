import type { FamilyValueId, FocusAreaId, StoreMotivatorId } from '@/types/onboarding'

type FocusAreaDef = {
  id: FocusAreaId
  label: string
  description: string
  emoji: string
}

type CurrencyOption = {
  code: string
  label: string
  hint: string
}

type MotivatorOption = {
  id: StoreMotivatorId
  label: string
  description: string
}

type FamilyValueOption = {
  id: FamilyValueId
  label: string
  description: string
}

export const AVATARS = ['🦊', '🦋', '🐻', '🦁', '🐰', '🐼', '🦝', '🐸', '🦄', '🐶']

export const FOCUS_AREAS: FocusAreaDef[] = [
  {
    id: 'learning',
    emoji: '📚',
    label: 'Learning & Focus',
    description: 'Reading, homework, practice',
  },
  {
    id: 'helping',
    emoji: '🧹',
    label: 'Helping at Home',
    description: 'Chores, tidying, responsibilities',
  },
  {
    id: 'self_care',
    emoji: '🪥',
    label: 'Self-Care & Health',
    description: 'Hygiene, sleep, eating well',
  },
  {
    id: 'creativity',
    emoji: '🎨',
    label: 'Creativity & Play',
    description: 'Art, music, imagination',
  },
  {
    id: 'social',
    emoji: '🤝',
    label: 'Social & Kindness',
    description: 'Sharing, manners, empathy',
  },
]

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'IDR', label: '🇮🇩 Rupiah (IDR)', hint: 'Local families in Indonesia' },
  { code: 'USD', label: '🇺🇸 Dollar (USD)', hint: 'North America' },
  { code: 'SGD', label: '🇸🇬 Dollar (SGD)', hint: 'Singapore superstars' },
  { code: 'EUR', label: '🇪🇺 Euro (EUR)', hint: 'Across the EU' },
  { code: 'OTHER', label: '🌍 Other', hint: 'We will still guide you' },
]

export const MOTIVATOR_OPTIONS: MotivatorOption[] = [
  { id: 'screen_time', label: '🎬 Screen time', description: 'Movies, shows, and games' },
  { id: 'board_games', label: '🎲 Game time', description: 'Board games & puzzles' },
  { id: 'treats', label: '🍦 Treats & snacks', description: 'Sweet incentives' },
  { id: 'creative', label: '🎨 Creative labs', description: 'Art, crafts, maker fun' },
  { id: 'books', label: '📚 Books & stories', description: 'Story adventures' },
  { id: 'outdoor', label: '🏃 Outdoor quests', description: 'Bike rides, park time' },
  { id: 'toys', label: '🎁 Small surprises', description: 'Collectibles, plushies' },
  { id: 'family_time', label: '👨‍👩‍👧 Quality time', description: '1:1 adventures' },
]

export const FAMILY_VALUE_OPTIONS: FamilyValueOption[] = [
  { id: 'time_together', label: '⏰ Time together', description: 'Experiences over things' },
  { id: 'earning', label: '🎯 Value of effort', description: 'Work hard → earn rewards' },
  { id: 'independence', label: '🌱 Independence', description: 'Kids choose their own rewards' },
  { id: 'delight', label: '💝 Surprise & delight', description: 'Keep it fun and flexible' },
]

export const AGES = Array.from({ length: 10 }, (_, idx) => 3 + idx)
