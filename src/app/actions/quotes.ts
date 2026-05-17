"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/db";
import { linkEcosystemEntities, publishEcosystemEvent } from "@/lib/ecosystem";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { QuoteEmail } from "@/emails/quote-created";
import {
  calculateQuoteTotals,
  generatePublicToken,
  generateQuoteNumber,
} from "@/lib/quote-utils";

const reserveFlowUrl = process.env.NEXT_PUBLIC_RESERVEFLOW_URL ?? "https://reserveflow-psi.vercel.app";

const itemSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  quantity: z.coerce.number().int().min(1),
  unitPriceCents: z.coerce.number().int().min(0),
});

const createQuoteSchema = z.object({
  clientId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  taxRatePercent: z.coerce.number().min(0).max(50).default(14.975),
  validUntil: z.string().optional(),
  flowId: z.string().optional(),
  sourceApp: z.string().optional(),
  sourceEventId: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function createQuote(formData: FormData) {
  await requireDashboardAccess();

  const rawItems: z.infer<typeof itemSchema>[] = [];
  let i = 0;
  while (formData.get(`items[${i}][name]`)) {
    rawItems.push({
      name: formData.get(`items[${i}][name]`) as string,
      description: (formData.get(`items[${i}][description]`) as string) || undefined,
      quantity: Number(formData.get(`items[${i}][quantity]`)),
      unitPriceCents: Math.round(Number(formData.get(`items[${i}][unitPrice]`)) * 100),
    });
    i++;
  }

  const taxRatePercent = Number(formData.get("taxRatePercent")) || 14.975;
  const taxRateBps = Math.round(taxRatePercent * 100);

  const parsed = createQuoteSchema.safeParse({
    clientId: formData.get("clientId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    taxRatePercent,
    validUntil: formData.get("validUntil") || undefined,
    flowId: formData.get("flowId") || undefined,
    sourceApp: formData.get("sourceApp") || undefined,
    sourceEventId: formData.get("sourceEventId") || undefined,
    items: rawItems,
  });

  if (!parsed.success) redirect("/dashboard/quotes/new?error=invalid");

  const { subtotalCents, taxCents, totalCents } = calculateQuoteTotals(
    parsed.data.items.map((it) => ({
      quantity: it.quantity,
      unitPriceCents: it.unitPriceCents,
    })),
    taxRateBps
  );

  const quoteNumber = await generateQuoteNumber(() =>
    prisma.quote.count()
  );
  const publicToken = generatePublicToken();

  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      title: parsed.data.title,
      description: parsed.data.description,
      clientId: parsed.data.clientId,
      taxRateBps,
      subtotalCents,
      taxCents,
      totalCents,
      publicToken,
      validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : null,
      flowId: parsed.data.flowId,
      sourceApp: parsed.data.sourceApp,
      sourceEventId: parsed.data.sourceEventId,
      contextJson: parsed.data.sourceEventId
        ? { sourceEventId: parsed.data.sourceEventId, sourceApp: parsed.data.sourceApp }
        : undefined,
      items: {
        create: parsed.data.items.map((item, idx) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          totalCents: item.quantity * item.unitPriceCents,
          position: idx,
        })),
      },
    },
  });

  const quoteWithClient = await prisma.quote.findUnique({
    where: { id: quote.id },
    include: { client: true },
  });

  if (quoteWithClient) {
    await publishEcosystemEvent({
      flowId: parsed.data.flowId,
      sourceApp: "quotepilot",
      targetApps: ["reserveflow", "clienthub", "api-meter"],
      eventType: "quote.created",
      entityType: "quote",
      entityId: quote.id,
      customerName: quoteWithClient.client.name,
      customerEmail: quoteWithClient.client.email,
      title: "Devis cree dans QuotePilot",
      description: `${quoteWithClient.quoteNumber} est pret pour ${quoteWithClient.client.name}.`,
      payload: {
        quoteNumber: quoteWithClient.quoteNumber,
        title: quoteWithClient.title,
        totalCents: quoteWithClient.totalCents,
        status: quoteWithClient.status,
      },
      priority: "NORMAL",
      actionLabel: "Planifier un rendez-vous",
      actionUrl: reserveFlowBookingUrl({
        flowId: parsed.data.flowId,
        quoteId: quote.id,
        customerName: quoteWithClient.client.name,
        customerEmail: quoteWithClient.client.email,
        totalCents: quoteWithClient.totalCents,
        need: quoteWithClient.description ?? quoteWithClient.title,
        quoteNumber: quoteWithClient.quoteNumber,
        sourceEventId: parsed.data.sourceEventId,
      }),
    });

    if (parsed.data.flowId && parsed.data.sourceEventId) {
      await linkEcosystemEntities({
        flowId: parsed.data.flowId,
        fromApp: parsed.data.sourceApp ?? "luma-studio",
        fromEntityType: "lead",
        fromEntityId: parsed.data.sourceEventId,
        toApp: "quotepilot",
        toEntityType: "quote",
        toEntityId: quote.id,
      });
    }
  }

  revalidatePath("/dashboard/quotes");
  redirect(`/dashboard/quotes/${quote.id}`);
}

