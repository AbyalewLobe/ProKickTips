"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import type { Prediction } from "@/lib/predictions";
import { PredictionsTable } from "@/components/predictions-table";
import { useAuth } from "@/lib/auth-context";

interface ManagePredictionsProps {
  predictions: Prediction[];
  onStatusChange: (
    _id: string,
    status: "pending" | "won" | "lost"
  ) => Promise<void>;
  onAddPrediction: (prediction: Prediction) => Promise<void>;
  loading: boolean;
}

export function ManagePredictions({
  predictions,
  onStatusChange,
  onAddPrediction,
  loading,
}: ManagePredictionsProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    match: "",
    bet: "",
    odds: "",
    type: "free" as "free" | "premium",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + 1);
    // prevent going beyond today
    const today = new Date();
    if (formatDate(next) <= formatDate(today)) {
      setSelectedDate(next);
    }
  };

  // Filter predictions by selectedDate
  const filteredPredictions = predictions.filter((p) => {
    if (!p.createdAt) return false;
    const created = new Date(p.createdAt);
    return formatDate(created) === formatDate(selectedDate);
  });

  const handleAddPrediction = async () => {
    if (!formData.match || !formData.bet || !formData.odds) {
      alert("Please fill all fields");
      return;
    }

    if (!user?._id) {
      console.error("User ID not found");
      return;
    }

    const newPrediction: Prediction = {
      match: formData.match,
      bet: formData.bet,
      odds: Number(formData.odds),
      type: formData.type,
      status: "pending",
      user: user._id,
    } as any;

    try {
      await onAddPrediction(newPrediction);
      setFormData({ match: "", bet: "", odds: "", type: "free" });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add prediction", error);
    }
  };

  const wonCount = filteredPredictions.filter(
    (p) => (p.status ?? "").toLowerCase() === "won"
  ).length;
  const totalCount = filteredPredictions.length;
  const winRate =
    totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-4">
          <p className="text-foreground/60 text-sm mb-2">Total Predictions</p>
          <p className="text-3xl font-bold">{totalCount}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-foreground/60 text-sm mb-2">Won</p>
          <p className="text-3xl font-bold text-green-500">{wonCount}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-foreground/60 text-sm mb-2">Win Rate</p>
          <p className="text-3xl font-bold text-primary">{winRate}%</p>
        </Card>
      </div>

      {/* Add Prediction Form */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Add New Prediction</h3>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={18} />
            {showForm ? "Cancel" : "New Prediction"}
          </Button>
        </div>

        {showForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPrediction();
            }}
            className="space-y-4 p-4 bg-foreground/5 rounded-lg border border-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Match</label>
                <Input
                  type="text"
                  placeholder="e.g., Manchester United vs Liverpool"
                  value={formData.match}
                  onChange={(e) =>
                    setFormData({ ...formData, match: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bet</label>
                <Input
                  type="text"
                  placeholder="e.g., Over 2.5 Goals"
                  value={formData.bet}
                  onChange={(e) =>
                    setFormData({ ...formData, bet: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Odds</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1.95"
                  value={formData.odds}
                  onChange={(e) =>
                    setFormData({ ...formData, odds: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "free" | "premium",
                    })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Prediction
            </Button>
          </form>
        )}
      </Card>

      {/* Predictions Table */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Predictions</h3>

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
              {selectedDate.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
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
        </div>

        {loading ? (
          <p>Loading predictions...</p>
        ) : filteredPredictions.length > 0 ? (
          <PredictionsTable
            predictions={filteredPredictions}
            showType={true}
            onStatusChange={onStatusChange}
            isAdmin={true}
          />
        ) : (
          <p className="text-muted-foreground">
            No predictions found for this date.
          </p>
        )}
      </Card>
    </div>
  );
}
