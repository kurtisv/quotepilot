import Link from "next/link";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { formatCurrency } from "@/lib/quote-utils";
import { Button } from "@/components/ui/button";
import { EcosystemNotificationPanel } from "@/components/ecosystem/notification-panel";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-primary-soft text-primary",
  SENT: "bg-primary-soft text-primary",
  ACCEPTED: "bg-success-soft text-success",
  REJECTED: "bg-destructive-soft text-destructive",
  EXPIRED: "bg-warning-soft text-warning",
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
    { label: d.statsClients, value: String(clientCount), accent: "border-l-primary bg-card" },
    { label: d.statsQuotes, value: String(total), accent: "border-l-primary bg-primary-soft/50" },
    { label: d.statsDraft, value: String(drafts), accent: "border-l-accent bg-accent-soft/70" },
    { label: d.statsSent, value: String(sent), accent: "border-l-primary bg-card" },
    { label: d.statsAccepted, value: String(accepted), accent: "border-l-success bg-success-soft" },
    { label: d.statsPotential, value: formatCurrency(potentialCents, locale), accent: "border-l-accent bg-accent-soft" },
  ];

  return (
    <div className="bg-[linear-gradient(180deg,#fbfaf6_0%,#ffffff_42%)] px-6 py-10">
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
            <div key={s.label} className={`rounded-md border border-l-4 bg-card p-5 shadow-sm ${s.accent}`}>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <EcosystemNotificationPanel appKey="quotepilot" />
        </div>

        {/* Recent quotes */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{d.recentQuotes}</h2>
            <Link href="/dashboard/quotes" className="text-xs text-muted-foreground hover:underline">
              {d.viewAll}
            </Link>
          </div>
          <div className="overflow-hidden rounded-md border bg-card shadow-sm">
            {recentQuotes.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">{d.noQuotes}</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {recentQuotes.map((q) => (
                    <tr key={q.id} className="border-b last:border-b-0 hover:bg-primary-soft/40">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{q.quoteNumber}</td>
                      <td className="px-5 py-3 font-medium">{q.title}</td>
                      <td className="px-5 py-3 text-muted-foreground">{q.client.name}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[q.status] ?? ""}`}>
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