function readLeadPayload(payload: unknown) {
  const data = typeof payload === "object" && payload !== null ? payload as Record<string, unknown> : {};
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  return {
    name: name || "Lead Luma Studio",
    email,
    phone: typeof data.phone === "string" ? data.phone : undefined,
    projectType: String(data.projectType ?? "Projet recu depuis Luma Studio"),
    budgetRange: String(data.budgetRange ?? ""),
    message: String(data.message ?? "Demande recue depuis Luma Studio."),
  };
}

function centsFromBudgetRange(budgetRange: string) {
  const normalized = budgetRange.toLowerCase().replace(/\s+/g, " ");
  const explicit = normalized.match(/(\d+(?:[.,]\d+)?)\s*(k|000)?/);
  if (!explicit) return 0;

  const amount = Number(explicit[1].replace(",", "."));
  if (!Number.isFinite(amount)) return 0;

  if (normalized.includes("under") || normalized.includes("moins")) {
    return Math.round(amount * 1000 * 100);
  }

  if (explicit[2] === "k" || normalized.includes("k")) {
    const numbers = [...normalized.matchAll(/(\d+(?:[.,]\d+)?)/g)]
      .map((match) => Number(match[1].replace(",", ".")))
      .filter(Number.isFinite);
    const chosen = numbers.length > 1 ? numbers[numbers.length - 1] : amount;
    return Math.round(chosen * 1000 * 100);
  }

  return Math.round(amount * 100);
}

function reserveFlowBookingUrl(input: {
  flowId?: string | null;
  quoteId: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  consultantName?: string | null;
  need?: string | null;
  quoteNumber: string;
  sourceEventId?: string | null;
}) {
  const params = new URLSearchParams({
    flowId: input.flowId ?? "",
    quoteId: input.quoteId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    amount: String(input.totalCents),
    consultant: input.consultantName ?? "",
    need: input.need ?? "",
    quoteNumber: input.quoteNumber,
  });

  if (input.sourceEventId) {
    params.set("sourceEventId", input.sourceEventId);
  }

  return `${reserveFlowUrl}/booking?${params.toString()}`;
}

export async function createQuoteFromLead(formData: FormData) {
  await requireDashboardAccess();

  const eventId = String(formData.get("eventId") ?? "");
  if (!eventId) return;

  const leadEvent = await prisma.ecosystemEvent.findUnique({ where: { id: eventId } });
  if (!leadEvent || leadEvent.eventType !== "lead.created") return;

  const lead = readLeadPayload(leadEvent.payload);
  if (!lead.email) return;

  const client = await prisma.client.upsert({
    where: { email: lead.email },
    update: {
      name: lead.name,
      phone: lead.phone,
      sourceApp: leadEvent.sourceApp,
      sourceEventId: leadEvent.id,
      flowId: leadEvent.flowId,
    },
    create: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      sourceApp: leadEvent.sourceApp,
      sourceEventId: leadEvent.id,
      flowId: leadEvent.flowId,
    },
  });

  const subtotalCents = centsFromBudgetRange(lead.budgetRange);
  const taxRateBps = 1498;
  const taxCents = Math.round(subtotalCents * (taxRateBps / 10000));
  const totalCents = subtotalCents + taxCents;
  const quoteNumber = await generateQuoteNumber(() => prisma.quote.count());
  const publicToken = generatePublicToken();

  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      title: `Soumission ${lead.projectType}`,
      description: lead.message,
      clientId: client.id,
      taxRateBps,
      subtotalCents,
      taxCents,
      totalCents,
      publicToken,
      flowId: leadEvent.flowId,
      sourceApp: leadEvent.sourceApp,
      sourceEventId: leadEvent.id,
      contextJson: {
        lead,
        sourceEventId: leadEvent.id,
        sourceApp: leadEvent.sourceApp,
      },
      items: {
        create: [
          {
            name: `Proposition ${lead.projectType}`,
            description: lead.budgetRange ? `${lead.projectType} - ${lead.budgetRange}` : lead.projectType,
            quantity: 1,
            unitPriceCents: subtotalCents,
            totalCents: subtotalCents,
            position: 0,
          },
        ],
      },
    },
  });

  await publishEcosystemEvent({
    flowId: leadEvent.flowId,
    sourceApp: "quotepilot",
    targetApps: ["reserveflow", "clienthub", "api-meter"],
    eventType: "quote.created",
    entityType: "quote",
    entityId: quote.id,
    customerName: client.name,
    customerEmail: client.email,
    title: "Soumission creee depuis un lead Luma",
    description: `${quote.quoteNumber} transforme la demande Luma en soumission QuotePilot.`,
    payload: {
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      totalCents: quote.totalCents,
      leadEventId: leadEvent.id,
      flowId: leadEvent.flowId,
    },
    priority: "HIGH",
    actionLabel: "Planifier avec ReserveFlow",
    actionUrl: reserveFlowBookingUrl({
      flowId: leadEvent.flowId,
      quoteId: quote.id,
      customerName: client.name,
      customerEmail: client.email,
      totalCents: quote.totalCents,
      need: quote.description ?? quote.title,
      quoteNumber: quote.quoteNumber,
      sourceEventId: leadEvent.id,
    }),
  });

  await linkEcosystemEntities({
    flowId: leadEvent.flowId,
    fromApp: leadEvent.sourceApp,
    fromEntityType: "lead",
    fromEntityId: leadEvent.id,
    toApp: "quotepilot",
    toEntityType: "quote",
    toEntityId: quote.id,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/quotes");
  redirect(`/dashboard/quotes/${quote.id}?emailPreview=1`);
}

const updateStatusSchema = z.object({
  quoteId: z.string().min(1),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]),
  consultantName: z.string().optional(),
});

