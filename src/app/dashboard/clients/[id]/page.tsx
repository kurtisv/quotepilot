import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { formatCurrency } from "@/lib/quote-utils";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-indigo-soft text-primary",
  SENT: "bg-[#dff3ff] text-[#13739c]",
  ACCEPTED: "bg-secondary text-teal",
  REJECTED: "bg-accent-soft text-accent",
  EXPIRED: "bg-sun-soft text-[#8a6512]",
};

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, t] = await Promise.all([params, getT()]);
  const c = t.clients;
  const locale = t.lang === "fr" ? "fr-CA" : "en-CA";

  const client = await prisma.client.findUnique({
    where: { id },
    include: { quotes: { orderBy: { createdAt: "desc" } } },
  });

  if (!client) notFound();

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard/clients" className="hover:underline">{c.label}</Link>
          <span>/</span>
          <span>{client.name}</span>
        </div>
        <h1 className="text-2xl font-semibold">{client.name}</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Quotes list */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {c.quotesTitle}
            </h2>
            <div className="border bg-background">
              {client.quotes.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-muted-foreground">{c.noClientQuotes}</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {client.quotes.map((q) => (
                      <tr key={q.id} className="border-b last:border-b-0 hover:bg-muted/30">
                        <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{q.quoteNumber}</td>
                        <td className="px-5 py-3 font-medium">{q.title}</td>
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

          {/* Client info sidebar */}
          <aside className="border bg-background p-5 space-y-3 text-sm h-fit">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{c.detailTitle}</p>
            <div>
              <p className="font-medium">{client.name}</p>
              {client.companyName && <p className="text-muted-foreground">{client.companyName}</p>}
            </div>
            <p className="text-muted-foreground">{client.email}</p>
            {client.phone && <p className="text-muted-foreground">{client.phone}</p>}
            {client.address && <p className="text-muted-foreground">{client.address}</p>}
            <p className="text-xs text-muted-foreground">
              {new Date(client.createdAt).toLocaleDateString(locale)}
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
