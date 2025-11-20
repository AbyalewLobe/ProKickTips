import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { tx_ref } = await req.json();

  const response = await fetch(
    `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
