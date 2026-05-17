alter table if exists quotepilot."Client"
  add column if not exists "sourceApp" text,
  add column if not exists "sourceEventId" text,
  add column if not exists "flowId" text;

alter table if exists quotepilot."Quote"
  add column if not exists "flowId" text,
  add column if not exists "sourceApp" text,
  add column if not exists "sourceEventId" text,
  add column if not exists "consultantName" text,
  add column if not exists "contextJson" jsonb;

create index if not exists "Client_flowId_idx" on quotepilot."Client"("flowId");
create index if not exists "Quote_flowId_idx" on quotepilot."Quote"("flowId");
