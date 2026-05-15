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

export default async function DashboardPage() {
  const t = await getT();
  const d = t.dashboard;
  const locale = t.lang === "fr" ? "fr-CA" : "en-CA";

  const [clientCount, quoteStats, recentQuotes] = await Promise.all([
    prisma.client.count(),
    prisma.quote.groupBy({ by: ["status"], _count: true, _sum: { totalCents: true } }),
    prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
  ]);

  const total = quoteStats.reduce((s, g) => s + g._count, 0);
  const drafts = quoteStats.find((g) => g.status === "DRAFT")?._count ?? 0;
  const sent = quoteStats.find((g) => g.status === "SENT")?._count ?? 0;
  const accepted = quoteStats.find((g) => g.status === "ACCEPTED")?._count ?? 0;
  const potentialCents = quoteStats
    .filter((g) => ["DRAFT", "SENT"].includes(g.status))
    .reduce((s, g) => s + (g._sum.totalCents ?? 0), 0);

  const stats = [
    { label: d.statsClients, value: String(clientCount) },
    { label: d.statsQuotes, value: String(total) },
    { label: d.statsDraft, value: String(drafts) },
    { label: d.statsSent, value: String(sent) },
    { label: d.statsAccepted, value: String(accepted) },
    { label: d.statsPotential, value: formatCurrency(potentialCents, locale) },
  ];

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{d.title}</h1>
          <Button asChild size="sm">
            <Link href="/dashboard/quotes/new">{d.newQuote}</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="border bg-background p-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent quotes */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{d.recentQuotes}</h2>
            <Link href="/dashboard/quotes" className="text-xs text-muted-foreground hover:underline">
              {d.viewAll}
            </Link>
          </div>
          <div className="border bg-background">
            {recentQuotes.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">{d.noQuotes}</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {recentQuotes.map((q) => (
                    <tr key={q.id} className="border-b last:border-b-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{q.quoteNumber}</td>
                      <td className="px-5 py-3 font-medium">{q.title}</td>
                      <td className="px-5 py-3 text-muted-foreground">{q.client.name}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${statusStyles[q.status] ?? ""}`}>
                          {t.quotes.statusLabels[q.status as keyof typeof t.quotes.statusLabels]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium">{formatCurrency(q.totalCents, locale)}</td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/dashboard/quotes/${q.id}`} className="text-xs text-muted-foreground hover:underline">
                          {t.quotes.view}
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
    </div>
  );
}
