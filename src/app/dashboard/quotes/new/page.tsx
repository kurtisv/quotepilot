import Link from "next/link";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { NewQuoteForm } from "./new-quote-form";

export default async function NewQuotePage() {
  const [t, clients] = await Promise.all([
    getT(),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);
  const q = t.quotes;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{q.label}</p>
          <h1 className="mt-3 text-2xl font-semibold">{q.formTitle}</h1>
        </div>
        {clients.length === 0 ? (
          <div className="border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            <p className="mb-4">Aucun client. Creez un client d&apos;abord.</p>
            <Link href="/dashboard/clients/new" className="underline">
              {t.clients.newClient}
            </Link>
          </div>
        ) : (
          <NewQuoteForm clients={clients} labels={q} />
        )}
      </div>
    </div>
  );
}
