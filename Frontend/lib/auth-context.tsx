"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ import this
import api from "@/app/api/api";

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  access: "free" | "premium";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  upgradeTier: (tier: "free" | "premium") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // ✅ initialize router
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      setUser(res.data.user);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", { email, password, name });
      setUser(res.data.user);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
      setUser(null);
      router.push("/"); // ✅ redirect to landing page after logout
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  const upgradeTier = async (tier: "free" | "premium") => {
    setLoading(true);
    try {
      // Use the existing protected profile update endpoint to change access/tier
      await api.put("/auth/profile", { access: tier });
      // Refresh local user state from server
      await refreshUser();
    } catch (err) {
      console.error("Failed to upgrade tier", err);
      // Fallback: update local state so UI reflects change even if server call failed
      setUser((prev) => (prev ? { ...prev, access: tier } : prev));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        upgradeTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

//Login Response User Object Examples
// {
//     "id": "69159e045af587b6023463a7",
//     "name": "user",
//     "email": "user@gmail.com",
//     "acess": "premium",
//     "role": "user"
// }

// Profile Response User Object Examples
// {
//     "_id": "69159e045af587b6023463a7",
//     "name": "user",
//     "email": "user@gmail.com",
//     "role": "user",
//     "access": "premium",
//     "createdAt": "2025-11-13T08:59:48.811Z"
// }
