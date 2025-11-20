"use client";
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import api from "@/app/api/api.js";

interface User {
  id: string;
  email: string;
  name?: string;
  access: string;
  createdAt: string;
}

interface ManageUsersProps {
  onUserAction?: (action: string, userId: string) => void;
}

export function ManageUsers({ onUserAction }: ManageUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      // Backend returns an array of users
      const items = Array.isArray(res.data) ? res.data : res.data.users || [];
      // Normalize to local User shape
      const normalized: User[] = items.map((u: any) => ({
        id: u._id || u.id,
        email: u.email,
        name: u.name,
        access: u.access || u.tier || "Free",
        createdAt: u.createdAt,
      }));
      setUsers(normalized);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTogglePremium = async (userId: string) => {
    try {
      setLoading(true);
      const res = await api.put(`/users/${userId}/access`);
      const updated = res.data.user || res.data;
      // update local list
      setUsers((prev) =>
        prev.map((u) =>
          u.id === updated.id
            ? { ...u, access: updated.access || updated.tier }
            : u
        )
      );
      onUserAction?.("toggle", userId);
    } catch (error) {
      console.error("Failed to toggle access", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      onUserAction?.("delete", userId);
    } catch (error) {
      console.error("Failed to delete user", error);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const premiumUsers = users.filter(
    (u) => (u.access || "").toLowerCase() === "premium"
  ).length;
  const freeUsers = users.filter(
    (u) => (u.access || "").toLowerCase() === "free"
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-4">
          <p className="text-foreground/60 text-sm mb-2">Total Users</p>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-foreground/60 text-sm mb-2">Premium Users</p>
          <p className="text-3xl font-bold text-primary">{premiumUsers}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-foreground/60 text-sm mb-2">Free Users</p>
          <p className="text-3xl font-bold">{freeUsers}</p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold mb-4">All Users</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name || "—"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        (user.access || "").toLowerCase() === "premium"
                          ? "bg-primary/20 text-primary"
                          : "bg-foreground/10 text-foreground/60"
                      }`}
                    >
                      {(user.access || "").toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={
                        (user.access || "").toLowerCase() === "premium"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleTogglePremium(user.id)}
                      className={`${
                        (user.access || "").toLowerCase() === "premium"
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border-foreground/20"
                      }`}
                    >
                      {(user.access || "").toLowerCase() === "premium"
                        ? "Premium"
                        : "Free"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-600 hover:cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