export async function updateQuoteStatus(formData: FormData) {
  await requireDashboardAccess();

  const parsed = updateStatusSchema.safeParse({
    quoteId: formData.get("quoteId"),
    status: formData.get("status"),
    consultantName: formData.get("consultantName") || undefined,
  });

  if (!parsed.success) return;

  const now = new Date();
  const extra: Record<string, Date | null> = {};
  if (parsed.data.status === "SENT") extra.sentAt = now;
  if (parsed.data.status === "ACCEPTED") extra.acceptedAt = now;
  if (parsed.data.status === "REJECTED") extra.rejectedAt = now;

  const quote = await prisma.quote.update({
    where: { id: parsed.data.quoteId },
    data: {
      status: parsed.data.status,
      ...extra,
      ...(parsed.data.consultantName ? { consultantName: parsed.data.consultantName } : {}),
    },
    include: { client: true },
  });

  if (parsed.data.status === "ACCEPTED") {
    await publishEcosystemEvent({
      flowId: quote.flowId ?? undefined,
      sourceApp: "quotepilot",
      targetApps: ["reserveflow", "clienthub", "api-meter"],
      eventType: "quote.accepted",
      entityType: "quote",
      entityId: quote.id,
      customerName: quote.client.name,
      customerEmail: quote.client.email,
      title: "Devis accepte dans QuotePilot",
      description: `${quote.quoteNumber} a ete accepte par ${quote.client.name}.`,
      payload: {
        quoteNumber: quote.quoteNumber,
        totalCents: quote.totalCents,
        status: quote.status,
        consultantName: quote.consultantName,
        flowId: quote.flowId,
      },
      priority: "HIGH",
      actionLabel: "Creer le rendez-vous",
      actionUrl: reserveFlowBookingUrl({
        flowId: quote.flowId,
        quoteId: quote.id,
        customerName: quote.client.name,
        customerEmail: quote.client.email,
        totalCents: quote.totalCents,
        consultantName: quote.consultantName,
        need: quote.description ?? quote.title,
        quoteNumber: quote.quoteNumber,
        sourceEventId: quote.sourceEventId,
      }),
    });

    if (quote.consultantName) {
      await publishEcosystemEvent({
        flowId: quote.flowId ?? undefined,
        sourceApp: "quotepilot",
        targetApps: ["reserveflow", "clienthub", "api-meter"],
        eventType: "consultant.selected",
        entityType: "quote",
        entityId: quote.id,
        customerName: quote.client.name,
        customerEmail: quote.client.email,
        title: "Consultant selectionne dans QuotePilot",
        description: `${quote.consultantName} est assigne a ${quote.quoteNumber}.`,
        payload: {
          quoteNumber: quote.quoteNumber,
          consultantName: quote.consultantName,
          flowId: quote.flowId,
        },
        priority: "NORMAL",
        actionLabel: "Planifier avec ReserveFlow",
        actionUrl: reserveFlowBookingUrl({
          flowId: quote.flowId,
          quoteId: quote.id,
          customerName: quote.client.name,
          customerEmail: quote.client.email,
          totalCents: quote.totalCents,
          consultantName: quote.consultantName,
          need: quote.description ?? quote.title,
          quoteNumber: quote.quoteNumber,
          sourceEventId: quote.sourceEventId,
        }),
      });
    }
  }

  if (parsed.data.status === "SENT") {
    await publishEcosystemEvent({
      flowId: quote.flowId ?? undefined,
      sourceApp: "quotepilot",
      targetApps: ["clienthub", "api-meter"],
      eventType: "quote.sent",
      entityType: "quote",
      entityId: quote.id,
      customerName: quote.client.name,
      customerEmail: quote.client.email,
      title: "Soumission envoyee depuis QuotePilot",
      description: `${quote.quoteNumber} a ete envoyee a ${quote.client.name}.`,
      payload: {
        quoteNumber: quote.quoteNumber,
        totalCents: quote.totalCents,
        status: quote.status,
        flowId: quote.flowId,
      },
      priority: "NORMAL",
      actionLabel: "Voir la soumission",
      actionUrl: `/dashboard/quotes/${quote.id}`,
    });
  }

  revalidatePath(`/dashboard/quotes/${parsed.data.quoteId}`);
  revalidatePath("/dashboard/quotes");
  revalidatePath("/dashboard");
}

