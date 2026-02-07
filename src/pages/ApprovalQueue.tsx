import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { awardStarsIfNeeded, approveCompletion, listPendingApprovals, rejectCompletion } from '@/services/completions'
import type { Child, Reward } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Pencil, Trash2, Plus, Check, X } from 'lucide-react'

type PendingRow = Awaited<ReturnType<typeof listPendingApprovals>>[number]

function dateISOFromTimestamp(ts: string) {
  const d = new Date(ts)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

type Tab = 'approvals' | 'rewards' | 'children'

export function ApprovalQueue() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('approvals')
  const [rows, setRows] = useState<PendingRow[]>([])
  const [childrenById, setChildrenById] = useState<Record<string, Pick<Child, 'id' | 'name' | 'avatar'>>>({})
  const [children, setChildren] = useState<Array<Pick<Child, 'id' | 'name' | 'avatar'>>>([])
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

  const parentId = user?.id

  useEffect(() => {
    if (!parentId) return

    void (async () => {
      setError(null)
      const [pending, childrenRes, rewardsRes] = await Promise.all([
        listPendingApprovals(),
        supabase.from('children').select('id,name,avatar'),
        supabase.from('rewards').select('*').eq('parent_id', parentId).eq('active', true).order('star_cost'),
      ])

      if (childrenRes.error) throw childrenRes.error
      if (rewardsRes.error) throw rewardsRes.error

      const childList = (childrenRes.data ?? []) as Array<Pick<Child, 'id' | 'name' | 'avatar'>>
      const map: Record<string, Pick<Child, 'id' | 'name' | 'avatar'>> = {}
      for (const c of childList) {
        map[c.id] = c
      }
      setChildrenById(map)
      setChildren(childList)
      setRows(pending)
      setRewards((rewardsRes.data ?? []) as Reward[])
    })().catch((err) => {
      setError(err instanceof Error ? err.message : 'Could not load data.')
    })
  }, [parentId])

  const count = rows.length

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

  // Child management
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

  const headerText = useMemo(() => {
    if (count === 0) return 'No pending approvals. Nice!'
    if (count === 1) return '1 quest waiting for your OK!'
    return `${count} quests waiting for your OK!`
  }, [count])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-purple-100 p-4">
      <div className="max-w-xl mx-auto pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-black">Parent Dashboard</h1>
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
            className={tab === 'approvals' ? 'bg-purple-500' : ''}
          >
            Approvals {count > 0 && `(${count})`}
          </Button>
          <Button
            variant={tab === 'rewards' ? 'default' : 'outline'}
            onClick={() => setTab('rewards')}
            className={tab === 'rewards' ? 'bg-purple-500' : ''}
          >
            Star Store
          </Button>
          <Button
            variant={tab === 'children' ? 'default' : 'outline'}
            onClick={() => setTab('children')}
            className={tab === 'children' ? 'bg-purple-500' : ''}
          >
            Children
          </Button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-4 border-black p-3 rounded-xl text-sm font-bold text-red-800">
            {error}
          </div>
        )}

        {/* Approvals Tab */}
        {tab === 'approvals' && (
          <div>
            <p className="text-lg font-bold text-gray-700 mb-4">{headerText}</p>
            <div className="space-y-4">
              {rows.map((row) => {
                const childId = row.habits.child_id
                const child = childrenById[childId]
                const isBusy = busyId === row.id
                return (
                  <Card key={row.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{child?.avatar ?? '⭐'}</div>
                          <div>
                            <p className="font-black">{child?.name ?? 'Unknown'}</p>
                            <p className="text-lg font-bold">{row.habits.title}</p>
                            <p className="text-xs text-gray-500">{new Date(row.completed_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className="bg-green-400 text-black hover:bg-green-300" disabled={isBusy} onClick={() => void onApprove(row)}>
                            ✓
                          </Button>
                          <Button size="sm" className="bg-red-400 text-black hover:bg-red-300" disabled={isBusy} onClick={() => void onReject(row)}>
                            ✗
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {tab === 'rewards' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-bold text-gray-700">Manage Star Store Rewards</p>
              <Button size="sm" onClick={() => setShowAddReward(true)} className="bg-green-400 text-black hover:bg-green-300">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            {showAddReward && (
              <Card className="bg-yellow-50 mb-4">
                <CardContent className="p-4">
                  <p className="font-bold mb-2">New Reward</p>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        placeholder="Reward name..."
                        value={newRewardTitle}
                        onChange={(e) => setNewRewardTitle(e.target.value)}
                        className="border-2 border-black"
                      />
                    </div>
                    <div className="w-24">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <Input
                          type="number"
                          min={1}
                          value={newRewardCost}
                          onChange={(e) => setNewRewardCost(parseInt(e.target.value) || 1)}
                          className="border-2 border-black"
                        />
                      </div>
                    </div>
                    <Button size="sm" onClick={addReward} className="bg-green-400 text-black">
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
                <Card key={reward.id} className="bg-white">
                  <CardContent className="p-4">
                    {editingRewardId === reward.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border-2 border-black flex-1"
                        />
                        <div className="w-20 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <Input
                            type="number"
                            min={1}
                            value={editCost}
                            onChange={(e) => setEditCost(parseInt(e.target.value) || 1)}
                            className="border-2 border-black"
                          />
                        </div>
                        <Button size="sm" onClick={() => saveReward(reward.id)} className="bg-green-400 text-black">
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
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            <span className="font-black">{reward.star_cost}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEditReward(reward)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500" onClick={() => deleteReward(reward.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {rewards.length === 0 && (
                <p className="text-center text-gray-500 py-8">No rewards yet. Add some!</p>
              )}
            </div>
          </div>
        )}

        {/* Children Tab */}
        {tab === 'children' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-bold text-gray-700">Manage Children</p>
              <Button size="sm" onClick={() => navigate('/parent/setup')} className="bg-green-400 text-black hover:bg-green-300">
                <Plus className="w-4 h-4 mr-1" /> Add Child
              </Button>
            </div>

            <div className="space-y-3">
              {children.map((child) => (
                <Card key={child.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{child.avatar}</div>
                        <p className="font-bold text-xl">{child.name}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500"
                        onClick={() => deleteChild(child.id, child.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {children.length === 0 && (
                <p className="text-center text-gray-500 py-8">No children yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
