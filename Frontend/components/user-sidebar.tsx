"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, LogOut, Lock, TrendingUp } from "lucide-react";
import { redirect } from "next/dist/server/api-utils";

interface UserSidebarProps {
  activeSection: "free" | "premium" | "settings";
  onSectionChange: (section: "free" | "premium" | "settings") => void;
}

export function UserSidebar({
  activeSection,
  onSectionChange,
}: UserSidebarProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const access = user?.access?.toString().trim().toLowerCase();

  return (
    <div className="space-y-4">
      {/* Navigation Items */}
      <Card className="bg-card border-border p-4">
        <div className="space-y-2">
          {/* Free Predictions */}
          <Button
            variant={activeSection === "free" ? "default" : "outline"}
            className="w-full justify-start gap-2"
            onClick={() => onSectionChange("free")}
          >
            <TrendingUp size={18} />
            <span>Free Predictions</span>
          </Button>

          {/* Premium Predictions - Only for premium users */}
          {access === "premium" && (
            <Button
              variant={activeSection === "premium" ? "default" : "outline"}
              className="w-full justify-start gap-2"
              onClick={() => onSectionChange("premium")}
            >
              <TrendingUp size={18} />
              <span>Premium Predictions</span>
            </Button>
          )}

          {/* Settings */}
          <Button
            variant={activeSection === "settings" ? "default" : "outline"}
            className="w-full justify-start gap-2"
            onClick={() => onSectionChange("settings")}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Button>
        </div>
      </Card>

      {/* Premium Upgrade - Only for free users */}
      {access === "free" && (
        <Card className="bg-primary/10 border border-primary/30 p-6">
          <div className="flex gap-2 mb-4">
            <Lock className="text-primary" size={24} />
            <div>
              <h3 className="font-bold">Unlock Premium</h3>
              <p className="text-sm text-foreground/60">
                See expert premium picks
              </p>
            </div>
          </div>
          <a href="/pricing">
            {" "}
            <Button className="w-full">Upgrade Now</Button>
          </a>
        </Card>
      )}

      {/* Premium Status - Only for premium users */}
      {access === "premium" && (
        <Card className="bg-purple-500/10 border border-purple-500/30 p-6">
          <div className="flex gap-2 mb-4">
            <TrendingUp className="text-purple-400" size={24} />
            <div>
              <h3 className="font-bold">Premium Member</h3>
              <p className="text-sm text-foreground/60">
                Full access to predictions
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Logout Button */}
      <Button variant="destructive" className="w-full gap-2" onClick={logout}>
        <LogOut size={18} />
        Logout
      </Button>
    </div>
  );
}
