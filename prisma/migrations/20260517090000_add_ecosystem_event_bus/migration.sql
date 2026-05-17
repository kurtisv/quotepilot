-- Shared KV Portfolio ecosystem event bus.
CREATE TABLE IF NOT EXISTS "EcosystemEvent" (
  "id" TEXT PRIMARY KEY,
  "flowId" TEXT NOT NULL,
  "sourceApp" TEXT NOT NULL,
  "targetApp" TEXT,
  "eventType" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "customerName" TEXT,
  "customerEmail" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "payload" JSONB,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "readAt" TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS "EcosystemNotification" (
  "id" TEXT PRIMARY KEY,
  "appKey" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'NORMAL',
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "actionLabel" TEXT,
  "actionUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "EcosystemEntityLink" (
  "id" TEXT PRIMARY KEY,
  "flowId" TEXT NOT NULL,
  "fromApp" TEXT NOT NULL,
  "fromEntityType" TEXT NOT NULL,
  "fromEntityId" TEXT NOT NULL,
  "toApp" TEXT NOT NULL,
  "toEntityType" TEXT NOT NULL,
  "toEntityId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "EcosystemEvent_flowId_idx" ON "EcosystemEvent"("flowId");
CREATE INDEX IF NOT EXISTS "EcosystemEvent_sourceApp_idx" ON "EcosystemEvent"("sourceApp");
CREATE INDEX IF NOT EXISTS "EcosystemEvent_targetApp_idx" ON "EcosystemEvent"("targetApp");
CREATE INDEX IF NOT EXISTS "EcosystemEvent_eventType_idx" ON "EcosystemEvent"("eventType");
CREATE INDEX IF NOT EXISTS "EcosystemEvent_createdAt_idx" ON "EcosystemEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "EcosystemNotification_appKey_idx" ON "EcosystemNotification"("appKey");
CREATE INDEX IF NOT EXISTS "EcosystemNotification_eventId_idx" ON "EcosystemNotification"("eventId");
CREATE INDEX IF NOT EXISTS "EcosystemNotification_isRead_idx" ON "EcosystemNotification"("isRead");
CREATE INDEX IF NOT EXISTS "EcosystemNotification_createdAt_idx" ON "EcosystemNotification"("createdAt");
CREATE INDEX IF NOT EXISTS "EcosystemEntityLink_flowId_idx" ON "EcosystemEntityLink"("flowId");
CREATE INDEX IF NOT EXISTS "EcosystemEntityLink_fromApp_idx" ON "EcosystemEntityLink"("fromApp");
CREATE INDEX IF NOT EXISTS "EcosystemEntityLink_toApp_idx" ON "EcosystemEntityLink"("toApp");
