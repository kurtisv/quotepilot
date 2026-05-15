import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "API docs not available in this build." }, { status: 404 });
}
