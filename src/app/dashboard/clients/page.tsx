import Link from "next/link";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default async function ClientsPage() {
  const [t, clients] = await Promise.all([
    getT(),
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { quotes: true } } },
    }),
  ]);
  const c = t.clients;
  const locale = t.lang === "fr" ? "fr-CA" : "en-CA";

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{c.label}</p>
            <h1 className="mt-3 text-3xl font-semibold">{c.title}</h1>
          </div>
          <Button asChild size="sm" className="mt-4">
            <Link href="/dashboard/clients/new">{c.newClient}</Link>
          </Button>
        </div>

        <div className="border bg-background">
          {clients.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">{c.noClients}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">{c.colName}</th>
                  <th className="px-5 py-3 text-left font-medium">{c.colEmail}</th>
                  <th className="hidden px-5 py-3 text-left font-medium lg:table-cell">{c.colCompany}</th>
                  <th className="px-5 py-3 text-right font-medium">{c.colQuotes}</th>
                  <th className="hidden px-5 py-3 text-left font-medium md:table-cell">{c.colCreated}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {clients.map((cl) => (
                  <tr key={cl.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{cl.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{cl.email}</td>
                    <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                      {cl.companyName ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-right">{cl._count.quotes}</td>
                    <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                      {new Date(cl.createdAt).toLocaleDateString(locale)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/dashboard/clients/${cl.id}`} className="text-xs text-muted-foreground hover:underline">
                        {c.view}
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
