import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { awardStarsIfNeeded, approveCompletion, listPendingApprovals, rejectCompletion } from '@/services/completions'
import { listPendingRedemptions, fulfillRedemption, cancelRedemption, type RedemptionWithDetails } from '@/services/redemptions'
import type { Child, Reward } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Pencil, Trash2, Plus, Check, X, Gift, ShoppingBag } from 'lucide-react'

type PendingRow = Awaited<ReturnType<typeof listPendingApprovals>>[number]
type ChildWithStars = Pick<Child, 'id' | 'name' | 'avatar' | 'stars'>

function dateISOFromTimestamp(ts: string) {
  const d = new Date(ts)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

type Tab = 'approvals' | 'rewards' | 'children'

const AVATARS = ['🦊', '🦋', '🐱', '🐶', '🦁', '🐰', '🐼', '🦝', '🦄', '🐸']

export function ApprovalQueue() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('approvals')
  const [rows, setRows] = useState<PendingRow[]>([])
  const [redemptions, setRedemptions] = useState<RedemptionWithDetails[]>([])
  const [childrenById, setChildrenById] = useState<Record<string, ChildWithStars>>({})
  const [children, setChildren] = useState<ChildWithStars[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  // Reward editing
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCost, setEditCost] = useState(10)

  // New reward form
  const [showAddReward, setShowAddReward] = useState(false)
  const [newRewardTitle, setNewRewardTitle] = useState('')
  const [newRewardCost, setNewRewardCost] = useState(10)

  // Child editing
  const [editingChildId, setEditingChildId] = useState<string | null>(null)
  const [editChildName, setEditChildName] = useState('')
  const [editChildAvatar, setEditChildAvatar] = useState('')

  // Add stars
  const [addStarsChildId, setAddStarsChildId] = useState<string | null>(null)
  const [addStarsAmount, setAddStarsAmount] = useState(10)

  const parentId = user?.id

  useEffect(() => {
    if (!parentId) return

    void (async () => {
      setError(null)
      const [pending, pendingRedemptions, childrenRes, rewardsRes] = await Promise.all([
        listPendingApprovals(),
        listPendingRedemptions(),
        supabase.from('children').select('id,name,avatar,stars'),
        supabase.from('rewards').select('*').eq('parent_id', parentId).eq('active', true).order('star_cost'),
      ])

      if (childrenRes.error) throw childrenRes.error
      if (rewardsRes.error) throw rewardsRes.error

      const childList = (childrenRes.data ?? []) as ChildWithStars[]
      const map: Record<string, ChildWithStars> = {}
      for (const c of childList) {
        map[c.id] = c
      }
      setChildrenById(map)
      setChildren(childList)
      setRows(pending)
      setRedemptions(pendingRedemptions)
      setRewards((rewardsRes.data ?? []) as Reward[])
    })().catch((err) => {
      setError(err instanceof Error ? err.message : 'Could not load data.')
    })
  }, [parentId])

  const habitCount = rows.length
  const redemptionCount = redemptions.length
  const totalCount = habitCount + redemptionCount

  const onFulfillRedemption = async (redemption: RedemptionWithDetails) => {
    setBusyId(redemption.id)
    setError(null)
    try {
      await fulfillRedemption(redemption.id)
      setRedemptions((prev) => prev.filter((r) => r.id !== redemption.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fulfill failed.')
    } finally {
      setBusyId(null)
    }
  }

  const onCancelRedemption = async (redemption: RedemptionWithDetails) => {
    if (!window.confirm(`Cancel this reward? ${redemption.stars_spent} stars will be refunded.`)) return
    setBusyId(redemption.id)
    setError(null)
    try {
      await cancelRedemption(redemption.id)
      setRedemptions((prev) => prev.filter((r) => r.id !== redemption.id))
      // Update child's stars in local state
      const childId = redemption.child_id
      setChildren((prev) =>
        prev.map((c) =>
          c.id === childId ? { ...c, stars: c.stars + redemption.stars_spent } : c
        )
      )
      setChildrenById((prev) => {
        if (prev[childId]) {
          return {
            ...prev,
            [childId]: { ...prev[childId], stars: prev[childId].stars + redemption.stars_spent },
          }
        }
        return prev
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed.')
    } finally {
      setBusyId(null)
    }
  }

  const onApprove = async (row: PendingRow) => {
    setBusyId(row.id)
    setError(null)
    try {
      const updated = await approveCompletion(row.id)
      const childId = updated.habits.child_id
      const dateISO = dateISOFromTimestamp(updated.completed_at)
      await awardStarsIfNeeded(childId, dateISO)
      setRows((prev) => prev.filter((r) => r.id !== row.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approve failed.')
    } finally {
      setBusyId(null)
    }
  }

  const onReject = async (row: PendingRow) => {
    const reason = window.prompt('Why reject this quest? (optional)') ?? ''
    setBusyId(row.id)
    setError(null)
    try {
      await rejectCompletion(row.id, reason)
      setRows((prev) => prev.filter((r) => r.id !== row.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reject failed.')
    } finally {
      setBusyId(null)
    }
  }

  // Reward CRUD
  const startEditReward = (reward: Reward) => {
    setEditingRewardId(reward.id)
    setEditTitle(reward.title)
    setEditCost(reward.star_cost)
  }

  const cancelEditReward = () => {
    setEditingRewardId(null)
    setEditTitle('')
    setEditCost(10)
  }

  const saveReward = async (rewardId: string) => {
    if (!editTitle.trim()) return
    setError(null)
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ title: editTitle.trim(), star_cost: editCost })
        .eq('id', rewardId)
      if (error) throw error
      setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, title: editTitle.trim(), star_cost: editCost } : r))
      cancelEditReward()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update reward.')
    }
  }

  const deleteReward = async (rewardId: string) => {
    if (!window.confirm('Delete this reward?')) return
    setError(null)
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ active: false })
        .eq('id', rewardId)
      if (error) throw error
      setRewards(prev => prev.filter(r => r.id !== rewardId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete reward.')
    }
  }

  const addReward = async () => {
    if (!newRewardTitle.trim() || !parentId) return
    setError(null)
    try {
      const { data, error } = await supabase
        .from('rewards')
        .insert({
          parent_id: parentId,
          title: newRewardTitle.trim(),
          star_cost: newRewardCost,
          active: true,
        })
        .select('*')
        .single()
      if (error) throw error
      setRewards(prev => [...prev, data as Reward].sort((a, b) => a.star_cost - b.star_cost))
      setNewRewardTitle('')
      setNewRewardCost(10)
      setShowAddReward(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add reward.')
    }
  }

  // Child CRUD
  const startEditChild = (child: ChildWithStars) => {
    setEditingChildId(child.id)
    setEditChildName(child.name)
    setEditChildAvatar(child.avatar || '🦊')
  }

  const cancelEditChild = () => {
    setEditingChildId(null)
    setEditChildName('')
    setEditChildAvatar('')
  }

  const saveChild = async (childId: string) => {
    if (!editChildName.trim()) return
    setError(null)
    try {
      const { error } = await supabase
        .from('children')
        .update({ name: editChildName.trim(), avatar: editChildAvatar })
        .eq('id', childId)
      if (error) throw error
      setChildren(prev => prev.map(c => c.id === childId ? { ...c, name: editChildName.trim(), avatar: editChildAvatar } : c))
      const newMap = { ...childrenById }
      if (newMap[childId]) {
        newMap[childId] = { ...newMap[childId], name: editChildName.trim(), avatar: editChildAvatar }
      }
      setChildrenById(newMap)
      cancelEditChild()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update child.')
    }
  }

  const deleteChild = async (childId: string, childName: string) => {
    if (!window.confirm(`Delete ${childName}? This will remove all their quests and history.`)) return
    setError(null)
    try {
      const { error } = await supabase.from('children').delete().eq('id', childId)
      if (error) throw error
      setChildren(prev => prev.filter(c => c.id !== childId))
      const newMap = { ...childrenById }
      delete newMap[childId]
      setChildrenById(newMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete child.')
    }
  }

  // Add stars
  const startAddStars = (childId: string) => {
    setAddStarsChildId(childId)
    setAddStarsAmount(10)
  }

  const cancelAddStars = () => {
    setAddStarsChildId(null)
    setAddStarsAmount(10)
  }

  const confirmAddStars = async (childId: string) => {
    if (addStarsAmount <= 0) return
    setError(null)
    try {
      const child = children.find(c => c.id === childId)
      if (!child) return
      const newStars = (child.stars || 0) + addStarsAmount
      const { error } = await supabase
        .from('children')
        .update({ stars: newStars })
        .eq('id', childId)
      if (error) throw error
      setChildren(prev => prev.map(c => c.id === childId ? { ...c, stars: newStars } : c))
      const newMap = { ...childrenById }
      if (newMap[childId]) {
        newMap[childId] = { ...newMap[childId], stars: newStars }
      }
      setChildrenById(newMap)
      cancelAddStars()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add stars.')
    }
  }

  const headerText = useMemo(() => {
    if (totalCount === 0) return 'No pending approvals. Nice!'
    const parts: string[] = []
    if (habitCount > 0) parts.push(`${habitCount} quest${habitCount > 1 ? 's' : ''}`)
    if (redemptionCount > 0) parts.push(`${redemptionCount} reward${redemptionCount > 1 ? 's' : ''}`)
    return `${parts.join(' and ')} waiting for your OK!`
  }, [totalCount, habitCount, redemptionCount])

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-lavender-light p-4">
      <div className="max-w-xl mx-auto pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-black text-charcoal">Parent Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>Home</Button>
            <Button variant="outline" size="sm" onClick={() => void signOut().then(() => navigate('/'))}>
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === 'approvals' ? 'default' : 'outline'}
            onClick={() => setTab('approvals')}
            className={tab === 'approvals' ? 'bg-lavender' : ''}
          >
            Approvals {totalCount > 0 && `(${totalCount})`}
          </Button>
          <Button
            variant={tab === 'rewards' ? 'default' : 'outline'}
            onClick={() => setTab('rewards')}
            className={tab === 'rewards' ? 'bg-lavender' : ''}
          >
            Star Store
          </Button>
          <Button
            variant={tab === 'children' ? 'default' : 'outline'}
            onClick={() => setTab('children')}
            className={tab === 'children' ? 'bg-lavender' : ''}
          >
            Children
          </Button>
        </div>

        {error && (
          <div className="mb-4 bg-coral-light border-4 border-charcoal p-3 rounded-xl text-sm font-bold text-coral">
            {error}
          </div>
        )}

        {/* Approvals Tab */}
        {tab === 'approvals' && (
          <div>
            <p className="text-lg font-bold text-charcoal mb-4">{headerText}</p>
            
            {/* Habit Approvals */}
            {habitCount > 0 && (
              <>
                <h3 className="text-sm font-bold text-charcoal-light uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Quests
                </h3>
                <div className="space-y-4 mb-6">
                  {rows.map((row) => {
                    const childId = row.habits.child_id
                    const child = childrenById[childId]
                    const isBusy = busyId === row.id
                    return (
                      <Card key={row.id} className="bg-card">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="text-3xl">{child?.avatar ?? '⭐'}</div>
                              <div>
                                <p className="font-black">{child?.name ?? 'Unknown'}</p>
                                <p className="text-lg font-bold">{row.habits.title}</p>
                                <p className="text-xs text-charcoal-light">{new Date(row.completed_at).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" className="bg-sage text-charcoal hover:bg-sage-light" disabled={isBusy} onClick={() => void onApprove(row)}>
                                ✓
                              </Button>
                              <Button size="sm" className="bg-coral text-charcoal hover:bg-coral-light" disabled={isBusy} onClick={() => void onReject(row)}>
                                ✗
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}

            {/* Redemption Fulfillments */}
            {redemptionCount > 0 && (
              <>
                <h3 className="text-sm font-bold text-charcoal-light uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4" /> Rewards to Give
                </h3>
                <div className="space-y-4">
                  {redemptions.map((redemption) => {
                    const isBusy = busyId === redemption.id
                    return (
                      <Card key={redemption.id} className="bg-gold-light border-gold">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="text-3xl">{redemption.child?.avatar ?? '🎁'}</div>
                              <div>
                                <p className="font-black">{redemption.child?.name ?? 'Unknown'}</p>
                                <div className="flex items-center gap-2">
                                  <ShoppingBag className="w-4 h-4 text-gold" />
                                  <p className="text-lg font-bold">{redemption.reward?.title ?? 'Reward'}</p>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-charcoal-light">
                                  <Star className="w-3 h-3 fill-gold text-gold" />
                                  <span>{redemption.stars_spent} stars spent</span>
                                </div>
                                <p className="text-xs text-charcoal-light">{new Date(redemption.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                size="sm" 
                                className="bg-sage text-charcoal hover:bg-sage-light" 
                                disabled={isBusy} 
                                onClick={() => void onFulfillRedemption(redemption)}
                                title="Fulfill reward"
                              >
                                <Gift className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-coral text-charcoal hover:bg-coral-light" 
                                disabled={isBusy} 
                                onClick={() => void onCancelRedemption(redemption)}
                                title="Cancel & refund"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Rewards Tab */}
        {tab === 'rewards' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-bold text-charcoal">Manage Star Store Rewards</p>
              <Button size="sm" onClick={() => setShowAddReward(true)} className="bg-sage text-charcoal hover:bg-sage-light">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            {showAddReward && (
              <Card className="bg-gold-light mb-4">
                <CardContent className="p-4">
                  <p className="font-bold mb-2">New Reward</p>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        placeholder="Reward name..."
                        value={newRewardTitle}
                        onChange={(e) => setNewRewardTitle(e.target.value)}
                        className="border-2 border-charcoal"
                      />
                    </div>
                    <div className="w-24">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-gold" />
                        <Input
                          type="number"
                          min={1}
                          value={newRewardCost}
                          onChange={(e) => setNewRewardCost(parseInt(e.target.value) || 1)}
                          className="border-2 border-charcoal"
                        />
                      </div>
                    </div>
                    <Button size="sm" onClick={addReward} className="bg-sage text-charcoal">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddReward(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {rewards.map((reward) => (
                <Card key={reward.id} className="bg-card">
                  <CardContent className="p-4">
                    {editingRewardId === reward.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border-2 border-charcoal flex-1"
                        />
                        <div className="w-20 flex items-center gap-1">
                          <Star className="w-4 h-4 text-gold" />
                          <Input
                            type="number"
                            min={1}
                            value={editCost}
                            onChange={(e) => setEditCost(parseInt(e.target.value) || 1)}
                            className="border-2 border-charcoal"
                          />
                        </div>
                        <Button size="sm" onClick={() => saveReward(reward.id)} className="bg-sage text-charcoal">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditReward}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">{reward.title}</p>
                          <div className="flex items-center gap-1 text-gold">
                            <Star className="w-4 h-4 fill-gold" />
                            <span className="font-black">{reward.star_cost}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEditReward(reward)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-coral" onClick={() => deleteReward(reward.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {rewards.length === 0 && (
                <p className="text-center text-charcoal-light py-8">No rewards yet. Add some!</p>
              )}
            </div>
          </div>
        )}

        {/* Children Tab */}
        {tab === 'children' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-bold text-charcoal">Manage Children</p>
              <Button size="sm" onClick={() => navigate('/parent/add-child')} className="bg-sage text-charcoal hover:bg-sage-light">
                <Plus className="w-4 h-4 mr-1" /> Add Child
              </Button>
            </div>

            <div className="space-y-3">
              {children.map((child) => (
                <Card key={child.id} className="bg-card">
                  <CardContent className="p-4">
                    {editingChildId === child.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editChildName}
                          onChange={(e) => setEditChildName(e.target.value)}
                          placeholder="Child name..."
                          className="border-2 border-charcoal"
                        />
                        <div className="grid grid-cols-5 gap-2">
                          {AVATARS.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setEditChildAvatar(emoji)}
                              className={`text-2xl p-2 rounded-lg border-2 ${
                                editChildAvatar === emoji 
                                  ? 'border-lavender bg-lavender-light' 
                                  : 'border-charcoal/20'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveChild(child.id)} className="bg-sage text-charcoal">
                            <Check className="w-4 h-4 mr-1" /> Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditChild}>
                            <X className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : addStarsChildId === child.id ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{child.avatar}</div>
                          <div>
                            <p className="font-bold">{child.name}</p>
                            <p className="text-sm text-charcoal-light">Current: ⭐ {child.stars || 0}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="font-bold">Add:</span>
                          <Input
                            type="number"
                            min={1}
                            value={addStarsAmount}
                            onChange={(e) => setAddStarsAmount(parseInt(e.target.value) || 1)}
                            className="border-2 border-charcoal w-24"
                          />
                          <span>⭐</span>
                          <Button size="sm" onClick={() => confirmAddStars(child.id)} className="bg-gold text-charcoal">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelAddStars}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{child.avatar}</div>
                          <div>
                            <p className="font-bold text-xl">{child.name}</p>
                            <div className="flex items-center gap-1 text-gold">
                              <Star className="w-4 h-4 fill-gold" />
                              <span className="font-black">{child.stars || 0}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startAddStars(child.id)} title="Add stars">
                            <Star className="w-4 h-4 text-gold" />
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => startEditChild(child)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-coral"
                            onClick={() => deleteChild(child.id, child.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {children.length === 0 && (
                <p className="text-center text-charcoal-light py-8">No children yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
