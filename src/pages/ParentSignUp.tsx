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
      navigate('/parent/approvals')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-200 p-6">
      <div className="max-w-md mx-auto pt-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black">Create Parent Account</h1>
          <p className="text-lg font-bold text-gray-700">Let’s set up your quest HQ.</p>
        </div>

        <Card className="bg-white">
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-black">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm font-black">Password</label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="At least 8 characters" />
              </div>
              <div>
                <label className="text-sm font-black">Confirm Password</label>
                <Input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Type it again"
                />
              </div>

              {error && (
                <div className="bg-red-100 border-4 border-black p-3 rounded-xl text-sm font-bold text-red-800">
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