export async function sendQuoteToClient(formData: FormData) {
  await requireDashboardAccess();

  const quoteId = formData.get("quoteId") as string;
  if (!quoteId) return;

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { client: true, items: { orderBy: { position: "asc" } } },
  });

  if (!quote) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  const publicUrl = `${appUrl}/quote/${quote.publicToken}`;

  await sendTransactionalEmail({
    to: quote.client.email,
    subject: `Soumission ${quote.quoteNumber} — ${quote.title}`,
    react: QuoteEmail({
      clientName: quote.client.name,
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      totalCents: quote.totalCents,
      publicUrl,
    }),
  });

  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: "SENT", sentAt: new Date() },
  });

  await publishEcosystemEvent({
    flowId: quote.flowId ?? undefined,
    sourceApp: "quotepilot",
    targetApps: ["clienthub", "api-meter"],
    eventType: "quote.sent",
    entityType: "quote",
    entityId: quote.id,
    customerName: quote.client.name,
    customerEmail: quote.client.email,
    title: "Soumission envoyee depuis QuotePilot",
    description: `${quote.quoteNumber} a ete envoyee a ${quote.client.name}.`,
    payload: {
      quoteNumber: quote.quoteNumber,
      totalCents: quote.totalCents,
      status: "SENT",
      flowId: quote.flowId,
    },
    priority: "NORMAL",
    actionLabel: "Voir la soumission",
    actionUrl: `/dashboard/quotes/${quote.id}`,
  });

  revalidatePath(`/dashboard/quotes/${quoteId}`);
}

export async function acceptQuotePublic(token: string) {
  const quote = await prisma.quote.findUnique({ where: { publicToken: token } });
  if (!quote || quote.status === "ACCEPTED") return;

  const updated = await prisma.quote.update({
    where: { publicToken: token },
    data: { status: "ACCEPTED", acceptedAt: new Date() },
    include: { client: true },
  });

  await publishEcosystemEvent({
    flowId: updated.flowId ?? undefined,
    sourceApp: "quotepilot",
    targetApps: ["reserveflow", "clienthub", "api-meter"],
    eventType: "quote.accepted",
    entityType: "quote",
    entityId: updated.id,
    customerName: updated.client.name,
    customerEmail: updated.client.email,
    title: "Devis accepte publiquement",
    description: `${updated.quoteNumber} a ete accepte par ${updated.client.name}.`,
    payload: {
      quoteNumber: updated.quoteNumber,
      totalCents: updated.totalCents,
      status: updated.status,
      consultantName: updated.consultantName,
      flowId: updated.flowId,
    },
    priority: "HIGH",
    actionLabel: "Planifier un rendez-vous",
    actionUrl: reserveFlowBookingUrl({
      flowId: updated.flowId,
      quoteId: updated.id,
      customerName: updated.client.name,
      customerEmail: updated.client.email,
      totalCents: updated.totalCents,
      consultantName: updated.consultantName,
      need: updated.description ?? updated.title,
      quoteNumber: updated.quoteNumber,
      sourceEventId: updated.sourceEventId,
    }),
  });
}
