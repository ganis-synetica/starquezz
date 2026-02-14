import { supabase } from '@/lib/supabase'
import type { Redemption, Reward, Child } from '@/types'

export type RedemptionWithDetails = Redemption & {
  reward: Reward
  child: Pick<Child, 'id' | 'name' | 'avatar'>
}

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

export async function listRedemptionsForChild(childId: string): Promise<RedemptionWithDetails[]> {
  const { data, error } = await supabase
    .from('redemptions')
    .select('*, reward:rewards(*), child:children(id, name, avatar)')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as RedemptionWithDetails[]
}

export async function listPendingRedemptions(): Promise<RedemptionWithDetails[]> {
  const { data, error } = await supabase
    .from('redemptions')
    .select('*, reward:rewards(*), child:children(id, name, avatar)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as RedemptionWithDetails[]
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

export async function cancelRedemption(redemptionId: string): Promise<void> {
  // 1. Get the redemption details to know how many stars to refund
  const { data: redemption, error: fetchError } = await supabase
    .from('redemptions')
    .select('child_id, stars_spent, status')
    .eq('id', redemptionId)
    .single()

  if (fetchError) throw fetchError
  if (!redemption) throw new Error('Redemption not found')
  if (redemption.status !== 'pending') {
    throw new Error('Can only cancel pending redemptions')
  }

  // 2. Get current child stars
  const { data: child, error: childError } = await supabase
    .from('children')
    .select('stars')
    .eq('id', redemption.child_id)
    .single()

  if (childError) throw childError
  if (!child) throw new Error('Child not found')

  // 3. Refund stars to child
  const { error: refundError } = await supabase
    .from('children')
    .update({ stars: child.stars + redemption.stars_spent })
    .eq('id', redemption.child_id)

  if (refundError) throw refundError

  // 4. Update redemption status
  const { error: updateError } = await supabase
    .from('redemptions')
    .update({ status: 'cancelled' })
    .eq('id', redemptionId)

  if (updateError) {
    // Rollback stars if status update fails
    await supabase
      .from('children')
      .update({ stars: child.stars })
      .eq('id', redemption.child_id)
    throw updateError
  }
}
