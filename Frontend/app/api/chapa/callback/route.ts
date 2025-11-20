import { verifyPayment } from "@/lib/chapa"

export async function POST(request: Request) {
  try {
    const { tx_ref } = await request.json()

    if (!tx_ref) {
      return Response.json({ error: "Missing tx_ref" }, { status: 400 })
    }

    const verification = await verifyPayment(tx_ref)

    if (verification.status === "success" && verification.data.status === "success") {
      // Payment successful - in production, update database here
      // For now, the client will handle updating user tier via auth context
      return Response.json({ success: true, data: verification.data })
    } else {
      return Response.json({ success: false, message: "Payment not completed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Callback error:", error)
    return Response.json({ error: "Verification failed" }, { status: 500 })
  }
}
