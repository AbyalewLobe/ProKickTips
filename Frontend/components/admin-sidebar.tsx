"use client";

import type React from "react";
import { FileText, Users, Settings, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export type AdminTab =
  | "predictions"
  | "users"
  | "contacts"
  | "blogs"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { logout } = useAuth();

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "predictions",
      label: "Manage Predictions",
      icon: <FileText size={20} />,
    },
    { id: "users", label: "Manage Users", icon: <Users size={20} /> },
    { id: "contacts", label: "Contacts", icon: <Mail size={20} /> },
    { id: "blogs", label: "Manage Blogs", icon: <FileText size={20} /> },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-foreground/5"
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent"
        >
          <LogOut size={20} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
