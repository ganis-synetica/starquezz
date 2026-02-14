import { supabase } from '@/lib/supabase'
import type { Redemption } from '@/types'

export async function createRedemption(
  childId: string,
  rewardId: string,
  starCost: number
): Promise<Redemption> {
  // Start a transaction-like operation
  // 1. Check child has enough stars
  const { data: child, error: childError } = await supabase
    .from('children')
    .select('stars')
    .eq('id', childId)
    .single()

  if (childError) throw childError
  if (!child || child.stars < starCost) {
    throw new Error('Not enough stars!')
  }

  // 2. Deduct stars from child
  const { error: updateError } = await supabase
    .from('children')
    .update({ stars: child.stars - starCost })
    .eq('id', childId)

  if (updateError) throw updateError

  // 3. Create redemption record
  const { data, error } = await supabase
    .from('redemptions')
    .insert({
      child_id: childId,
      reward_id: rewardId,
      stars_spent: starCost,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    // Rollback stars if redemption fails
    await supabase
      .from('children')
      .update({ stars: child.stars })
      .eq('id', childId)
    throw error
  }

  return data as Redemption
}

export async function listRedemptionsForChild(childId: string): Promise<Redemption[]> {
  const { data, error } = await supabase
    .from('redemptions')
    .select('*, reward:rewards(*)')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Redemption[]
}

export async function fulfillRedemption(redemptionId: string): Promise<void> {
  const { error } = await supabase
    .from('redemptions')
    .update({ 
      status: 'fulfilled',
      fulfilled_at: new Date().toISOString()
    })
    .eq('id', redemptionId)

  if (error) throw error
}
