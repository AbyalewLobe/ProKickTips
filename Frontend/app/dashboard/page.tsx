"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import type { Prediction } from "@/lib/predictions";
import api from "@/app/api/api.js";
import { PredictionsTable } from "@/components/predictions-table";
import { UserSidebar } from "@/components/user-sidebar";
import { ProfileSettings } from "@/components/user-profile-settings";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DatePicker from "@/components/calendar";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  console.log("user in dashboard:", user);
  const [activeSection, setActiveSection] = useState<
    "free" | "premium" | "settings"
  >("free");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    // Wait until auth finishes loading before redirecting.
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }
    if (user?.role === "admin") {
      router.push("/admin");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchPredictions = async () => {
      setLoading(true);
      try {
        const res = await api.get("/prediction");
        const items: any[] = res.data?.data || [];
        const normalized: Prediction[] = items.map((p) => ({
          _id: p._id || p.id,
          user: p.user?._id || p.user || "",
          match: p.match || "-",
          bet: p.bet || "-",
          odds: Number(p.odds || 0),
          type:
            (p.type || "free").toString().toLowerCase() === "premium"
              ? ("Premium" as any)
              : ("Free" as any),
          status:
            (p.status || "pending").toString().toLowerCase() === "won"
              ? ("Won" as any)
              : (p.status || "pending").toString().toLowerCase() === "lost"
              ? ("Lose" as any)
              : ("Pending" as any),
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));
        setPredictions(normalized);
      } catch (err) {
        console.error("Failed to fetch predictions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [user]);

  // while auth is loading, don't render or redirect
  if (authLoading) return null;

  if (!user || user.role === "admin") return null;

  // Filter by type (free/premium)
  let filteredPredictions = predictions.filter((p) => {
    if (activeSection === "free")
      return (p.type || "").toString().toLowerCase() === "free";
    if (activeSection === "premium")
      return (p.type || "").toString().toLowerCase() === "premium";
    return true;
  });

  // Filter by selected date
  if (selectedDate) {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    filteredPredictions = filteredPredictions.filter(
      (p) => p.createdAt?.split("T")[0] === formattedDate
    );
  }

  const handlePrevDay = () => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-foreground/60 mb-6">
              View available football predictions
            </p>
          </div>

          {/* Date Filter Buttons */}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card border-border p-6">
              <p className="text-foreground/60 text-sm mb-2">Current Access</p>
              <p className="text-3xl font-bold capitalize text-primary">
                {user.access}
              </p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-foreground/60 text-sm mb-2">
                Available Predictions
              </p>
              <p className="text-3xl font-bold">{filteredPredictions.length}</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-foreground/60 text-sm mb-2">Win Rate</p>
              <p className="text-3xl font-bold">
                {filteredPredictions.length > 0
                  ? `${Math.round(
                      (filteredPredictions.filter(
                        (p) =>
                          (p.status || "").toString().toLowerCase() === "won"
                      ).length /
                        filteredPredictions.length) *
                        100
                    )}%`
                  : "0%"}
              </p>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <UserSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <p>Loading predictions...</p>
              ) : activeSection === "settings" ? (
                <ProfileSettings />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h2 className="text-2xl font-bold capitalize">
                      {activeSection} Predictions
                    </h2>
                    <div className="flex items-center gap-2 mb-6">
                      <Button
                        onClick={handlePrevDay}
                        variant="outline"
                        size="icon"
                        disabled={!selectedDate}
                      >
                        <ArrowLeft size={18} />
                      </Button>

                      <div>
                        <DatePicker
                          selectedDate={selectedDate}
                          setSelectedDate={setSelectedDate}
                        />
                      </div>

                      <Button
                        onClick={handleNextDay}
                        variant="outline"
                        size="icon"
                        disabled={!selectedDate}
                      >
                        <ArrowRight size={18} />
                      </Button>
                    </div>
                  </div>
                  <PredictionsTable
                    predictions={filteredPredictions}
                    showType={user.access === "premium"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
