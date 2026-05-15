import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ received: false, error: "Stripe not configured." }, { status: 404 });
}
