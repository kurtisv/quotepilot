-- Drop old index and add unique constraint
DROP INDEX IF EXISTS "Client_email_idx";
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
