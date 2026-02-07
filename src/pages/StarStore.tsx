import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowLeft, ShoppingBag } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { listRewardsForChild } from "@/services/rewards"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-200 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2 bg-yellow-300 px-4 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Star className="w-6 h-6 fill-yellow-500 text-yellow-700" />
            <span className="text-xl font-black">{child?.stars ?? 0}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <ShoppingBag className="w-16 h-16 mx-auto mb-2 text-purple-600" />
          <h1 className="text-3xl font-black">Star Store</h1>
          <p className="text-lg font-bold text-gray-700">
            What will you get, {child?.name ?? 'Explorer'}? 🤩
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-4 border-black p-3 rounded-xl text-sm font-bold text-red-800">
            {error}
          </div>
        )}

        {/* Rewards Grid */}
        <div className="space-y-4">
          {rewards.map((reward) => {
            const canAfford = (child?.stars ?? 0) >= reward.star_cost
            return (
              <Card 
                key={reward.id} 
                className={`transition-all ${canAfford ? 'bg-white cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none' : 'bg-gray-100 opacity-60'}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-black">{reward.title}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-600" />
                        <span className="text-xl font-black">{reward.star_cost}</span>
                      </div>
                      {canAfford ? (
                        <Button size="sm" className="mt-2 bg-green-400 text-black hover:bg-green-300">
                          Get it!
                        </Button>
                      ) : (
                        <p className="text-xs font-bold text-gray-500 mt-2">
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
        <p className="text-center text-sm font-bold text-gray-600 mt-8">
          Keep questing to earn more stars! 🌟
        </p>
      </div>
    </div>
  )
}
