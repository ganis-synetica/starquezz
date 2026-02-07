import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function ParentLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/parent/approvals'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setIsLoading(true)
    try {
      await signIn(email, password)
      navigate(from)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-light to-rose-light p-6">
      <div className="max-w-md mx-auto pt-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-charcoal">Parent Portal</h1>
          <p className="text-lg font-bold text-charcoal">Log in to manage quests and rewards.</p>
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
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
              </div>

              {error && (
                <div className="bg-coral-light border-4 border-charcoal p-3 rounded-xl text-sm font-bold text-coral">
                  {error}
                </div>
              )}

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>

              <div className="flex items-center justify-between text-sm font-bold">
                <Link className="underline" to="/forgot-password">
                  Forgot password?
                </Link>
                <Link className="underline" to="/signup">
                  Create account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

