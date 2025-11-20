"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/app/api/api.js";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorName?: string;
  createdAt?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/blogs");
        const data = res.data?.data || res.data || [];
        const normalized = data.map((p: any) => ({
          id: p._id || p.id,
          title: p.title,
          content: p.content,
          authorName: p.author
            ? typeof p.author === "string"
              ? p.author
              : p.author.name || "Admin"
            : "Admin",
          createdAt: p.createdAt,
        }));
        setPosts(normalized);
      } catch (err) {
        console.error("Failed to load blog posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Our Blog</h1>
            <p className="text-foreground/60">Latest articles and updates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && <p>Loading...</p>}
            {!loading && posts.length === 0 && <p>No posts yet.</p>}
            {posts.map((p) => (
              <Card key={p.id} className="p-6 shadow-md shadow-slate-50">
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  By {p.authorName || "Admin"} •{" "}
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : "—"}
                </p>
                <p className="text-sm text-foreground/70 mb-4">
                  {p.content?.slice(0, 180)}
                  {p.content && p.content.length > 180 ? "..." : ""}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setSelected(p)}>
                    Read
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-w-3xl w-full">
              <Card className="p-6  shadow-lg shadow-slate-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{selected.title}</h2>
                    <p className="text-sm text-foreground/60">
                      By {selected.authorName || "Admin"}
                    </p>
                  </div>
                  <div>
                    <Button variant="ghost" onClick={() => setSelected(null)}>
                      Close
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <pre className="whitespace-pre-wrap">{selected.content}</pre>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
