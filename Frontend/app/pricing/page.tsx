"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for casual bettors",
    features: [
      "Daily Free predictions",
      // "Limited to 3 predictions/day",
      // "7-day history",
      // "Basic stats",
      // "Email updates",
    ],
    cta: "Get Started",
    highlighted: false,
    plan_id: "free",
  },
  {
    name: "Premium",
    price: "$10",
    period: "/month",
    description: "For serious bettors",
    features: [
      "All Free features",
      "Premium predictions",
      // "Advanced analysis",
      // "90-day history",
      // "Expert insights",
      "Early notifications",
      "Priority support",
      // "Win rate stats",
    ],
    cta: "Subscribe Now",
    highlighted: true,
    plan_id: "premium",
  },
  // {
  //   name: "Professional",
  //   price: "$99",
  //   period: "/month",
  //   description: "For betting syndicates",
  //   features: [
  //     "All Premium features",
  //     "Custom predictions",
  //     "VIP support",
  //     "API access",
  //     "Team accounts (5)",
  //     "Advanced analytics",
  //     "Live prediction updates",
  //     "Performance reports",
  //   ],
  //   cta: "Contact Sales",
  //   highlighted: false,
  //   plan_id: "professional",
  // },
];

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (planId === "free") {
      router.push("/dashboard");
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch("/api/chapa/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          plan: planId,
          userId: user._id,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Failed to initiate checkout. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col  bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto text-balance">
              Choose the plan that works best for you. No hidden fees, cancel
              anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 place-items-center">
            {plans.map((plan) => (
              <Card
                key={plan.plan_id}
                className={`
        p-8 flex flex-col transition-all border mx-auto
        max-w-sm w-full
        ${
          plan.highlighted
            ? "md:scale-105 border-primary shadow-lg shadow-primary/20"
            : "border-border"
        }
      `}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-foreground/60 text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-foreground/60">{plan.period}</span>
                </div>

                <Button
                  onClick={() => handleCheckout(plan.plan_id)}
                  disabled={loading === plan.plan_id}
                  className="mb-8 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {loading === plan.plan_id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>

                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check
                        size={20}
                        className="text-primary flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-foreground/70">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card className="bg-card border-border p-6">
                <h4 className="font-semibold mb-2">
                  Can I change plans anytime?
                </h4>
                <p className="text-foreground/60 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes take effect immediately.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                <p className="text-foreground/60 text-sm">
                  The Free plan includes full access to daily predictions.
                  Premium features can be tested with a 7-day trial.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h4 className="font-semibold mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-foreground/60 text-sm">
                  We accept all major credit cards, PayPal, and bank transfers
                  for annual subscriptions.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
