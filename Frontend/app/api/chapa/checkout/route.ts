// /app/api/chapa/checkout/route.ts

import { NextResponse } from "next/server";
import { initiateChapaPayment } from "@/lib/chapa";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, plan, userId } = body;

    if (!email || !email.trim() || !name || !name.trim() || !plan) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const planDetails: Record<string, { amount: number; title: string }> = {
      premium: { amount: 2900, title: "Premium Plan - Monthly" },
      professional: { amount: 9900, title: "Professional Plan - Monthly" },
    };

    const details = planDetails[plan];
    if (!details) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ") || "User";

    const tx_ref = `prokicktips_${userId}_${Date.now()}`;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const callbackUrl = `${baseUrl}/api/chapa/callback?tx_ref=${tx_ref}`;
    const returnUrl = `http://localhost:3000/payment-status?tx_ref=${tx_ref}`;

    console.log("[v0] Checkout request URLs:", { callbackUrl, returnUrl });

    const payload = {
      amount: details.amount,
      currency: "ETB",
      email: email.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      tx_ref,
      callback_url: callbackUrl,
      return_url: returnUrl,
      customization: {
        title: "ProKickTips",
        description: details.title,
      },
    };

    console.log("[v0] Payload for Chapa:", payload);

    const chapaResponse = await initiateChapaPayment(payload);

    return NextResponse.json({
      checkoutUrl: chapaResponse.checkout_url,
      tx_ref,
    });
  } catch (error: any) {
    console.error("[Checkout Error]:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
