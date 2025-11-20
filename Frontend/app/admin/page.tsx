"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { Prediction } from "@/lib/predictions";
import { AdminSidebar, type AdminTab } from "@/components/admin-sidebar";
import { ManagePredictions } from "@/components/admin/manage-predictions";
import { ManageUsers } from "@/components/admin/manage-users";
import { AdminSettings } from "@/components/admin/admin-settings";
import { ManageContactMessages } from "@/components/admin/manage-contact-messages";
import ManageBlogs from "@/components/admin/manage-blogs";
import api from "@/app/api/api.js";

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("predictions");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users
  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") router.push("/login");
  }, [user, router]);

  // Fetch predictions
  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/prediction");
      console.log(res);

      setPredictions(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch predictions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchPredictions();
  }, [user]);

  // Update prediction status
  const handleStatusChange = async (
    id: string,
    status: "pending" | "won" | "lost"
  ) => {
    try {
      const statusMap: Record<string, string> = {
        pending: "Pending",
        won: "Won",
        lost: "Lose",
      };
      const payloadStatus = statusMap[status] || status;
      const res = await api.put(`/prediction/${id}/status`, {
        status: payloadStatus,
      });
      const updated = res?.data?.prediction ?? res?.data;
      setPredictions((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Add a new prediction
  const handleAddPrediction = async (newPrediction: Prediction) => {
    try {
      const res = await api.post("/prediction", newPrediction);
      setPredictions((prev) => [res.data.prediction || res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add prediction", err);
    }
  };

  // Mobile tab change handler
  const handleMobileTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // close overlay
    const content = document.getElementById("admin-content");
    if (content) content.scrollIntoView({ behavior: "smooth" });
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="md:flex-1 md:flex relative grid-col">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Mobile top bar */}
        <div className="md:hidden w-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={18} />
              </Button>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Dark overlay */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="relative z-50 w-64 bg-card border-r border-border h-full overflow-auto">
              <div className="p-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X size={18} />
                </Button>
              </div>
              <AdminSidebar
                activeTab={activeTab}
                onTabChange={handleMobileTabChange}
              />
            </div>
          </div>
        )}

        {/* Main content */}
        <div
          id="admin-content"
          className="flex-1 overflow-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {activeTab === "predictions" && (
            <ManagePredictions
              predictions={predictions}
              onStatusChange={handleStatusChange}
              onAddPrediction={handleAddPrediction}
              loading={loading}
            />
          )}
          {activeTab === "users" && <ManageUsers />}
          {activeTab === "contacts" && <ManageContactMessages />}
          {activeTab === "blogs" && <ManageBlogs />}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
