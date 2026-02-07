import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useChildSession } from '@/contexts/ChildContext'
import { supabase } from '@/lib/supabase'
import type { Child } from '@/types'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type AttemptState = {
  count: number
  lockedUntil: number | null
}

const LOCK_AFTER = 5
const LOCK_MS = 15 * 60 * 1000

function storageKey(childId: string) {
  return `starquezz.pin_attempts.${childId}`
}

function loadAttempts(childId: string): AttemptState {
  const raw = localStorage.getItem(storageKey(childId))
  if (!raw) return { count: 0, lockedUntil: null }
  try {
    const parsed = JSON.parse(raw) as AttemptState
    if (typeof parsed.count !== 'number') return { count: 0, lockedUntil: null }
    const lockedUntil = typeof parsed.lockedUntil === 'number' ? parsed.lockedUntil : null
    return { count: parsed.count, lockedUntil }
  } catch {
    return { count: 0, lockedUntil: null }
  }
}

function saveAttempts(childId: string, next: AttemptState) {
  localStorage.setItem(storageKey(childId), JSON.stringify(next))
}

async function verifyPin(pin: string, hash: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(`${pin}:${hash}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return hex === hash
}

export function PinEntry() {
  const { id } = useParams()
  const childId = id
  const navigate = useNavigate()
  const { loginChild } = useChildSession()

  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [child, setChild] = useState<Pick<Child, 'id' | 'name' | 'avatar' | 'pin_hash'> | null>(null)

  const [attempts, setAttempts] = useState<AttemptState>(() => (childId ? loadAttempts(childId) : { count: 0, lockedUntil: null }))

  const locked = useMemo(() => {
    if (!attempts.lockedUntil) return false
    return Date.now() < attempts.lockedUntil
  }, [attempts.lockedUntil])

  const lockRemaining = useMemo(() => {
    if (!attempts.lockedUntil) return 0
    return Math.max(0, attempts.lockedUntil - Date.now())
  }, [attempts.lockedUntil])

  useMemo(() => {
    if (!childId) return null
    void (async () => {
      const { data, error: fetchError } = await supabase
        .from('children')
        .select('id,name,avatar,pin_hash')
        .eq('id', childId)
        .maybeSingle()

      if (fetchError) {
        setError(fetchError.message)
        return
      }

      if (!data) {
        setError('Child not found.')
        return
      }
      setChild(data)
    })()
    return null
  }, [childId])

  const pressDigit = (digit: string) => {
    if (locked) return
    if (pin.length >= 4) return
    setPin((p) => p + digit)
    setError(null)
  }

  const backspace = () => {
    if (locked) return
    setPin((p) => p.slice(0, -1))
  }

  const resetPin = () => setPin('')

  const onSubmitPin = async () => {
    if (!childId || !child) return
    if (locked) return

    if (pin.length !== 4) {
      setError('Enter all 4 digits, brave adventurer!')
      return
    }

    const ok = await verifyPin(pin, child.pin_hash)
    if (ok) {
      saveAttempts(childId, { count: 0, lockedUntil: null })
      loginChild(childId)
      navigate(`/child/${childId}`)
      return
    }

    const nextCount = attempts.count + 1
    const shouldLock = nextCount >= LOCK_AFTER
    const next: AttemptState = {
      count: shouldLock ? 0 : nextCount,
      lockedUntil: shouldLock ? Date.now() + LOCK_MS : null,
    }
    saveAttempts(childId, next)
    setAttempts(next)

    setShake(true)
    window.setTimeout(() => setShake(false), 300)
    setError(shouldLock ? 'Too many tries! Take a snack break 🍪 (15 min lock)' : 'Wrong PIN—try again, quest hero!')
    resetPin()
  }

  if (!childId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-xl font-black">Missing child id.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-200 p-6">
      <div className="max-w-md mx-auto pt-10">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{child?.avatar ?? '⭐'}</div>
          <h1 className="text-3xl font-black">Enter your secret PIN</h1>
          <p className="text-lg font-bold text-gray-700">{child ? `Hey ${child.name}!` : 'Loading...'}</p>
        </div>

        <Card className={`bg-white ${shake ? 'animate-[shake_0.3s]' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-12 rounded-xl border-4 border-black bg-gray-100 flex items-center justify-center"
                >
                  <span className="text-2xl font-black">{pin[i] ? '•' : ''}</span>
                </div>
              ))}
            </div>

            {locked && (
              <div className="bg-purple-100 border-4 border-black p-3 rounded-xl text-sm font-bold text-purple-900 mb-3">
                Locked for {Math.ceil(lockRemaining / 60000)} min. Come back soon!
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-4 border-black p-3 rounded-xl text-sm font-bold text-red-800 mb-3">
                {error}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                <Button key={d} type="button" className="h-14 text-xl font-black" onClick={() => pressDigit(d)}>
                  {d}
                </Button>
              ))}
              <Button type="button" variant="outline" className="h-14 text-lg font-black" onClick={backspace}>
                ⌫
              </Button>
              <Button type="button" className="h-14 text-xl font-black" onClick={() => pressDigit('0')}>
                0
              </Button>
              <Button type="button" className="h-14 text-lg font-black bg-green-400 text-black hover:bg-green-300" onClick={onSubmitPin}>
                Go!
              </Button>
            </div>

            <div className="mt-4">
              <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/')}
                >
                Back to profiles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

