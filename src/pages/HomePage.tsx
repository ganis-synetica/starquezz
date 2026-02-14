import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { SkeletonChildSelector } from "@/components/Skeleton"
import type { Child } from "@/types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { checkOnboarded } from "./Onboarding"

export function HomePage() {
  const { status, user } = useAuth()
  const navigate = useNavigate()

  const [kids, setKids] = useState<Array<Pick<Child, 'id' | 'name' | 'stars' | 'avatar'>>>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Check onboarding status
  useEffect(() => {
    if (status === 'authenticated' && !checkOnboarded()) {
      navigate('/onboarding')
    }
  }, [status, navigate])

  useEffect(() => {
    if (status === 'loading') return
    
    if (status !== 'authenticated' || !user) {
      Promise.resolve().then(() => {
        setKids([])
        setLoading(false)
      })
      return
    }

    void (async () => {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('children')
        .select('id,name,stars,avatar')
        .order('created_at', { ascending: true })

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }
      
      const children = (data ?? []) as Array<Pick<Child, 'id' | 'name' | 'stars' | 'avatar'>>
      
      // If logged in but no children, redirect to setup wizard
      if (children.length === 0) {
        navigate('/parent/setup')
        return
      }
      
      setKids(children)
      setLoading(false)
    })()
  }, [status, user, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-coral-light p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="text-6xl mb-4">⭐</div>
          <h1 className="text-4xl font-black text-charcoal mb-2">
            StarqueZZ
          </h1>
          <p className="text-lg font-bold text-charcoal">
            Time for your daily quest-astic adventure! 🚀
          </p>
        </div>

        {/* Kid Profiles */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-center text-charcoal">Who's ready to quest?</h2>
          {error && <p className="text-sm font-bold text-coral text-center">{error}</p>}
          {loading && status === 'authenticated' && (
            <SkeletonChildSelector count={2} />
          )}
          {!loading && status !== 'authenticated' && (
            <p className="text-sm font-bold text-charcoal text-center">
              Parents: log in to get started.
            </p>
          )}
          {kids.map((kid) => (
            <Card 
              key={kid.id} 
              className="cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-card"
              onClick={() => navigate(`/child/${kid.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{kid.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-charcoal">{kid.name}</h3>
                    <div className="flex items-center gap-1 text-lg font-bold text-gold">
                      <Star className="w-5 h-5 fill-gold text-gold" />
                      {kid.stars} stars
                    </div>
                  </div>
                  <Sparkles className="w-8 h-8 text-lavender" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Parent Login */}
        <div className="text-center">
          {status === 'authenticated' ? (
            <Button variant="outline" className="bg-card" onClick={() => navigate('/parent/pin')}>
              👨‍👩‍👧‍👦 Parent Dashboard
            </Button>
          ) : (
            <Button variant="outline" className="bg-card" onClick={() => navigate('/login')}>
              👨‍👩‍👧‍👦 Parent Login
            </Button>
          )}
        </div>

        {/* Fun footer */}
        <p className="text-center text-sm font-bold text-charcoal-light mt-8">
          Psst... complete your quests and earn stars! ✨
        </p>
      </div>
    </div>
  )
}
