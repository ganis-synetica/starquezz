import { supabase } from '@/lib/supabase'
import type { Habit, HabitCompletion } from '@/types'

export type CompletionStatus = 'pending' | 'approved' | 'rejected'

export type CompletionRow = HabitCompletion & {
  completed_date: string
}

export type PendingCompletion = CompletionRow & {
  habits: Pick<Habit, 'id' | 'title' | 'is_core' | 'child_id'>
}

export async function listCompletionsForChildOnDate(childId: string, dateISO: string) {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('child_id', childId)
    .eq('completed_date', dateISO)

  if (error) throw error
  return data as CompletionRow[]
}

export async function createCompletion(habitId: string, childId: string, dateISO: string) {
  const { data, error } = await supabase
    .from('habit_completions')
    .insert({ habit_id: habitId, child_id: childId, completed_date: dateISO })
    .select('*')
    .single()

  if (error) throw error
  return data as CompletionRow
}

export async function listPendingApprovals() {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('*, habits!inner(id,title,is_core,child_id)')
    .is('approved_at', null)
    .is('rejected_at', null)
    .order('completed_at', { ascending: true })

  if (error) throw error

  const rows = data as PendingCompletion[]
  return rows.filter((row) => row.habits && (row.habits as { child_id: string }).child_id)
}

export async function approveCompletion(completionId: string) {
  const { data, error } = await supabase
    .from('habit_completions')
    .update({
      approved_at: new Date().toISOString(),
      approved_by: 'parent',
    })
    .eq('id', completionId)
    .select('*, habits!inner(id,title,is_core,child_id)')
    .single()

  if (error) throw error
  return data as PendingCompletion
}

export async function rejectCompletion(completionId: string, reason: string) {
  const { data, error } = await supabase
    .from('habit_completions')
    .update({
      rejected_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq('id', completionId)
    .select('*, habits!inner(id,title,is_core,child_id)')
    .single()

  if (error) throw error
  return data as PendingCompletion
}

export async function awardStarsIfNeeded(childId: string, dateISO: string) {
  const { data: habitsData, error: habitsError } = await supabase
    .from('habits')
    .select('id,is_core')
    .eq('child_id', childId)
    .eq('active', true)

  if (habitsError) throw habitsError

  const habits = habitsData as Array<Pick<Habit, 'id' | 'is_core'>>
  const coreHabitIds = new Set(habits.filter((h) => h.is_core).map((h) => h.id))
  const bonusHabitIds = new Set(habits.filter((h) => !h.is_core).map((h) => h.id))

  const { data: completionsData, error: completionsError } = await supabase
    .from('habit_completions')
    .select('id,habit_id,approved_at,rejected_at,stars_earned')
    .eq('child_id', childId)
    .eq('completed_date', dateISO)

  if (completionsError) throw completionsError

  const completions = completionsData as Array<{
    id: string
    habit_id: string
    approved_at: string | null
    rejected_at: string | null
    stars_earned: number
  }>

  const approved = completions.filter((c) => c.approved_at && !c.rejected_at)
  const approvedHabitIds = new Set(approved.map((c) => c.habit_id))

  const allCoresApproved = coreHabitIds.size > 0 && Array.from(coreHabitIds).every((id) => approvedHabitIds.has(id))

  // Calculate what stars SHOULD be for each completion
  // Star logic:
  // - All cores approved = 1 star total (awarded to first core)
  // - Each bonus = 1 star each (only if all cores are approved)
  const targetStars = new Map<string, number>()
  
  // First, calculate target stars for all approved completions
  let coreStarAssigned = false
  for (const c of approved) {
    const isCore = coreHabitIds.has(c.habit_id)
    const isBonus = bonusHabitIds.has(c.habit_id)

    if (isCore) {
      // First core gets 1 star if all cores approved, rest get 0
      if (allCoresApproved && !coreStarAssigned) {
        targetStars.set(c.id, 1)
        coreStarAssigned = true
      } else {
        targetStars.set(c.id, 0)
      }
    } else if (isBonus) {
      // Each bonus gets 1 star if all cores approved
      targetStars.set(c.id, allCoresApproved ? 1 : 0)
    }
  }

  // Update completions that have wrong star values
  for (const c of approved) {
    const target = targetStars.get(c.id) ?? 0
    if (c.stars_earned !== target) {
      const { error: updateError } = await supabase
        .from('habit_completions')
        .update({ stars_earned: target })
        .eq('id', c.id)

      if (updateError) throw updateError
    }
  }

  // Calculate day total
  const dayStars = Array.from(targetStars.values()).reduce((sum, s) => sum + s, 0)

  // Update child's total stars from ALL approved completions
  const { data: allApprovedData, error: allApprovedError } = await supabase
    .from('habit_completions')
    .select('stars_earned')
    .eq('child_id', childId)
    .not('approved_at', 'is', null)
    .is('rejected_at', null)

  if (allApprovedError) throw allApprovedError

  const approvedTotal = (allApprovedData as Array<{ stars_earned: number }>).reduce((sum, r) => sum + r.stars_earned, 0)

  const { data: childData, error: childError } = await supabase.from('children').select('stars').eq('id', childId).single()
  if (childError) throw childError
  const currentStars = (childData as { stars: number }).stars

  if (currentStars !== approvedTotal) {
    const { error: updateChildError } = await supabase.from('children').update({ stars: approvedTotal }).eq('id', childId)
    if (updateChildError) throw updateChildError
  }

  return { dayStars, totalStars: approvedTotal }
}
