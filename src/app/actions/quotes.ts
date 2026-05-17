"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/db";
import { publishEcosystemEvent } from "@/lib/ecosystem";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { QuoteEmail } from "@/emails/quote-created";
import {
  calculateQuoteTotals,
  generatePublicToken,
  generateQuoteNumber,
} from "@/lib/quote-utils";

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
      actionUrl: "/booking",
    });
  }

  revalidatePath("/dashboard/quotes");
  redirect(`/dashboard/quotes/${quote.id}`);
}

const updateStatusSchema = z.object({
  quoteId: z.string().min(1),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]),
});

export async function updateQuoteStatus(formData: FormData) {
  await requireDashboardAccess();

  const parsed = updateStatusSchema.safeParse({
    quoteId: formData.get("quoteId"),
    status: formData.get("status"),
  });

  if (!parsed.success) return;

  const now = new Date();
  const extra: Record<string, Date | null> = {};
  if (parsed.data.status === "SENT") extra.sentAt = now;
  if (parsed.data.status === "ACCEPTED") extra.acceptedAt = now;
  if (parsed.data.status === "REJECTED") extra.rejectedAt = now;

  const quote = await prisma.quote.update({
    where: { id: parsed.data.quoteId },
    data: { status: parsed.data.status, ...extra },
    include: { client: true },
  });

  if (parsed.data.status === "ACCEPTED") {
    await publishEcosystemEvent({
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
      },
      priority: "HIGH",
      actionLabel: "Creer le rendez-vous",
      actionUrl: "/booking",
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
    },
    priority: "HIGH",
    actionLabel: "Planifier un rendez-vous",
    actionUrl: "/booking",
  });
}
