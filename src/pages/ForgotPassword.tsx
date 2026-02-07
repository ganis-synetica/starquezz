import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    // Use production URL for redirect
    const redirectUrl = import.meta.env.PROD 
      ? 'https://starquezz.musang.dev/reset-password'
      : `${window.location.origin}/reset-password`
    
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSuccess(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-light to-rose-light p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-card border-4 border-charcoal shadow-[8px_8px_0px_0px_rgba(74,68,83,0.6)]">
          <CardContent className="p-8">
            <h1 className="text-3xl font-black text-center mb-2 text-charcoal">Forgot Password? 🔑</h1>
            <p className="text-center text-charcoal-light mb-6">
              No worries! Enter your email and we'll send you a reset link.
            </p>

            {success ? (
              <div className="text-center">
                <div className="bg-sage-light border-4 border-charcoal p-4 rounded-xl mb-6">
                  <p className="text-lg font-bold text-sage">✅ Check your email!</p>
                  <p className="text-sm text-charcoal mt-1">
                    We've sent a password reset link to {email}
                  </p>
                </div>
                <Link to="/login">
                  <Button className="w-full">Back to Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-coral-light border-4 border-charcoal p-3 rounded-xl text-sm font-bold text-coral">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold mb-1 text-charcoal">Email</label>
                  <Input
                    type="email"
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-4 border-charcoal"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-lavender hover:bg-lavender-light"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <div className="text-center">
                  <Link className="text-sm font-bold underline" to="/login">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
