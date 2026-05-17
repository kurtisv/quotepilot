import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { formatCurrency, taxRateBpsToPercent } from "@/lib/quote-utils";
import { updateQuoteStatus, sendQuoteToClient } from "@/app/actions/quotes";
import { Button } from "@/components/ui/button";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-primary-soft text-primary",
  SENT: "bg-primary-soft text-primary",
  ACCEPTED: "bg-success-soft text-success",
  REJECTED: "bg-destructive-soft text-destructive",
  EXPIRED: "bg-warning-soft text-warning",
};

const reserveFlowUrl = process.env.NEXT_PUBLIC_RESERVEFLOW_URL ?? "https://reserveflow-psi.vercel.app";

export default async function QuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ emailPreview?: string }>;
}) {
  const [{ id }, t] = await Promise.all([params, getT()]);
  const query = (await searchParams) ?? {};
  const q = t.quotes;
  const locale = t.lang === "fr" ? "fr-CA" : "en-CA";

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { client: true, items: { orderBy: { position: "asc" } } },
  });

  if (!quote) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  const publicUrl = `${appUrl}/quote/${quote.publicToken}`;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard/quotes" className="hover:underline">{q.detailBack}</Link>
          <span>/</span>
          <span className="font-mono">{quote.quoteNumber}</span>
        </div>
        <h1 className="text-2xl font-semibold">{quote.title}</h1>
        {quote.description && (
          <p className="mt-1 text-sm text-muted-foreground">{quote.description}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[quote.status] ?? ""}`}>
            {q.statusLabels[quote.status as keyof typeof q.statusLabels]}
          </span>
          {quote.validUntil && (
            <span className="text-xs text-muted-foreground">
              {q.validUntil} {new Date(quote.validUntil).toLocaleDateString(locale)}
            </span>
          )}
        </div>

        {query.emailPreview === "1" ? (
          <section className="mt-6 rounded-md border border-primary/30 bg-primary-soft p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Nouveau courriel recu
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              Soumission {quote.quoteNumber} - Luma Studio
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Montant: {formatCurrency(quote.totalCents, locale)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link href={`/quote/${quote.publicToken}`}>Voir les details</Link>
              </Button>
              <form action={updateQuoteStatus} className="flex flex-wrap gap-2">
                <input type="hidden" name="quoteId" value={quote.id} />
                <input type="hidden" name="status" value="ACCEPTED" />
                <select
                  name="consultantName"
                  defaultValue={quote.consultantName ?? ""}
                  required
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="" disabled>Choisir un consultant</option>
                  <option>Maya Laurent</option>
                  <option>Noah Bennett</option>
                </select>
                <Button type="submit" size="sm">Accepter la soumission</Button>
              </form>
            </div>
          </section>
        ) : null}

        {quote.status === "ACCEPTED" ? (
          <section className="mt-6 rounded-md border bg-success-soft p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-success">
              Soumission acceptee
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              Choisissez maintenant un consultant pour planifier le rendez-vous.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Consultant: {quote.consultantName ?? "A choisir"} · Flow: {quote.flowId ?? "non lie"}
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link
                href={`${reserveFlowUrl}/booking?flowId=${encodeURIComponent(quote.flowId ?? "")}&quoteId=${quote.id}&customerName=${encodeURIComponent(quote.client.name)}&customerEmail=${encodeURIComponent(quote.client.email)}&amount=${quote.totalCents}&consultant=${encodeURIComponent(quote.consultantName ?? "")}&need=${encodeURIComponent(quote.description ?? quote.title)}&quoteNumber=${encodeURIComponent(quote.quoteNumber)}&sourceEventId=${encodeURIComponent(quote.sourceEventId ?? "")}`}
              >
                Prendre rendez-vous avec ReserveFlow
              </Link>
            </Button>
          </section>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main: line items + totals */}
          <div className="space-y-6">
            <div className="border bg-background">
              <table className="w-full text-sm">
                <thead className="border-b text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">{q.itemName}</th>
                    <th className="px-5 py-3 text-right font-medium">{q.itemQty}</th>
                    <th className="px-5 py-3 text-right font-medium">{q.itemPrice}</th>
                    <th className="px-5 py-3 text-right font-medium">{q.itemTotal}</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">{q.noItems}</td></tr>
                  ) : quote.items.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="px-5 py-3">
                        <p className="font-medium">{item.name}</p>
                        {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                      </td>
                      <td className="px-5 py-3 text-right">{item.quantity}</td>
                      <td className="px-5 py-3 text-right">{formatCurrency(item.unitPriceCents, locale)}</td>
                      <td className="px-5 py-3 text-right font-medium">{formatCurrency(item.totalCents, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{q.subtotal}</span>
                <span>{formatCurrency(quote.subtotalCents, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{q.tax} ({taxRateBpsToPercent(quote.taxRateBps)})</span>
                <span>{formatCurrency(quote.taxCents, locale)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>{q.total}</span>
                <span>{formatCurrency(quote.totalCents, locale)}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Client info */}
            <div className="border bg-background p-4 text-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{q.clientInfo}</p>
              <p className="font-medium">{quote.client.name}</p>
              {quote.client.companyName && <p className="text-muted-foreground">{quote.client.companyName}</p>}
              <p className="text-muted-foreground">{quote.client.email}</p>
              {quote.client.phone && <p className="text-muted-foreground">{quote.client.phone}</p>}
            </div>

            {/* Status update */}
            <div className="border bg-background p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{q.statusTitle}</p>
              <form action={updateQuoteStatus} className="space-y-2">
                <input type="hidden" name="quoteId" value={quote.id} />
                <select
                  name="status"
                  defaultValue={quote.status}
                  className="flex h-9 w-full border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {Object.entries(q.statusLabels).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <Button type="submit" size="sm" variant="secondary" className="w-full">
                  {q.updateStatus}
                </Button>
              </form>
            </div>

            {/* Send by email */}
            <div className="border bg-background p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{q.publicLink}</p>
              <p className="mb-3 break-all text-xs text-muted-foreground">{publicUrl}</p>
              <form action={sendQuoteToClient}>
                <input type="hidden" name="quoteId" value={quote.id} />
                <Button type="submit" size="sm" className="w-full">{q.sendEmail}</Button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

