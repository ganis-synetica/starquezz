import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PARENT_PIN_SESSION_KEY = 'starquezz.parent_pin_session'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const SESSION_DURATION_MS = 30 * 60 * 1000 // 30 minutes

export function checkParentPinSession(): boolean {
  const raw = localStorage.getItem(PARENT_PIN_SESSION_KEY)
  if (!raw) return false
  try {
    const session = JSON.parse(raw)
    return session.expiresAt > Date.now()
  } catch {
    return false
  }
}

export function setParentPinSession() {
  localStorage.setItem(PARENT_PIN_SESSION_KEY, JSON.stringify({
    expiresAt: Date.now() + SESSION_DURATION_MS
  }))
}

export function clearParentPinSession() {
  localStorage.removeItem(PARENT_PIN_SESSION_KEY)
}

export function ParentPinEntry() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasPin, setHasPin] = useState<boolean | null>(null)
  const [mode, setMode] = useState<'check' | 'enter' | 'set' | 'forgot'>('check')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Check if already authenticated
    if (checkParentPinSession()) {
      navigate('/parent/approvals')
      return
    }

    // Check if parent has a PIN set
    void (async () => {
      try {
        const { data, error } = await supabase
          .from('parents')
          .select('pin_hash')
          .eq('id', user.id)
          .single()

        if (error) {
          // Parent record might not exist, create it
          if (error.code === 'PGRST116') {
            const { error: insertError } = await supabase.from('parents').insert({ id: user.id, email: user.email || '' })
            if (insertError) {
              setError(insertError.message)
              setHasPin(false)
              setMode('set')
              return
            }
            setHasPin(false)
            setMode('set')
            return
          }
          setError(error.message)
          setHasPin(false)
          setMode('set')
          return
        }

        if (data?.pin_hash) {
          setHasPin(true)
          setMode('enter')
        } else {
          setHasPin(false)
          setMode('set')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load PIN status')
        setHasPin(false)
        setMode('set')
      }
    })()
  }, [user, navigate])

  const handlePinPress = (digit: string) => {
    if (mode === 'set' && pin.length < 4) {
      setPin(prev => prev + digit)
    } else if (mode === 'set' && confirmPin.length < 4) {
      setConfirmPin(prev => prev + digit)
    } else if (mode === 'enter' && pin.length < 4) {
      setPin(prev => prev + digit)
    }
    setError(null)
  }

  const handleBackspace = () => {
    if (mode === 'set' && confirmPin.length > 0) {
      setConfirmPin(prev => prev.slice(0, -1))
    } else if (pin.length > 0) {
      setPin(prev => prev.slice(0, -1))
    }
  }

  const handleSetPin = async () => {
    if (pin.length !== 4) {
      setError('PIN must be 4 digits')
      return
    }
    if (pin !== confirmPin) {
      setError('PINs do not match')
      setConfirmPin('')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token ?? SUPABASE_ANON_KEY

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/verify-pin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: 'hash', pin }),
        }
      )

      const result = (await response.json()) as { hash?: string; error?: string }
      if (!response.ok) {
        throw new Error(result?.error ?? `Request failed (${response.status})`)
      }
      if (!result.hash) {
        throw new Error(result?.error ?? 'Failed to hash PIN')
      }

      // Save PIN hash
      const { error: updateError } = await supabase
        .from('parents')
        .update({ pin_hash: result.hash })
        .eq('id', user!.id)

      if (updateError) throw updateError

      setParentPinSession()
      navigate('/onboarding')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set PIN')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPin = async () => {
    if (pin.length !== 4) return

    setLoading(true)
    setError(null)

    try {
      // Get stored hash
      const { data, error: fetchError } = await supabase
        .from('parents')
        .select('pin_hash')
        .eq('id', user!.id)
        .single()

      if (fetchError || !data?.pin_hash) throw new Error('PIN not found')

      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token ?? SUPABASE_ANON_KEY

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/verify-pin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: 'verify', pin, hash: data.pin_hash }),
        }
      )

      const result = (await response.json()) as { valid?: boolean; error?: string }
      if (!response.ok) {
        setError(result?.error ?? `Request failed (${response.status})`)
        setPin('')
        return
      }
      if (!result.valid) {
        setError('Wrong PIN. Try again!')
        setPin('')
        return
      }

      setParentPinSession()
      navigate('/parent/approvals')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPin = async () => {
    setLoading(true)
    setError(null)

    try {
      // Send password reset email (they'll need to log in again)
      const { error } = await supabase.auth.resetPasswordForEmail(user!.email!, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      // Clear the PIN so they can set a new one after logging back in
      await supabase
        .from('parents')
        .update({ pin_hash: null })
        .eq('id', user!.id)

      // Sign out
      await supabase.auth.signOut()

      navigate('/login', { state: { message: 'Check your email to reset your password and PIN.' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (hasPin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-lavender-light flex items-center justify-center">
        <p className="text-lg font-bold text-charcoal">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-lavender-light p-6">
      <div className="max-w-sm mx-auto pt-20">
        <Card className="bg-card border-4 border-charcoal shadow-[8px_8px_0px_0px_rgba(74,68,83,0.6)]">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔐</div>
              <h1 className="text-2xl font-black text-charcoal">
                {mode === 'set'
                  ? 'Hi Parent, please set your PIN.'
                  : mode === 'forgot'
                    ? 'Hi Parent, reset your PIN.'
                    : 'Hi Parent, enter your PIN.'}
              </h1>
              <p className="text-charcoal-light text-sm mt-1">
                {mode === 'enter'
                  ? 'Enter your 4-digit PIN to open your dashboard.'
                  : "You'll use this PIN to open your parent dashboard so only you can manage quests and rewards."}
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-coral-light border-2 border-coral p-2 rounded-lg text-sm font-bold text-coral text-center">
                {error.includes('column') || error.includes('relation') || error.includes('PGRST') 
                  ? 'Something went wrong. Please try again or contact support.'
                  : error}
              </div>
            )}

            {/* PIN dots */}
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((i) => {
                const currentPin = mode === 'set' && pin.length === 4 ? confirmPin : pin
                return (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-4 border-charcoal ${
                      i < currentPin.length ? 'bg-lavender' : 'bg-card'
                    }`}
                  />
                )
              })}
            </div>

            {mode === 'set' && pin.length === 4 && (
              <p className="text-center text-sm text-charcoal-light mb-4">Confirm your PIN</p>
            )}

            {/* Number pad */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  className={`h-14 text-2xl font-bold ${key === '' ? 'invisible' : ''}`}
                  disabled={loading || key === ''}
                  onClick={() => {
                    if (key === '⌫') handleBackspace()
                    else handlePinPress(key)
                  }}
                >
                  {key}
                </Button>
              ))}
            </div>

            {/* Action buttons */}
            {mode === 'set' && pin.length === 4 && confirmPin.length === 4 && (
              <Button 
                className="w-full bg-sage text-charcoal hover:bg-sage-light font-bold"
                onClick={handleSetPin}
                disabled={loading}
              >
                {loading ? 'Setting PIN...' : 'Set PIN'}
              </Button>
            )}

            {mode === 'enter' && pin.length === 4 && (
              <Button 
                className="w-full bg-lavender hover:bg-lavender-light font-bold"
                onClick={handleVerifyPin}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Unlock'}
              </Button>
            )}

            {mode === 'enter' && (
              <Button
                variant="ghost"
                className="w-full mt-2 text-sm"
                onClick={handleForgotPin}
                disabled={loading}
              >
                Forgot PIN? Reset via email
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
