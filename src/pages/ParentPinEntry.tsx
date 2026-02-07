import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PARENT_PIN_SESSION_KEY = 'starquezz.parent_pin_session'
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
      const { data, error } = await supabase
        .from('parents')
        .select('pin_hash')
        .eq('id', user.id)
        .single()

      if (error) {
        // Parent record might not exist, create it
        if (error.code === 'PGRST116') {
          await supabase.from('parents').insert({ id: user.id, email: user.email || '' })
          setHasPin(false)
          setMode('set')
          return
        }
        setError(error.message)
        return
      }

      if (data?.pin_hash) {
        setHasPin(true)
        setMode('enter')
      } else {
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
      // Hash the PIN using Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-pin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'hash', pin }),
        }
      )

      const result = await response.json()
      if (!result.hash) throw new Error('Failed to hash PIN')

      // Save PIN hash
      const { error: updateError } = await supabase
        .from('parents')
        .update({ pin_hash: result.hash })
        .eq('id', user!.id)

      if (updateError) throw updateError

      setParentPinSession()
      navigate('/parent/approvals')
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

      // Verify PIN
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-pin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify', pin, hash: data.pin_hash }),
        }
      )

      const result = await response.json()
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
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-purple-100 flex items-center justify-center">
        <p className="text-lg font-bold">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-purple-100 p-6">
      <div className="max-w-sm mx-auto pt-20">
        <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔐</div>
              <h1 className="text-2xl font-black">
                {mode === 'set' ? 'Set Your PIN' : mode === 'forgot' ? 'Reset PIN' : 'Enter PIN'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {mode === 'set' 
                  ? (pin.length === 4 ? 'Confirm your PIN' : 'Create a 4-digit PIN')
                  : 'Enter your 4-digit parent PIN'}
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border-2 border-red-300 p-2 rounded-lg text-sm font-bold text-red-700 text-center">
                {error}
              </div>
            )}

            {/* PIN dots */}
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((i) => {
                const currentPin = mode === 'set' && pin.length === 4 ? confirmPin : pin
                return (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-4 border-black ${
                      i < currentPin.length ? 'bg-purple-500' : 'bg-white'
                    }`}
                  />
                )
              })}
            </div>

            {mode === 'set' && pin.length === 4 && (
              <p className="text-center text-sm text-gray-500 mb-4">Confirm your PIN</p>
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
                className="w-full bg-green-400 text-black hover:bg-green-300 font-bold"
                onClick={handleSetPin}
                disabled={loading}
              >
                {loading ? 'Setting PIN...' : 'Set PIN'}
              </Button>
            )}

            {mode === 'enter' && pin.length === 4 && (
              <Button 
                className="w-full bg-purple-500 hover:bg-purple-400 font-bold"
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
