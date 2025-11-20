"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/app/api/api";
import { useAuth } from "@/lib/auth-context";

type Tab = "profile" | "security";

export function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile fields
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Security fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      await api.put("/auth/profile", { name, email });
      setProfileMessage("Profile updated successfully");
      await refreshUser();
    } catch (err) {
      console.error(err);
      setProfileMessage("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);
    if (!oldPassword || !newPassword) {
      setPasswordMessage("Please fill in both fields.");
      return;
    }
    // basic length validation
    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters.");
      return;
    }

    setChangingPassword(true);
    try {
      // backend expects POST /auth/change-password (protected)
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      setPasswordMessage("Password changed successfully");
      // clear fields
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to change password";
      setPasswordMessage(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Settings</h3>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "profile" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </Button>
          <Button
            variant={activeTab === "security" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("security")}
          >
            Security
          </Button>
        </div>
      </div>

      {activeTab === "profile" ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-foreground/70">Full name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="text-sm text-foreground/70">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </div>

          {profileMessage && (
            <p className="text-sm text-foreground/80">{profileMessage}</p>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-foreground/70">
              Current password
            </label>
            <Input
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="◽◽◽◽◽◽◽◽"
              type="password"
            />
          </div>

          <div>
            <label className="text-sm text-foreground/70">New password</label>
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="◽◽◽◽◽◽◽◽"
              type="password"
            />
          </div>
          {passwordMessage && (
            <p className="text-sm text-foreground/80">{passwordMessage}</p>
          )}

          <div className="flex gap-2">
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? "Changing..." : "Change password"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
