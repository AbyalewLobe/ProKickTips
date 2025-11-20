import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Trophy } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Win More Bets with <span className="text-primary">Expert Predictions</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto text-balance">
              Get daily football predictions from professional analysts. Start free or unlock premium insights for
              maximum winning potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/predictions">View Free Predictions</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">Unlock Premium</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border p-6 text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="text-primary" size={32} />
              </div>
              <h3 className="text-3xl font-bold">87%</h3>
              <p className="text-foreground/60">Win Rate</p>
            </Card>
            <Card className="bg-card border-border p-6 text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="text-primary" size={32} />
              </div>
              <h3 className="text-3xl font-bold">2.5K+</h3>
              <p className="text-foreground/60">Tips Posted</p>
            </Card>
            <Card className="bg-card border-border p-6 text-center">
              <div className="flex justify-center mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-foreground/60">Premium Members</p>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card border-border p-8">
              <h3 className="font-bold text-lg mb-2">Free Predictions</h3>
              <p className="text-foreground/60">
                Access daily predictions selected by our top analysts. Perfect for testing our accuracy.
              </p>
              <ul className="mt-4 space-y-2 text-foreground/60">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span> Daily tips
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span> Live updates
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span> Full history
                </li>
              </ul>
            </Card>
            <Card className="bg-card border-border p-8">
              <h3 className="font-bold text-lg mb-2">Premium Predictions</h3>
              <p className="text-foreground/60">
                Exclusive predictions with detailed analysis and expert insights for serious bettors.
              </p>
              <ul className="mt-4 space-y-2 text-foreground/60">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span> All free access
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span> Expert analysis
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span> Early predictions
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
