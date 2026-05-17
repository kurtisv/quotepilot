import type { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/db";

export type EcosystemPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type PublishEcosystemEventInput = {
  flowId?: string;
  sourceApp: string;
  targetApp?: string;
  targetApps?: string[];
  eventType: string;
  entityType: string;
  entityId?: string;
  customerName?: string;
  customerEmail?: string;
  title: string;
  description?: string;
  payload?: Prisma.InputJsonValue;
  notificationTitle?: string;
  notificationMessage?: string;
  priority?: EcosystemPriority;
  actionLabel?: string;
  actionUrl?: string;
};

function createFlowId(input: PublishEcosystemEventInput) {
  if (input.flowId) return input.flowId;
  const email = input.customerEmail?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return email ? `flow-${email}` : `flow-${crypto.randomUUID()}`;
}

export async function publishEcosystemEvent(input: PublishEcosystemEventInput) {
  const flowId = createFlowId(input);
  const targetApps = input.targetApps?.length ? input.targetApps : input.targetApp ? [input.targetApp] : [];

  try {
    const event = await prisma.ecosystemEvent.create({
    data: {
      flowId,
      sourceApp: input.sourceApp,
      targetApp: targetApps[0] ?? input.targetApp,
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      title: input.title,
      description: input.description,
      payload: input.payload,
    },
  });

  if (targetApps.length > 0) {
    await prisma.ecosystemNotification.createMany({
      data: targetApps.map((appKey) => ({
        appKey,
        eventId: event.id,
        title: input.notificationTitle ?? input.title,
        message: input.notificationMessage ?? input.description ?? input.title,
        priority: input.priority ?? "NORMAL",
        actionLabel: input.actionLabel,
        actionUrl: input.actionUrl,
      })),
    });
  }

    return event;
  } catch {
    return null;
  }
}

export async function getIncomingEcosystemNotifications(appKey: string, take = 6) {
  try {
    return await prisma.ecosystemNotification.findMany({
      where: { appKey },
      orderBy: { createdAt: "desc" },
      take,
    });
  } catch {
    return [];
  }
}

export async function getRecentEcosystemEvents(take = 20) {
  try {
    return await prisma.ecosystemEvent.findMany({
      orderBy: { createdAt: "desc" },
      take,
    });
  } catch {
    return [];
  }
}



