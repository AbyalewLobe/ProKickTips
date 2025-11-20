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
import { Trash2, Mail } from "lucide-react";
import api from "@/app/api/api.js";
import DatePicker from "../calendar";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  message: string;
  createdAt?: string;
  user?: { _id?: string; name?: string; email?: string } | null;
  read: boolean;
}

export function ManageContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contacts");
      const items = res.data?.data || res.data || [];

      const normalized: ContactMessage[] = items.map((m: any) => ({
        id: m._id || m.id,
        fullName: m.fullName || m.name || "",
        email: m.email,
        message: m.message,
        createdAt: m.createdAt,
        user: m.user || null,
        read: m.read || false,
      }));

      // --- DATE FILTERING ---
      let filtered = normalized;

      if (selectedDate) {
        filtered = normalized.filter((m) => {
          if (!m.createdAt) return false;
          const msgDate = new Date(m.createdAt);
          return msgDate.toDateString() === selectedDate.toDateString();
        });
      }

      setMessages(filtered);
    } catch (err) {
      console.error("Failed to load contact messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedDate]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      setLoading(true);
      await api.delete(`/contacts/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error("Failed to delete contact message", err);
    } finally {
      setLoading(false);
    }
  };
  const markAsRead = async (m) => {
    try {
      setLoading(true);
      await api.put(`/contacts/${m.id}/read`);
      // Update local state to reflect read status
      setMessages((prev) =>
        prev.map((msg) => (msg.id === m.id ? { ...msg, read: true } : msg))
      );
      setSelected(m);
    } catch (err) {
      console.error("Failed to mark contact message as read", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-4">
          <p className="text-foreground/60 text-sm mb-2">Total Messages</p>
          <p className="text-3xl font-bold">{messages.length}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-foreground/60 text-sm mb-2">Unread</p>
          <p className="text-3xl font-bold">
            {messages.filter((m) => !m.read).length}
          </p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-foreground/60 text-sm mb-2">Latest</p>
          <p className="text-3xl font-bold">
            {messages[0]?.createdAt
              ? new Date(messages[0].createdAt).toLocaleDateString()
              : "—"}
          </p>
        </Card>
      </div>

      <Card className="bg-card border-border p-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold mb-4">Contact Messages</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-[250px]">
              <DatePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>

            <Button
              variant="secondary"
              onClick={() => setSelectedDate(undefined)}
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((m) => (
                <TableRow key={m.id} className="align-top">
                  <TableCell className="font-medium">
                    {m.fullName || m.user?.name || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {m.email || m.user?.email}
                  </TableCell>
                  <TableCell className="text-sm">
                    {m.message?.slice(0, 80) || "—"}
                    {m.message && m.message.length > 80 ? "..." : ""}
                  </TableCell>
                  <TableCell className="text-sm">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => setSelected(m)}
                        onClick={() => markAsRead(m)}
                        className="flex items-center gap-2"
                      >
                        <Mail size={16} /> View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(m.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selected && (
        <Card className="bg-card border-border p-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold">
                {selected.fullName || selected.user?.name}
              </h4>
              <p className="text-sm text-foreground/60">
                {selected.email || selected.user?.email}
              </p>
              <p className="text-sm text-foreground/60 mt-2">
                Received:{" "}
                {selected.createdAt
                  ? new Date(selected.createdAt).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selected.id)}
              >
                Delete
              </Button>
            </div>
          </div>

          <div className="mt-4 bg-muted p-4 rounded">
            <pre className="whitespace-pre-wrap text-sm">
              {selected.message}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ManageContactMessages;
