alter table if exists public."EcosystemNotification"
  add column if not exists "flowId" text;

create index if not exists "EcosystemNotification_flowId_idx" on public."EcosystemNotification"("flowId");