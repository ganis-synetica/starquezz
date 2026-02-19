import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function ParentSignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setIsLoading(true)
    try {
      await signUp(email, password)
      // Go directly to setup wizard, skip intro carousel
      navigate('/onboarding')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-coral-light p-6">
      <div className="max-w-md mx-auto pt-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-charcoal">Create Parent Account</h1>
          <p className="text-lg font-bold text-charcoal">Let’s set up your quest HQ.</p>
        </div>

        <Card className="bg-card">
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-black text-charcoal">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm font-black text-charcoal">Password</label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="At least 8 characters" />
              </div>
              <div>
                <label className="text-sm font-black text-charcoal">Confirm Password</label>
                <Input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Type it again"
                />
              </div>

              {error && (
                <div className="bg-coral-light border-4 border-charcoal p-3 rounded-xl text-sm font-bold text-coral">
                  {error}
                </div>
              )}

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Account'}
              </Button>

              <div className="text-sm font-bold text-center">
                Already have an account?{' '}
                <Link className="underline" to="/login">
                  Log in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

