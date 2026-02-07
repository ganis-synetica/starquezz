import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Handle the auth callback on mount
  useEffect(() => {
    // Supabase will automatically pick up the token from the URL hash
    // and set the session
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    if (!accessToken || type !== 'recovery') {
      Promise.resolve().then(() => {
        setError('Invalid or expired reset link. Please request a new one.')
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(true)
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-light to-rose-light p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-card border-4 border-charcoal shadow-[8px_8px_0px_0px_rgba(74,68,83,0.6)]">
          <CardContent className="p-8">
            <h1 className="text-3xl font-black text-center mb-2 text-charcoal">Reset Password 🔐</h1>
            <p className="text-center text-charcoal-light mb-6">
              Enter your new password below.
            </p>

            {success ? (
              <div className="text-center">
                <div className="bg-sage-light border-4 border-charcoal p-4 rounded-xl mb-6">
                  <p className="text-lg font-bold text-sage">✅ Password updated!</p>
                  <p className="text-sm text-charcoal mt-1">
                    Redirecting to login...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-coral-light border-4 border-charcoal p-3 rounded-xl text-sm font-bold text-coral">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold mb-1 text-charcoal">New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-4 border-charcoal"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-charcoal">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-4 border-charcoal"
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-lavender hover:bg-lavender-light"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Set New Password'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
