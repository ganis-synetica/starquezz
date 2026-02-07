import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { awardStarsIfNeeded, approveCompletion, listPendingApprovals, rejectCompletion } from '@/services/completions'
import type { Child } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type PendingRow = Awaited<ReturnType<typeof listPendingApprovals>>[number]

function dateISOFromTimestamp(ts: string) {
  const d = new Date(ts)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function ApprovalQueue() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [rows, setRows] = useState<PendingRow[]>([])
  const [childrenById, setChildrenById] = useState<Record<string, Pick<Child, 'id' | 'name' | 'avatar'>>>( {})
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const parentId = user?.id

  useEffect(() => {
    if (!parentId) return

    void (async () => {
      setError(null)
      const [pending, children] = await Promise.all([
        listPendingApprovals(),
        supabase.from('children').select('id,name,avatar'),
      ])

      if (children.error) throw children.error
      const map: Record<string, Pick<Child, 'id' | 'name' | 'avatar'>> = {}
      for (const c of (children.data ?? []) as Array<Pick<Child, 'id' | 'name' | 'avatar'>>) {
        map[c.id] = c
      }
      setChildrenById(map)
      setRows(pending)
    })().catch((err) => {
      setError(err instanceof Error ? err.message : 'Could not load approvals.')
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

  const headerText = useMemo(() => {
    if (count === 0) return 'No pending approvals. Nice!' 
    if (count === 1) return '1 quest waiting for your OK!'
    return `${count} quests waiting for your OK!`
  }, [count])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-purple-100 p-6">
      <div className="max-w-xl mx-auto pt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black">Approval Queue</h1>
            <p className="text-lg font-bold text-gray-700">{headerText}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>Home</Button>
            <Button
              variant="outline"
              onClick={() => {
                void signOut().then(() => navigate('/'))
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-4 border-black p-3 rounded-xl text-sm font-bold text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {rows.map((row) => {
            const childId = row.habits.child_id
            const child = childrenById[childId]
            const isBusy = busyId === row.id
            return (
              <Card key={row.id} className="bg-white">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{child?.avatar ?? '⭐'}</div>
                      <div>
                        <p className="text-xs font-black text-gray-500">CHILD</p>
                        <p className="text-xl font-black">{child?.name ?? 'Unknown'}</p>
                        <p className="text-xs font-black text-gray-500 mt-2">QUEST</p>
                        <p className="text-lg font-bold">{row.habits.title}</p>
                        <p className="text-xs font-bold text-gray-600 mt-1">Completed at {new Date(row.completed_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button
                        className="bg-green-400 text-black hover:bg-green-300"
                        disabled={isBusy}
                        onClick={() => void onApprove(row)}
                      >
                        Approve
                      </Button>
                      <Button className="bg-red-400 text-black hover:bg-red-300" disabled={isBusy} onClick={() => void onReject(row)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
