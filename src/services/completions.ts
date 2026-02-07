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

  const updates: Array<{ id: string; stars_earned: number }> = []

  for (const c of approved) {
    const isCore = coreHabitIds.has(c.habit_id)
    const isBonus = bonusHabitIds.has(c.habit_id)

    let nextStars = c.stars_earned
    if (isCore) {
      nextStars = 0
    } else if (isBonus) {
      nextStars = allCoresApproved ? 1 : 0
    }

    if (nextStars !== c.stars_earned) updates.push({ id: c.id, stars_earned: nextStars })
  }

  const alreadyHasCoreAward = approved.some((c) => coreHabitIds.has(c.habit_id) && c.stars_earned === 1)
  if (allCoresApproved && !alreadyHasCoreAward) {
    const firstCore = approved.find((c) => coreHabitIds.has(c.habit_id))
    if (firstCore) updates.push({ id: firstCore.id, stars_earned: 1 })
  }

  if (updates.length > 0) {
    for (const upd of updates) {
      const { error: updateError } = await supabase
        .from('habit_completions')
        .update({ stars_earned: upd.stars_earned })
        .eq('id', upd.id)

      if (updateError) throw updateError
    }
  }

  const { data: totalData, error: totalError } = await supabase
    .from('habit_completions')
    .select('stars_earned')
    .eq('child_id', childId)
    .eq('completed_date', dateISO)
    .not('approved_at', 'is', null)
    .is('rejected_at', null)

  if (totalError) throw totalError
  const dayStars = (totalData as Array<{ stars_earned: number }>).reduce((sum, r) => sum + r.stars_earned, 0)

  const { data: childData, error: childError } = await supabase.from('children').select('stars').eq('id', childId).single()
  if (childError) throw childError
  const currentStars = (childData as { stars: number }).stars

  const { data: allApprovedData, error: allApprovedError } = await supabase
    .from('habit_completions')
    .select('stars_earned,completed_date')
    .eq('child_id', childId)
    .not('approved_at', 'is', null)
    .is('rejected_at', null)

  if (allApprovedError) throw allApprovedError

  const approvedTotal = (allApprovedData as Array<{ stars_earned: number }>).reduce((sum, r) => sum + r.stars_earned, 0)

  if (currentStars !== approvedTotal) {
    const { error: updateChildError } = await supabase.from('children').update({ stars: approvedTotal }).eq('id', childId)
    if (updateChildError) throw updateChildError
  }

  return { dayStars, totalStars: approvedTotal }
}
