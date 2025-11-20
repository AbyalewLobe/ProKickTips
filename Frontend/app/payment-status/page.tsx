"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
// Use server-side callback route to verify payment (do NOT call Chapa directly from the client)

export default function PaymentStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, upgradeTier } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");

    if (!tx_ref) {
      setStatus("failed");
      setMessage("No transaction reference found");
      return; // ⛔ STOP HERE
    }

    const verifyTransaction = async () => {
      try {
        const res = await fetch("/api/chapa/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx_ref }),
        });

        const result = await res.json();

        if (res.ok && result?.success && result?.data?.status === "success") {
          setStatus("success");
          setMessage("Payment successful! Upgrading your account...");

          // Update user tier
          upgradeTier("premium");

          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          setStatus("failed");
          setMessage(
            result?.message || "Payment was not completed. Please try again."
          );
        }
      } catch (error) {
        console.error("Payment verify error", error);
        setStatus("failed");
        setMessage("Failed to verify payment. Please contact support.");
      }
    };

    verifyTransaction();
  }, [searchParams, upgradeTier, router]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
              <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
              <p className="text-foreground/60">
                Please wait while we verify your payment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-foreground/60 mb-6">{message}</p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
              <p className="text-foreground/60 mb-6">{message}</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/pricing")}
                  variant="outline"
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1"
                >
                  Dashboard
                </Button>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
