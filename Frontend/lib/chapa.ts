export const CHAPA_CONFIG = {
  publicKey: "CHAPUBK_TEST-uyoB4pcuKFIKOgz2ogWXWVIMLAEHBcHv",
  secretKey: "CHASECK_TEST-1vKn9DAFrZxQQi2wBkaGnK4lWmylGVoq",
  baseUrl: "https://api.chapa.co/v1",
};

export interface ChapaPaymentPayload {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization?: {
    title: string;
    description: string;
  };
}

export async function initiateChapaPayment(payload: ChapaPaymentPayload) {
  try {
    console.log(
      "[v0] Initiating Chapa payment with payload:",
      JSON.stringify(payload, null, 2)
    );

    //  fetch("https://api.chapa.co/v1/transaction/initialize", requestOptions)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${CHAPA_CONFIG.secretKey}`);
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(
      `${CHAPA_CONFIG.baseUrl}/transaction/initialize`,
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(payload),
        redirect: "follow",
      }
    );

    let data: any;
    try {
      data = await response.json();
    } catch (err) {
      const text = await response.text().catch(() => "<no body>");
      console.error("[v0] Chapa response not JSON:", text);
      throw new Error("Chapa responded with invalid JSON");
    }

    if (!response.ok) {
      console.error("[v0] Chapa API error:", data);
      const msg =
        data?.message ||
        data?.error ||
        JSON.stringify(data) ||
        "Failed to initiate payment";
      throw new Error(msg);
    }

    if (data?.status !== "success" || !data?.data) {
      console.error("[v0] Unexpected Chapa response:", data);
      throw new Error(data?.message || "Failed to initiate payment");
    }

    return data.data;
  } catch (error) {
    console.error("[v0] Chapa payment error:", error);
    throw error;
  }
}

export async function verifyPayment(tx_ref: string) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${CHAPA_CONFIG.secretKey}`);
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(
      `${CHAPA_CONFIG.baseUrl}/transaction/verify/${tx_ref}`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    );

    let data: any;
    try {
      data = await response.json();
    } catch (err) {
      const text = await response.text().catch(() => "<no body>");
      console.error("[v0] Chapa verify response not JSON:", text);
      throw new Error("Chapa verify responded with invalid JSON");
    }

    if (!response.ok) {
      console.error("[v0] Chapa verify error:", data);
      const msg =
        data?.message ||
        data?.error ||
        JSON.stringify(data) ||
        "Verification failed";
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Chapa verification error:", error);
    throw error;
  }
}
