import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowLeft, ShoppingBag, Check, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { listRewardsForChild } from "@/services/rewards"
import { createRedemption } from "@/services/redemptions"
import type { Child, Reward } from "@/types"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export function StarStore() {
  const { user } = useAuth()
  const { id: childId } = useParams()
  const navigate = useNavigate()

  const [child, setChild] = useState<Pick<Child, 'id' | 'name' | 'stars'> | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [error, setError] = useState<string | null>(null)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [justPurchased, setJustPurchased] = useState<string | null>(null)

  const refreshChild = async () => {
    if (!childId) return
    const { data: childData } = await supabase
      .from('children')
      .select('id,name,stars')
      .eq('id', childId)
      .single()
    if (childData) {
      setChild(childData as Pick<Child, 'id' | 'name' | 'stars'>)
    }
  }

  useEffect(() => {
    if (!childId) {
      navigate('/')
      return
    }
    if (!user) return

    void (async () => {
      setError(null)
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('id,name,stars')
        .eq('id', childId)
        .single()
      if (childError) throw childError
      setChild(childData as Pick<Child, 'id' | 'name' | 'stars'>)

      const rs = await listRewardsForChild(user.id)
      setRewards(rs)
    })().catch((err) => {
      setError(err instanceof Error ? err.message : 'Could not load rewards.')
    })
  }, [childId, navigate, user])

  const handlePurchase = async (reward: Reward) => {
    if (!childId || !child) return
    if (child.stars < reward.star_cost) return

    setPurchasing(reward.id)
    setError(null)

    try {
      await createRedemption(childId, reward.id, reward.star_cost)
      
      // Refresh child stars
      await refreshChild()
      
      // Show success state
      setJustPurchased(reward.id)
      setTimeout(() => setJustPurchased(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete purchase. Try again!')
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-coral-light p-4">
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
          <ShoppingBag className="w-16 h-16 mx-auto mb-2 text-lavender" />
          <h1 className="text-3xl font-black text-charcoal">Star Store</h1>
          <p className="text-lg font-bold text-charcoal">
            What will you get, {child?.name ?? 'Explorer'}? 🤩
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-coral-light border-4 border-charcoal p-3 rounded-xl text-sm font-bold text-coral">
            {error}
          </div>
        )}

        {/* Rewards Grid */}
        <div className="space-y-4">
          {rewards.map((reward) => {
            const canAfford = (child?.stars ?? 0) >= reward.star_cost
            const isPurchasing = purchasing === reward.id
            const wasPurchased = justPurchased === reward.id

            return (
              <Card 
                key={reward.id} 
                className={`transition-all ${
                  wasPurchased 
                    ? 'bg-sage-light border-sage' 
                    : canAfford 
                      ? 'bg-card cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none' 
                      : 'bg-muted opacity-60'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-charcoal">{reward.title}</h3>
                      <p className="text-sm text-charcoal-light">{reward.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-5 h-5 fill-gold text-gold" />
                        <span className="text-xl font-black text-charcoal">{reward.star_cost}</span>
                      </div>
                      
                      {wasPurchased ? (
                        <div className="mt-2 flex items-center gap-1 text-sage font-bold">
                          <Check className="w-4 h-4" />
                          Got it! 🎉
                        </div>
                      ) : isPurchasing ? (
                        <Button size="sm" className="mt-2 bg-sage text-charcoal" disabled>
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          Getting...
                        </Button>
                      ) : canAfford ? (
                        <Button 
                          size="sm" 
                          className="mt-2 bg-sage text-charcoal hover:bg-sage-light"
                          onClick={() => handlePurchase(reward)}
                        >
                          Get it!
                        </Button>
                      ) : (
                        <p className="text-xs font-bold text-charcoal-light mt-2">
                          Need {reward.star_cost - (child?.stars ?? 0)} more
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Fun message */}
        <p className="text-center text-sm font-bold text-charcoal-light mt-8">
          Keep questing to earn more stars! 🌟
        </p>
      </div>
    </div>
  )
}
