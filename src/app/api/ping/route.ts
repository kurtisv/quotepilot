import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const secret = req.headers.get("x-ping-secret") ?? req.nextUrl.searchParams.get("secret");

  if (process.env.PING_SECRET && secret !== process.env.PING_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, time: new Date().toISOString() });
}
