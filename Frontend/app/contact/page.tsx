"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone } from "lucide-react";
import api from "../api/api";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // basic validation
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in all fields.");
      setStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/contacts", { fullName, email, message });
      //   const res = await fetch("/contacts", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ name, email, message }),
      //   });
      // If you're using fetch instead of axios, uncomment the block below to handle non-OK responses:
      //   if (!res.ok) {
      //     const data = await res.json().catch(() => ({}));
      //     throw new Error(data?.message || "Failed to send message");
      //   }
      //
      // For axios (common for api.post), it throws on non-2xx responses by default, so no manual json() parsing is needed.

      setStatus("success");
      setFullName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error("Contact submit error", err);
      setErrorMsg(err?.message || "Failed to send message");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Have a question, partnership idea, or feedback? Send us a message
              and we'll respond as soon as we can.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-4">Get in touch</h3>
                <p className="text-foreground/60 mb-4">
                  Prefer to reach us directly? Use the contact details below.
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <Mail className="text-primary" />
                  <a
                    className="text-foreground/80"
                    href="mailto:hello@prokicktips.com"
                  >
                    hello@prokicktips.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-primary" />
                  <span className="text-foreground/80">+251 900 000 000</span>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="bg-card border-border p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-foreground/70">
                      Full name
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
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

                  <div>
                    <label className="text-sm text-foreground/70">
                      Message
                    </label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help?"
                      rows={6}
                    />
                  </div>

                  {status === "success" && (
                    <p className="text-sm text-green-600">
                      Thanks — your message was sent.
                    </p>
                  )}
                  {status === "error" && errorMsg && (
                    <p className="text-sm text-red-600">{errorMsg}</p>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
