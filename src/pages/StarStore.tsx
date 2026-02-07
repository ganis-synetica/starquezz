import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowLeft, ShoppingBag } from "lucide-react"

const DEMO_REWARDS = [
  { id: "1", title: "Ice Cream Trip 🍦", cost: 10, description: "A delicious treat!" },
  { id: "2", title: "Movie Night 🎬", cost: 25, description: "Pick any movie!" },
  { id: "3", title: "New Book 📚", cost: 15, description: "Choose a fun book" },
  { id: "4", title: "Extra Screen Time 📱", cost: 20, description: "30 minutes bonus!" },
  { id: "5", title: "Pizza Party 🍕", cost: 50, description: "With your favorite toppings!" },
]

export function StarStore() {
  const stars = 24
  const childName = "Zen"

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-200 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2 bg-yellow-300 px-4 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Star className="w-6 h-6 fill-yellow-500 text-yellow-700" />
            <span className="text-xl font-black">{stars}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <ShoppingBag className="w-16 h-16 mx-auto mb-2 text-purple-600" />
          <h1 className="text-3xl font-black">Star Store</h1>
          <p className="text-lg font-bold text-gray-700">
            What will you get, {childName}? 🤩
          </p>
        </div>

        {/* Rewards Grid */}
        <div className="space-y-4">
          {DEMO_REWARDS.map((reward) => {
            const canAfford = stars >= reward.cost
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
                        <span className="text-xl font-black">{reward.cost}</span>
                      </div>
                      {canAfford ? (
                        <Button size="sm" className="mt-2 bg-green-400 text-black hover:bg-green-300">
                          Get it!
                        </Button>
                      ) : (
                        <p className="text-xs font-bold text-gray-500 mt-2">
                          Need {reward.cost - stars} more
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
