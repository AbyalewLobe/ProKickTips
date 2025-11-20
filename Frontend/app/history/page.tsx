"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/app/api/api.js";
import { useAuth } from "@/lib/auth-context";
import DatePicker from "@/components/calendar";

type HistoryItem = {
  id: string | number;
  match: string;
  prediction: string;
  result: string;
  odds: number;
  stake: number;
  profit: number;
  date: string;
  league?: string;
};

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [sortBy, setSortBy] = useState("recent");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [selectedDate, setSelectedDate] = useState<Date>(yesterday);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const mapPredictionToHistory = (p: any): HistoryItem => {
    const status = (p.status || "pending").toString().toLowerCase();
    const result =
      status === "won" ? "Won" : status === "lost" ? "Lost" : "Pending";
    const stake = p.stake ?? 0;
    const odds = p.odds ?? 0;
    const profit =
      p.profit ??
      (result === "Won"
        ? Math.round((odds - 1) * stake)
        : result === "Lost"
        ? -stake
        : 0);
    return {
      id: p._id,
      match: p.match || "-",
      prediction: p.bet || "-",
      result,
      odds,
      stake,
      profit,
      date: p.createdAt ? p.createdAt.split("T")[0] : "",
      league: p.league || "",
    };
  };

  const formatDate = (date?: Date) => date?.toISOString().split("T")[0] ?? "";
  const fetchHistory = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get(`/prediction`);
      const preds = res.data.data || [];
      const items = preds.map(mapPredictionToHistory);
      setHistoryData(items);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchHistory();
  }, [user, authLoading]);

  // 🔹 Button navigation keeps calendar synced
  const handlePrevDay = () => {
    const current = selectedDate || yesterday;
    const newDate = new Date(current);
    newDate.setDate(current.getDate() - 1);
    setSelectedDate(newDate); // 🔹 This was missing
  };

  const handleNextDay = () => {
    const current = selectedDate || yesterday;
    const newDate = new Date(current);
    newDate.setDate(current.getDate() + 1);

    // Prevent going to today or future
    if (newDate >= yesterday) return;
    setSelectedDate(newDate);
  };

  // 🔹 Filter predictions by selectedDate
  const filteredData = historyData.filter(
    (item) =>
      selectedDate &&
      item.date === formatDate(selectedDate) &&
      new Date(item.date) < today
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "recent") return b.date.localeCompare(a.date);
    if (sortBy === "oldest") return a.date.localeCompare(b.date);
    if (sortBy === "profit") return b.profit - a.profit;
    if (sortBy === "loss") return a.profit - b.profit;
    return 0;
  });

  const wonCount = sortedData.filter((h) => h.result === "Won").length;
  const totalStake = sortedData.reduce((acc, h) => acc + (h.stake || 0), 0);
  const totalProfit = sortedData.reduce((acc, h) => acc + (h.profit || 0), 0);
  const roi =
    totalStake > 0 ? ((totalProfit / totalStake) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Prediction History</h1>
            <p className="text-foreground/60">
              Use the arrows or calendar to browse predictions by date.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border p-6">
              <p className="text-foreground/60 text-sm mb-1">
                Total Predictions
              </p>
              <p className="text-3xl font-bold">{sortedData.length}</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-foreground/60 text-sm mb-1">Won</p>
              <p className="text-3xl font-bold text-green-500">{wonCount}</p>
            </Card>
            {/* <Card className="bg-card border-border p-6">
              <p className="text-foreground/60 text-sm mb-1">ROI</p>
              <p
                className={`text-3xl font-bold ${
                  totalProfit >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {roi}%
              </p>
            </Card> */}
          </div>

          {/* Date Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePrevDay}
                variant="outline"
                size="icon"
                title="Previous Day"
              >
                <ArrowLeft size={18} />
              </Button>

              <span className="text-sm font-medium">
                {selectedDate
                  ? selectedDate.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "No date selected"}
              </span>

              <Button
                onClick={handleNextDay}
                variant="outline"
                size="icon"
                title="Next Day"
              >
                <ArrowRight size={18} />
              </Button>
            </div>

            {/* 🔹 Calendar input synced */}
            {/* <input
              type="date"
              value={formatDate(selectedDate)}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setSelectedDate(newDate);
              }}
              className="border border-border rounded-md px-3 py-2 text-sm bg-card text-foreground"
            /> */}
            <div>
              <DatePicker
                selectedDate={selectedDate}
                setSelectedDate={(date) => {
                  if (!date) return;

                  const today = new Date(yesterday);
                  // Prevent selecting today or future
                  if (date >= today) {
                    // Optionally set to yesterday if user tries today/future
                    const yesterday = new Date(today);

                    setSelectedDate(yesterday);
                  } else {
                    setSelectedDate(date);
                  }
                }}
              />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-card border border-border rounded-md px-4 py-2 text-sm pr-8 cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest</option>
                <option value="profit">Highest Profit</option>
                <option value="loss">Highest Loss</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {loading ? (
              <Card className="bg-card border-border p-6 text-center">
                <p>Loading predictions...</p>
              </Card>
            ) : sortedData.length > 0 ? (
              sortedData.map((item) => (
                <Card
                  key={item.id}
                  className="bg-card border-border p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="font-bold text-lg">{item.match}</h3>
                        <p className="text-foreground/60 text-sm">
                          {item.league}
                        </p>
                      </div>
                      <p className="text-foreground/60 text-sm">
                        Prediction: {item.prediction}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:flex md:gap-6 md:items-center">
                      <div className="text-right md:text-center">
                        <p className="text-foreground/60 text-xs mb-1">Odds</p>
                        <p className="font-semibold">{item.odds}</p>
                      </div>
                      {/* <div className="text-right md:text-center">
                        <p className="text-foreground/60 text-xs mb-1">
                          Profit
                        </p>
                        <p
                          className={`font-semibold ${
                            item.profit >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          ${item.profit > 0 ? "+" : ""}
                          {item.profit}
                        </p>
                      </div> */}
                      <div className="text-right md:text-center">
                        <p className="text-foreground/60 text-xs mb-1">
                          Result
                        </p>
                        <Badge
                          className={
                            item.result === "Won"
                              ? "bg-green-500 text-white"
                              : item.result === "Lost"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-white"
                          }
                        >
                          {item.result}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="bg-card border-border p-6 text-center">
                <p className="text-foreground/60">
                  No predictions found for this date.
                </p>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
