import { Code2, KeyRound, ShieldCheck } from "lucide-react";

import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "API keys",
    description: "Extraction Bearer et x-api-key avec scopes par credential.",
    icon: KeyRound,
  },
  {
    title: "Scopes",
    description: "Controle granulaire pret pour plans Stripe et produits API.",
    icon: ShieldCheck,
  },
  {
    title: "Versioning",
    description: "Routes sous /api/v1 pour faire evoluer les contrats proprement.",
    icon: Code2,
  },
];

export default function DevelopersPage() {
  return (
    <MarketingPageShell>
      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge>Developer portal</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
              Un point de depart pour vendre une API avec cles et scopes.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Le portail expose deja un endpoint demo, une convention de
              credentials locale et la structure pour brancher usage tracking,
              plans Stripe et docs OpenAPI.
            </p>
          </div>

          <div className="grid gap-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base">
                    <feature.icon className="size-4" />
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demo request</CardTitle>
                <CardDescription>Sans env, l endpoint reste public pour le scaffold.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto border bg-secondary p-4 text-xs text-secondary-foreground">
                  <code>{`curl http://localhost:3000/api/v1/demo \\
  -H "Authorization: Bearer demo-key"`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </MarketingPageShell>
  );
}
