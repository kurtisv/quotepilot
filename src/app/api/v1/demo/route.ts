import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "Demo API not available in this project." }, { status: 404 });
}
