import Link from "next/link";
import { getT } from "@/lib/i18n";
import { FileText, Users, Calculator, Mail, Link2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const icons = [Users, FileText, Calculator, CheckCircle, Link2, Mail];
const featureAccents = [
  "bg-primary-soft text-primary",
  "bg-secondary text-secondary-foreground",
  "bg-accent-soft text-accent",
  "bg-primary-soft text-primary",
  "bg-secondary text-secondary-foreground",
  "bg-accent-soft text-accent",
];

export default async function HomePage() {
  const t = await getT();
  const h = t.home;

  return (
    <main className="text-foreground">
      {/* Hero */}
      <section className="border-b bg-[linear-gradient(135deg,#fbfaf6_0%,#f4efe5_52%,#e8eef5_100%)]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-card/80 px-3 py-1 text-xs font-medium text-primary shadow-sm">
            {h.heroBadge}
          </span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl whitespace-pre-line">
            {h.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {h.heroSub}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/login">{h.ctaDashboard}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/case-study">{h.ctaLearn}</Link>
            </Button>
          </div>
          <div className="mx-auto mt-14 grid max-w-3xl gap-3 rounded-md border bg-card/90 p-4 text-left shadow-sm sm:grid-cols-3">
            {["Clients actifs", "Soumissions envoyees", "Taxes calculees"].map((label, index) => (
              <div key={label} className="rounded-md bg-background/80 p-4">
                <p className="text-2xl font-semibold text-primary">{index === 0 ? "3" : index === 1 ? "4" : "14.975%"}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-12 text-center text-2xl font-semibold">{h.featuresTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {h.features.map((f, i) => {
              const Icon = icons[i] ?? FileText;
              return (
                <div key={f.title} className="rounded-md border bg-background p-6 shadow-sm">
                  <span className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md ${featureAccents[i] ?? featureAccents[0]}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo banner */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f4efe5_100%)]">
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h2 className="mb-2 text-xl font-semibold">{h.demoTitle}</h2>
          <p className="mb-6 text-sm text-muted-foreground">{h.demoDesc}</p>
          <div className="mb-6 rounded-md border bg-card p-4 text-sm font-mono shadow-sm">
            <p>{h.demoEmail}</p>
            <p>{h.demoPassword}</p>
          </div>
          <Button asChild>
            <Link href="/login">{h.demoBtn}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
