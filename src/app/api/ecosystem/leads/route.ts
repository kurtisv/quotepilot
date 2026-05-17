import { NextResponse } from "next/server";
import { z } from "zod";

import { publishEcosystemEvent } from "@/lib/ecosystem";

const leadSchema = z.object({
  flowId: z.string().min(3),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  projectType: z.string().min(2),
  budgetRange: z.string().min(2),
  message: z.string().min(10),
  sourceApp: z.literal("luma-studio").default("luma-studio"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid Luma lead payload" }, { status: 400 });
  }

  const lead = parsed.data;
  const event = await publishEcosystemEvent({
    flowId: lead.flowId,
    sourceApp: "luma-studio",
    targetApps: ["quotepilot", "api-meter"],
    eventType: "lead.created",
    entityType: "lead",
    customerName: lead.name,
    customerEmail: lead.email,
    title: "Nouveau lead depuis Luma Studio",
    description: `${lead.name} a soumis une demande ${lead.projectType} avec budget ${lead.budgetRange}.`,
    payload: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? "",
      projectType: lead.projectType,
      budgetRange: lead.budgetRange,
      message: lead.message,
      receivedVia: "quotepilot-ingest-api",
    },
    priority: "HIGH",
    actionLabel: "Creer une soumission",
    actionUrl: "/dashboard",
  });

  if (!event) {
    return NextResponse.json({ ok: false, error: "Lead could not be recorded" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, flowId: event.flowId, eventId: event.id });
}
