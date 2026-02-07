import { supabase } from '@/lib/supabase'
import type { Habit } from '@/types'

type HabitInsert = Pick<Habit, 'parent_id' | 'child_id' | 'title' | 'description' | 'category' | 'is_core'>
type HabitUpdate = Partial<Pick<Habit, 'title' | 'description' | 'category' | 'is_core'>> & { active?: boolean }

export async function listHabitsForChild(childId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('child_id', childId)
    .eq('active', true)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Habit[]
}

export async function createHabit(input: HabitInsert) {
  const { data, error } = await supabase.from('habits').insert(input).select('*').single()
  if (error) throw error
  return data as Habit
}

export async function updateHabit(habitId: string, updates: HabitUpdate) {
  const { data, error } = await supabase.from('habits').update(updates).eq('id', habitId).select('*').single()
  if (error) throw error
  return data as Habit
}

export async function disableHabit(habitId: string) {
  await updateHabit(habitId, { active: false })
}

