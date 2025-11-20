"use client";

import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Bell,
  Disc,
  CheckCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import api from "@/app/api/api";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt?: string; // optional
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useAuth();

  // const [notifications, setNotifications] = useState([
  //   { id: 1, message: "New free prediction posted", read: false },
  //   { id: 2, message: "Your subscription is about to expire", read: false },
  //   { id: 3, message: "2 new premium predictions added", read: true },

  // ]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    console.log("Loading notifications for user:", user);
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/notifications");
        console.log("Fetched notifications:", data);
        setNotifications(data);
      } catch (error) {
        console.log("Error loading notifications", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    await api.patch("/notifications/mark-all-read");
  };

  const markOneAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );

    await api.patch(`/notifications/${id}/read`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">PK</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              ProKickTips
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/predictions"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Predictions
            </Link>
            <Link
              href="/history"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              History
            </Link>
            <Link
              href="/pricing"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-0"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <Bell />

                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                      <span className="font-medium text-sm">Notifications</span>

                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary hover:underline"
                        >
                          <CheckCheck
                            size={15}
                            className="hover:cursor-pointer"
                          />
                        </button>
                      )}
                    </div>

                    {/* List */}
                    {notifications.filter((n) => !n.read).length === 0 ? (
                      <p className="px-4 py-3 text-sm text-foreground/60">
                        No notifications
                      </p>
                    ) : (
                      notifications
                        .filter((n) => !n.read) // Show only unread
                        .map((notif) => (
                          <div
                            key={notif._id}
                            className="px-4 py-3 text-sm border-b border-border/40 last:border-b-0 bg-primary/5"
                          >
                            <div className="flex justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <Disc size={10} />
                                <span className="text-foreground/80">
                                  {notif.message}
                                </span>
                              </div>

                              <button
                                onClick={() => markOneAsRead(notif._id)}
                                className="text-xs text-primary hover:underline flex-shrink-0"
                              >
                                <CheckCheck
                                  size={10}
                                  className="hover:cursor-pointer"
                                />
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="gap-2"
                >
                  <User size={18} />
                  {user.name}
                </Button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 transition text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/pricing">Subscribe</Link>
                </Button>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/predictions"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground"
            >
              Predictions
            </Link>
            <Link
              href="/history"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground"
            >
              History
            </Link>
            <Link
              href="/pricing"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground"
            >
              About
            </Link>
            <div className="px-4 pt-4 flex gap-2">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1 bg-transparent"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1 bg-transparent"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/pricing">Subscribe</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
