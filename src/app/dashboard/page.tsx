import Link from "next/link";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { formatCurrency } from "@/lib/quote-utils";
import { Button } from "@/components/ui/button";
import { EcosystemNotificationPanel } from "@/components/ecosystem/notification-panel";
import { createQuoteFromLead } from "@/app/actions/quotes";
import { getIncomingEcosystemEvents } from "@/lib/ecosystem";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-primary-soft text-primary",
  SENT: "bg-primary-soft text-primary",
  ACCEPTED: "bg-success-soft text-success",
  REJECTED: "bg-destructive-soft text-destructive",
  EXPIRED: "bg-warning-soft text-warning",
};

const timeline = ["Luma Studio", "QuotePilot", "ReserveFlow", "ClientHub", "CommerceKit", "EventPass", "SupportDesk Lite", "API Meter"];

export default async function DashboardPage() {
  const t = await getT();
  const d = t.dashboard;
  const locale = t.lang === "fr" ? "fr-CA" : "en-CA";

  const [clientCount, quoteStats, recentQuotes, lumaLeads] = await Promise.all([
    prisma.client.count(),
    prisma.quote.groupBy({ by: ["status"], _count: true, _sum: { totalCents: true } }),
    prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
    getIncomingEcosystemEvents("quotepilot", "lead.created", 6),
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
          <div>
            <p className="mb-2 inline-flex border bg-primary-soft px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              KV Portfolio Ecosystem - Demo Mode
            </p>
            <h1 className="text-2xl font-semibold">{d.title}</h1>
          </div>
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
        <section className="mb-10 rounded-md border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Timeline du parcours</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            {timeline.map((item, index) => (
              <span key={item} className={index === 1 ? "rounded-md bg-primary px-3 py-2 text-primary-foreground" : "rounded-md border bg-background px-3 py-2"}>
                {String(index + 1).padStart(2, "0")} {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-md border bg-card shadow-sm">
          <div className="border-b p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Nouveautes de l&apos;ecosysteme
            </p>
            <h2 className="mt-2 text-lg font-semibold">Nouveaux leads recus</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Les demandes Luma Studio arrivent ici pour etre converties en soumission QuotePilot.
            </p>
          </div>
          <div className="divide-y">
            {lumaLeads.map((lead) => {
              const payload = typeof lead.payload === "object" && lead.payload !== null
                ? lead.payload as Record<string, unknown>
                : {};
              return (
                <article key={lead.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                        Source: Luma Studio
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{lead.flowId}</span>
                    </div>
                    <h3 className="mt-3 font-semibold">{String(lead.customerName ?? payload.name ?? "Lead Luma")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{String(lead.customerEmail ?? payload.email ?? "")}</p>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Projet</dt>
                        <dd className="mt-1">{String(payload.projectType ?? "-")}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Budget</dt>
                        <dd className="mt-1">{String(payload.budgetRange ?? "-")}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Statut</dt>
                        <dd className="mt-1">Nouveau</dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {String(payload.message ?? lead.description ?? "")}
                    </p>
                  </div>
                  <form action={createQuoteFromLead} className="self-center">
                    <input type="hidden" name="eventId" value={lead.id} />
                    <Button type="submit">Creer une soumission</Button>
                  </form>
                </article>
              );
            })}
            {lumaLeads.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">
                Aucun lead Luma pour l&apos;instant. Soumets une demande dans Luma Studio pour demarrer le parcours.
              </p>
            ) : null}
          </div>
        </section>

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

