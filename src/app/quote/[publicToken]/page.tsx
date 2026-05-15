import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { formatCurrency, taxRateBpsToPercent } from "@/lib/quote-utils";
import { acceptQuotePublic } from "@/app/actions/quotes";
import { Button } from "@/components/ui/button";

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ publicToken: string }>;
}) {
  const { publicToken } = await params;
  const t = await getT();
  const pq = t.publicQuote;

  const quote = await prisma.quote.findUnique({
    where: { publicToken },
    include: {
      client: true,
      items: { orderBy: { position: "asc" } },
    },
  });

  if (!quote) notFound();

  const locale = t.lang === "fr" ? "fr-CA" : "en-CA";
  const isExpired =
    quote.validUntil && new Date(quote.validUntil) < new Date() && quote.status !== "ACCEPTED";

  const statusLabel =
    pq.statusLabels[quote.status as keyof typeof pq.statusLabels] ?? quote.status;

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <span className="text-sm font-semibold">QuotePilot</span>
          <span className="text-xs text-muted-foreground">{pq.poweredBy}</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {isExpired && (
          <div className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {pq.expired}
          </div>
        )}

        {/* Quote header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {pq.quote} {quote.quoteNumber}
            </p>
            <h1 className="mt-2 text-2xl font-semibold">{quote.title}</h1>
            {quote.description && (
              <p className="mt-2 text-sm text-muted-foreground">{quote.description}</p>
            )}
          </div>
          <div className="text-right text-sm">
            <p className="font-medium text-muted-foreground">{pq.preparedFor}</p>
            <p className="mt-1 font-semibold">{quote.client.name}</p>
            {quote.client.companyName && (
              <p className="text-muted-foreground">{quote.client.companyName}</p>
            )}
            <p className="text-muted-foreground">{quote.client.email}</p>
            {quote.validUntil && (
              <p className="mt-2 text-xs text-muted-foreground">
                {pq.validUntil}{" "}
                {new Date(quote.validUntil).toLocaleDateString(locale)}
              </p>
            )}
          </div>
        </div>

        {/* Line items */}
        <div className="mb-8 border bg-background">
          <table className="w-full text-sm">
            <thead className="border-b text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">{pq.itemName}</th>
                <th className="px-5 py-3 text-right font-medium">{pq.itemQty}</th>
                <th className="px-5 py-3 text-right font-medium">{pq.itemPrice}</th>
                <th className="px-5 py-3 text-right font-medium">{pq.itemTotal}</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="px-5 py-3">
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">{item.quantity}</td>
                  <td className="px-5 py-3 text-right">
                    {formatCurrency(item.unitPriceCents, locale)}
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    {formatCurrency(item.totalCents, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{pq.subtotal}</span>
            <span>{formatCurrency(quote.subtotalCents, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {pq.tax} ({taxRateBpsToPercent(quote.taxRateBps)})
            </span>
            <span>{formatCurrency(quote.taxCents, locale)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>{pq.total}</span>
            <span>{formatCurrency(quote.totalCents, locale)}</span>
          </div>
        </div>

        {/* Accept button */}
        {quote.status === "SENT" && !isExpired && (
          <div className="mt-10 text-center">
            <form
              action={async () => {
                "use server";
                await acceptQuotePublic(publicToken);
              }}
            >
              <Button type="submit" size="lg">
                {pq.acceptBtn}
              </Button>
            </form>
          </div>
        )}

        {quote.status === "ACCEPTED" && (
          <div className="mt-10 border border-green-200 bg-green-50 p-4 text-center text-sm text-green-700">
            {pq.accepted}
          </div>
        )}

        {/* Status badge */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          {statusLabel}
        </div>
      </main>
    </div>
  );
}
