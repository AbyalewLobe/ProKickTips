"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { PredictionsTable } from "@/components/predictions-table";
import api from "@/app/api/api.js";

export default function PredictionsPage() {
  const { user } = useAuth();

  const [displayedPredictions, setDisplayedPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  // Fetch today's free predictions
  useEffect(() => {
    const fetchTodayFree = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/prediction/today-free"); // no auth needed
        const preds: any[] = res.data?.data || [];

        setDisplayedPredictions(
          preds.map((p: any) => ({
            _id: p._id,
            match: p.match || "-",
            bet: p.bet || "-",
            odds: Number(p.odds || 0),
            type: (p.type || "free").toLowerCase(), // ensure lowercase
            status: (() => {
              const s = (p.status || "Pending").toLowerCase();
              return s === "lose" ? "lost" : s; // normalize "Lose" -> "lost"
            })(),
            createdAt: p.createdAt,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch predictions", err);
        setError("Failed to load predictions");
      } finally {
        setLoading(false);
      }
    };

    fetchTodayFree();
  }, []); // runs once on page load
  console.log("displayedPredictions", displayedPredictions);

  const wonCount = displayedPredictions.filter(
    (p) => p.status === "won"
  ).length;
  const winRate =
    displayedPredictions.length > 0
      ? ((wonCount / displayedPredictions.length) * 100).toFixed(0)
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Football Predictions</h1>
            <p className="text-foreground/60">
              Today's free expert predictions
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm">Win Rate</p>
                  <p className="text-3xl font-bold text-primary">{winRate}%</p>
                </div>
                <TrendingUp className="text-primary" size={32} />
              </div>
            </Card>
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm">
                    Total Predictions
                  </p>
                  <p className="text-3xl font-bold">
                    {displayedPredictions.length}
                  </p>
                </div>
                <Zap className="text-accent" size={32} />
              </div>
            </Card>
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm">Won</p>
                  <p className="text-3xl font-bold text-green-500">
                    {wonCount}
                  </p>
                </div>
                <TrendingDown className="text-green-500" size={32} />
              </div>
            </Card>
          </div>

          {/* Predictions Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <PredictionsTable
              predictions={displayedPredictions}
              showType={false}
            />
          </div>

          {!loading && displayedPredictions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">
                No free predictions available today
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 text-foreground/60">
              Loading predictions...
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
