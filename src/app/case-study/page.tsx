import { getT } from "@/lib/i18n";
import { CheckCircle } from "lucide-react";

const stack = [
  { name: "Next.js 16", note: "App Router, Server Components, Server Actions" },
  { name: "TypeScript", note: "Strict mode" },
  { name: "Prisma 7", note: "ORM PostgreSQL" },
  { name: "Auth.js v5", note: "JWT + Credentials provider" },
  { name: "Supabase", note: "PostgreSQL hosted" },
  { name: "Resend", note: "Transactional email" },
  { name: "React Email", note: "Email templates" },
  { name: "Tailwind CSS v4", note: "UI styling" },
  { name: "Zod", note: "Schema validation" },
  { name: "nanoid", note: "Public token generation" },
];

export default async function CaseStudyPage() {
  const t = await getT();
  const cs = t.caseStudy;

  return (
    <main className="text-foreground">
      {/* Hero */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {cs.badge}
          </span>
          <h1 className="text-3xl font-semibold sm:text-4xl">{cs.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{cs.sub}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16 space-y-16">
        {/* Problem / Solution */}
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {cs.problemTitle}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">{cs.problem}</p>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {cs.solutionTitle}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">{cs.solution}</p>
          </div>
        </div>

        {/* Stack */}
        <div>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {cs.stackTitle}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {stack.map((s) => (
              <div key={s.name} className="flex items-start gap-3 border bg-background p-3 text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">— {s.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {cs.featuresTitle}
          </h2>
          <ul className="space-y-2">
            {cs.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Technical decisions */}
        <div>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {cs.decisionsTitle}
          </h2>
          <div className="space-y-4">
            {cs.decisions.map((d) => (
              <div key={d.title} className="border-l-2 border-foreground pl-4">
                <p className="font-medium">{d.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiter section */}
        <div className="border bg-muted/30 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em]">
            {cs.recruiterTitle}
          </h2>
          <ul className="space-y-2">
            {cs.recruiterPoints.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
