import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Info, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              About ProKickTips
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              ProKickTips is built by a small team of football analysts and
              engineers passionate about helping people win more bets through
              data-driven, well-researched predictions.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/predictions">See Today's Predictions</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border p-6 text-center">
              <Info className="text-primary mx-auto" size={32} />
              <h3 className="text-xl font-bold mt-4">Transparent Analysis</h3>
              <p className="text-foreground/60 mt-2">
                We explain the reasoning behind every tip so you can learn and
                trust our picks.
              </p>
            </Card>

            <Card className="bg-card border-border p-6 text-center">
              <Users className="text-primary mx-auto" size={32} />
              <h3 className="text-xl font-bold mt-4">Community Driven</h3>
              <p className="text-foreground/60 mt-2">
                Join a growing community of bettors who discuss strategy and
                share feedback.
              </p>
            </Card>

            <Card className="bg-card border-border p-6 text-center">
              <Heart className="text-primary mx-auto" size={32} />
              <h3 className="text-xl font-bold mt-4">Responsible Betting</h3>
              <p className="text-foreground/60 mt-2">
                We promote responsible staking and provide guidance to help you
                manage risk.
              </p>
            </Card>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
          <h2 className="text-3xl font-bold mb-6 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Amanuel", role: "Head Analyst" },
              { name: "Samuel", role: "Data Scientist" },
              { name: "Maya", role: "Product" },
              { name: "Fikru", role: "Engineering" },
            ].map((member) => (
              <Card
                key={member.name}
                className="bg-card border-border p-6 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mx-auto flex items-center justify-center text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <h4 className="mt-4 font-bold">{member.name}</h4>
                <p className="text-sm text-foreground/60">{member.role}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
          <Card className="bg-primary/5 border border-primary/30 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">
                  Want to collaborate or ask a question?
                </h3>
                <p className="text-foreground/60">
                  Reach out — we love hearing from users and partners.
                </p>
              </div>
              <div>
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
