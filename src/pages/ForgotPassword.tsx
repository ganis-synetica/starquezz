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
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-200 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-8">
            <h1 className="text-3xl font-black text-center mb-2">Forgot Password? 🔑</h1>
            <p className="text-center text-gray-600 mb-6">
              No worries! Enter your email and we'll send you a reset link.
            </p>

            {success ? (
              <div className="text-center">
                <div className="bg-green-100 border-4 border-black p-4 rounded-xl mb-6">
                  <p className="text-lg font-bold text-green-800">✅ Check your email!</p>
                  <p className="text-sm text-green-700 mt-1">
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
                  <div className="bg-red-100 border-4 border-black p-3 rounded-xl text-sm font-bold text-red-800">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-4 border-black"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-500 hover:bg-purple-400"
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
