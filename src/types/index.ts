export interface Parent {
  id: string
  email: string
  created_at: string
}

export interface Child {
  id: string
  parent_id: string
  name: string
  pin_hash: string
  avatar: string
  theme?: ThemeConfig
  stars: number
  created_at: string
}

export interface Habit {
  id: string
  parent_id: string
  child_id: string
  title: string
  description?: string
  category: 'learning' | 'helping' | 'self_care' | 'growth'
  is_core: boolean
  active?: boolean
  created_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  child_id: string
  completed_at: string
  approved_at?: string
  approved_by?: 'parent' | 'auto'
  rejected_at?: string
  rejection_reason?: string
  stars_earned: number
  completed_date?: string
}

export interface Reward {
  id: string
  parent_id: string
  title: string
  description?: string
  star_cost: number
  image_url?: string
  created_at: string
}

export interface Redemption {
  id: string
  child_id: string
  reward_id: string
  stars_spent: number
  status: 'pending' | 'fulfilled' | 'cancelled' | 'expired'
  created_at: string
  fulfilled_at?: string
}

export interface ThemeConfig {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
}

export interface WeeklyStreak {
  child_id: string
  week_start: string
  core_days_completed: number
  total_stars: number
  bonus_stars: number
}
