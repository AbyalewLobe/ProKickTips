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
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import api from "@/app/api/api.js";

interface Blog {
  id: string;
  title: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Blog | null>(null);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState<Partial<Blog>>({
    title: "",
    content: "",
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs");
      const items = res.data?.data || res.data || [];
      const normalized: Blog[] = items.map((b: any) => ({
        id: b._id || b.id,
        title: b.title,
        content: b.content,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      }));
      setBlogs(normalized);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () =>
    setForm({
      title: "",
      content: "",
    });

  const handleCreate = async () => {
    try {
      setLoading(true);
      const payload = {
        title: form.title,
        content: form.content,
      };
      const res = await api.post("/blogs", payload);
      const created = res.data?.data || res.data;
      setBlogs((prev) => {
        const newBlog: Blog = {
          id: created._id || created.id || "",
          title: created.title,
          content: created.content,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        };
        return [newBlog, ...prev];
      });
      resetForm();
    } catch (err) {
      console.error("Failed to create blog", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      setLoading(true);
      const payload = {
        title: form.title,
        content: form.content,
      };
      const res = await api.put(`/blogs/${editing.id}`, payload);
      const updated = res.data?.data || res.data;
      setBlogs((prev) =>
        prev.map((b) => (b.id === editing.id ? { ...b, ...updated } : b))
      );
      setEditing(null);
      resetForm();
    } catch (err) {
      console.error("Failed to update blog", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      setLoading(true);
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      if (selected?.id === id) setSelected(null);
      if (editing?.id === id) {
        setEditing(null);
        resetForm();
      }
    } catch (err) {
      console.error("Failed to delete blog", err);
    } finally {
      setLoading(false);
    }
  };

  const beginEdit = (b: Blog) => {
    setEditing(b);
    setForm({
      title: b.title,
      content: b.content,
    });
    setSelected(null);
  };

  const viewBlog = (b: Blog) => {
    setSelected(b);
    setEditing(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Blogs</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setCreating((prev) => !prev); // toggle
              setEditing(null);
              resetForm();
              setSelected(null);
            }}
          >
            <Plus size={16} /> New
          </Button>
        </div>
      </div>

      {(creating || editing) && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              className="input w-full"
              placeholder="Title"
              value={form.title || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <textarea
            className="textarea w-full h-40"
            placeholder="Content"
            value={form.content || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
          />

          <div className="flex gap-2 mt-4">
            {editing ? (
              <>
                <Button onClick={handleUpdate} disabled={loading}>
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditing(null);
                    setCreating(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleCreate} disabled={loading}>
                  Create Blog
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCreating(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
      <Card className="">
        <h3 className="text-lg font-bold mb-4">All Posts</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.title}</TableCell>
                  <TableCell className="text-sm">
                    {b.createdAt
                      ? new Date(b.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewBlog(b)}
                        className="flex items-center gap-2"
                      >
                        <Eye size={14} />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => beginEdit(b)}
                        className="flex items-center gap-2"
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
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
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selected.id)}
              >
                Delete
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 font-medium">Content</p>
            <div className="bg-muted p-4 rounded">
              <pre className="whitespace-pre-wrap">{selected.content}</pre>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
