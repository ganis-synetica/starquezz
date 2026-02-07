import { supabase } from '@/lib/supabase'
import type { Reward } from '@/types'

export async function listRewardsForParent(parentId: string) {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('parent_id', parentId)
    .eq('active', true)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Reward[]
}

export async function listRewardsForChild(parentId: string) {
  return listRewardsForParent(parentId)
}

