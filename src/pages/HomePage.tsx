import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Sparkles } from "lucide-react"

const DEMO_KIDS = [
  { id: "1", name: "Zen", stars: 24, avatar: "🦊" },
  { id: "2", name: "Zia", stars: 18, avatar: "🦋" },
]

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-200 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="text-6xl mb-4">⭐</div>
          <h1 className="text-4xl font-black text-black mb-2">
            StarqueZZ
          </h1>
          <p className="text-lg font-bold text-gray-700">
            Time for your daily quest-astic adventure! 🚀
          </p>
        </div>

        {/* Kid Profiles */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-center">Who's ready to quest?</h2>
          {DEMO_KIDS.map((kid) => (
            <Card 
              key={kid.id} 
              className="cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-white"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{kid.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black">{kid.name}</h3>
                    <div className="flex items-center gap-1 text-lg font-bold text-yellow-600">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-600" />
                      {kid.stars} stars
                    </div>
                  </div>
                  <Sparkles className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Parent Login */}
        <div className="text-center">
          <Button variant="outline" className="bg-white">
            👨‍👩‍👧‍👦 Parent Dashboard
          </Button>
        </div>

        {/* Fun footer */}
        <p className="text-center text-sm font-bold text-gray-600 mt-8">
          Psst... complete your quests and earn stars! ✨
        </p>
      </div>
    </div>
  )
}
