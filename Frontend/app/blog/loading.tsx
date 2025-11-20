"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full flex flex-col items-center gap-4 text-center">
          <Spinner className="h-10 w-10 text-primary" />
          <h3 className="text-lg font-semibold">Loading blog</h3>
          <p className="text-sm text-foreground/60">
            Fetching recent articles…
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
