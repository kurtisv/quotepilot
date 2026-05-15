import Link from "next/link";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { formatCurrency } from "@/lib/quote-utils";
import { Button } from "@/components/ui/button";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  EXPIRED: "bg-orange-100 text-orange-700",
};

export default async function QuotesPage() {
  const [t, quotes] = await Promise.all([
    getT(),
    prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
  ]);
  const q = t.quotes;
  const locale = t.lang === "fr" ? "fr-CA" : "en-CA";

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{q.label}</p>
            <h1 className="mt-3 text-3xl font-semibold">{q.title}</h1>
          </div>
          <Button asChild size="sm" className="mt-4">
            <Link href="/dashboard/quotes/new">{q.newQuote}</Link>
          </Button>
        </div>

        <div className="border bg-background">
          {quotes.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">{q.noQuotes}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">{q.colNumber}</th>
                  <th className="px-5 py-3 text-left font-medium">{q.colTitle}</th>
                  <th className="px-5 py-3 text-left font-medium">{q.colClient}</th>
                  <th className="px-5 py-3 text-left font-medium">{q.colStatus}</th>
                  <th className="px-5 py-3 text-right font-medium">{q.colTotal}</th>
                  <th className="hidden px-5 py-3 text-left font-medium md:table-cell">{q.colCreated}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{quote.quoteNumber}</td>
                    <td className="px-5 py-3 font-medium">{quote.title}</td>
                    <td className="px-5 py-3 text-muted-foreground">{quote.client.name}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${statusStyles[quote.status] ?? ""}`}>
                        {q.statusLabels[quote.status as keyof typeof q.statusLabels]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">{formatCurrency(quote.totalCents, locale)}</td>
                    <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                      {new Date(quote.createdAt).toLocaleDateString(locale)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/dashboard/quotes/${quote.id}`} className="text-xs text-muted-foreground hover:underline">
                        {q.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
