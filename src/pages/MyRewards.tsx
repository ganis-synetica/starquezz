import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowLeft, Gift, Clock, Check, X } from "lucide-react"
import { useChildSession } from "@/contexts/ChildContext"
import { supabase } from "@/lib/supabase"
import { listRedemptionsForChild, type RedemptionWithDetails } from "@/services/redemptions"
import type { Child } from "@/types"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export function MyRewards() {
  const { id: childId } = useParams()
  const navigate = useNavigate()
  useChildSession()

  const [child, setChild] = useState<Pick<Child, 'id' | 'name' | 'stars' | 'avatar'> | null>(null)
  const [redemptions, setRedemptions] = useState<RedemptionWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!childId) {
      navigate('/')
      return
    }

    void (async () => {
      setError(null)
      setLoading(true)
      try {
        const { data: childData, error: childError } = await supabase
          .from('children')
          .select('id,name,stars,avatar')
          .eq('id', childId)
          .single()
        
        if (childError) throw childError
        setChild(childData as Pick<Child, 'id' | 'name' | 'stars' | 'avatar'>)

        const rs = await listRedemptionsForChild(childId)
        setRedemptions(rs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load rewards.')
      } finally {
        setLoading(false)
      }
    })()
  }, [childId, navigate])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return <Check className="w-5 h-5 text-sage" />
      case 'cancelled':
        return <X className="w-5 h-5 text-coral" />
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-gold" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return 'Got it! 🎉'
      case 'cancelled':
        return 'Cancelled'
      case 'expired':
        return 'Expired'
      case 'pending':
      default:
        return 'Waiting...'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return 'bg-sage-light border-sage'
      case 'cancelled':
        return 'bg-coral-light border-coral opacity-60'
      case 'pending':
      default:
        return 'bg-gold-light border-gold'
    }
  }

  const pendingRedemptions = redemptions.filter(r => r.status === 'pending')
  const completedRedemptions = redemptions.filter(r => r.status !== 'pending')

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-lavender-light p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2 bg-gold-light px-4 py-2 rounded-full border-4 border-charcoal shadow-[4px_4px_0px_0px_rgba(74,68,83,0.6)]">
            <Star className="w-6 h-6 fill-gold text-charcoal" />
            <span className="text-xl font-black text-charcoal">{child?.stars ?? 0}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <Gift className="w-16 h-16 mx-auto mb-2 text-lavender" />
          <h1 className="text-3xl font-black text-charcoal">My Rewards</h1>
          <p className="text-lg font-bold text-charcoal-light">
            {child?.avatar ?? '⭐'} {child?.name ?? 'Explorer'}'s treasures!
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-coral-light border-4 border-charcoal p-3 rounded-xl text-sm font-bold text-coral">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-bounce">🎁</div>
            <p className="text-charcoal-light font-bold">Loading your rewards...</p>
          </div>
        ) : redemptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-xl font-black text-charcoal mb-2">No rewards yet!</h2>
            <p className="text-charcoal-light font-bold mb-4">
              Visit the Star Store to get something cool!
            </p>
            <Button 
              onClick={() => navigate(`/store/${childId}`)}
              className="bg-lavender text-charcoal hover:bg-lavender-light font-bold"
            >
              Go to Star Store 🛒
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Rewards */}
            {pendingRedemptions.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-charcoal-light uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold" />
                  Waiting for Grown-up
                </h2>
                <div className="space-y-3">
                  {pendingRedemptions.map((redemption) => (
                    <Card 
                      key={redemption.id} 
                      className={`${getStatusColor(redemption.status)} border-4 shadow-[4px_4px_0px_0px_rgba(74,68,83,0.2)]`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl animate-pulse">🎁</div>
                            <div>
                              <h3 className="text-lg font-black text-charcoal">
                                {redemption.reward?.title ?? 'Reward'}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-charcoal-light">
                                <Star className="w-3 h-3 fill-gold text-gold" />
                                <span>{redemption.stars_spent} stars</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-gold px-3 py-1 rounded-full">
                            {getStatusIcon(redemption.status)}
                            <span className="text-sm font-bold text-charcoal">
                              {getStatusText(redemption.status)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Rewards */}
            {completedRedemptions.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-charcoal-light uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Past Rewards
                </h2>
                <div className="space-y-3">
                  {completedRedemptions.map((redemption) => (
                    <Card 
                      key={redemption.id} 
                      className={`${getStatusColor(redemption.status)} border-4 shadow-[4px_4px_0px_0px_rgba(74,68,83,0.1)]`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">
                              {redemption.status === 'fulfilled' ? '🎉' : '❌'}
                            </div>
                            <div>
                              <h3 className={`text-lg font-black ${redemption.status === 'cancelled' ? 'line-through text-charcoal-light' : 'text-charcoal'}`}>
                                {redemption.reward?.title ?? 'Reward'}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-charcoal-light">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-gold text-gold" />
                                  {redemption.stars_spent}
                                </span>
                                <span>•</span>
                                <span>
                                  {new Date(redemption.fulfilled_at || redemption.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(redemption.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back to Store */}
        {redemptions.length > 0 && (
          <div className="mt-8 text-center">
            <Button 
              onClick={() => navigate(`/store/${childId}`)}
              className="bg-lavender text-charcoal hover:bg-lavender-light font-bold"
            >
              Get More Rewards 🛒
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
