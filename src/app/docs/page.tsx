import Link from "next/link";
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Code2,
  CreditCard,
  FileText,
  KeyRound,
  Rocket,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const siteTypes = [
  {
    title: "Site vitrine",
    description:
      "Utilise les pages publiques, le formulaire contact, le SEO, les temoignages, les services et la structure CMS.",
    steps: ["Adapter la marque et les textes", "Configurer Resend", "Verifier sitemap et metadata"],
  },
  {
    title: "Site de reservation",
    description:
      "Active les services, le staff, les disponibilites, les exceptions et le formulaire public de reservation.",
    steps: ["Seeder le service initial", "Configurer staff et horaires", "Tester une reservation complete"],
  },
  {
    title: "Portail SaaS ou API",
    description:
      "Utilise Auth.js, les cles API, les scopes, Stripe, le suivi d'usage, OpenAPI et la documentation API.",
    steps: ["Configurer OAuth et Stripe", "Creer les plans", "Verifier les appels API et les quotas"],
  },
  {
    title: "Projet hybride",
    description:
      "Combine marketing, booking et API payante pour un service client plus complet.",
    steps: ["Choisir les modules actifs", "Masquer les pages inutiles", "Tester les parcours critiques"],
  },
];

const setupSteps = [
  {
    title: "1. Creer le projet client",
    body: "Copie le boilerplate avec le script fourni, puis installe les dependances dans le nouveau dossier.",
    command:
      'pnpm create:new -- -Name mon-projet -Destination C:\\code\\mon-projet -AppName "Mon Projet"',
  },
  {
    title: "2. Configurer l'environnement",
    body: "Copie .env.example vers .env et remplis les secrets selon les modules utilises.",
    command: "copy .env.example .env",
  },
  {
    title: "3. Initialiser la base de donnees",
    body: "Lance Postgres local, genere Prisma, applique la migration et ajoute les donnees demo.",
    command: "docker compose up -d\npnpm db:generate\npnpm db:migrate\npnpm db:seed",
  },
  {
    title: "4. Demarrer et verifier",
    body: "Lance le serveur, ouvre le site, teste les pages publiques et connecte-toi au dashboard.",
    command: "pnpm dev",
  },
];

const envGroups = [
  {
    title: "Base",
    items: ["NEXT_PUBLIC_APP_URL", "APP_NAME", "DATABASE_URL"],
  },
  {
    title: "Authentification",
    items: ["AUTH_SECRET", "AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET", "AUTH_ENABLE_DEMO_LOGIN"],
  },
  {
    title: "Billing",
    items: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PRICE_PRO", "STRIPE_PRICE_BUSINESS"],
  },
  {
    title: "Operations",
    items: ["RESEND_API_KEY", "UPSTASH_REDIS_REST_URL", "SENTRY_DSN", "NEXT_PUBLIC_SANITY_PROJECT_ID"],
  },
];

const adminWorkflows = [
  {
    title: "Dashboard",
    icon: ShieldCheck,
    items: [
      "Se connecter avec GitHub OAuth en production.",
      "Garder le login demo seulement en local.",
      "Donner l'acces admin avec une membership OWNER ou ADMIN.",
    ],
  },
  {
    title: "Reservations",
    icon: CalendarDays,
    items: [
      "Creer les services vendus.",
      "Ajouter le staff disponible.",
      "Configurer les horaires et exceptions.",
      "Tester un creneau public sur /booking.",
    ],
  },
  {
    title: "API payante",
    icon: KeyRound,
    items: [
      "Creer une cle API dans le dashboard.",
      "Verifier les scopes.",
      "Suivre les appels dans API Usage.",
      "Activer Stripe pour limiter les cles aux plans payants.",
    ],
  },
  {
    title: "Billing",
    icon: CreditCard,
    items: [
      "Creer les produits et prix dans Stripe.",
      "Reporter les price IDs dans .env.",
      "Tester le webhook avec Stripe CLI.",
      "Verifier le Customer Portal.",
    ],
  },
];

const launchChecks = [
  "pnpm check",
  "pnpm build",
  "pnpm test:e2e",
  "Tester /contact avec Resend",
  "Tester /booking avec une vraie disponibilite",
  "Tester /api/v1/demo avec une cle DB",
  "Tester Stripe Checkout et webhook",
  "Verifier Sentry apres deploiement",
];

export default function DocsPage() {
  return (
    <MarketingPageShell>
      <main>
        <section className="border-b bg-secondary/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <Badge>Mode d&apos;emploi</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
                Utiliser KV Web Starter selon le type de site a creer.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                Ce guide explique comment partir du boilerplate, choisir les modules utiles,
                configurer les services externes et valider un projet client avant livraison.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/docs/api">
                    <Code2 className="size-4" />
                    Reference API
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/developers">
                    <BookOpenCheck className="size-4" />
                    Portail developpeur
                  </Link>
                </Button>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-base">
                  <Rocket className="size-4" />
                  Parcours rapide
                </CardTitle>
                <CardDescription>
                  Pour un nouveau client, commence par le script de copie, puis active seulement
                  les modules necessaires.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto border bg-background p-4 text-xs">
                  <code>{setupSteps[0].command}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="max-w-3xl">
            <Badge>Choisir le bon depart</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal">Selon le site a livrer</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {siteTypes.map((type) => (
              <Card key={type.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm text-muted-foreground">
                    {type.steps.map((step) => (
                      <li key={step} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/50">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <Badge>Installation</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal">Demarrage complet</h2>
            <div className="mt-8 grid gap-4">
              {setupSteps.map((step) => (
                <Card key={step.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base">
                      <Settings className="size-4" />
                      {step.title}
                    </CardTitle>
                    <CardDescription>{step.body}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto border bg-background p-4 text-xs">
                      <code>{step.command}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
          <Badge>Variables</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal">Configuration par module</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {envGroups.map((group) => (
              <Card key={group.title}>
                <CardHeader>
                  <CardTitle className="text-base">{group.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm text-muted-foreground">
                    {group.items.map((item) => (
                      <li key={item}>
                        <code>{item}</code>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y bg-secondary/40">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <Badge>Utilisation</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal">Exploiter les modules</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {adminWorkflows.map((workflow) => (
                <Card key={workflow.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base">
                      <workflow.icon className="size-4" />
                      {workflow.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 text-sm text-muted-foreground">
                      {workflow.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge>Livraison</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal">Checklist avant mise en ligne</h2>
            <p className="mt-4 text-muted-foreground">
              Le projet est concu pour que la verification reste simple: les commandes de
              qualite couvrent lint, typecheck, tests unitaires, build et E2E.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <FileText className="size-4" />
                Controle final
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {launchChecks.map((check) => (
                  <li key={check} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </MarketingPageShell>
  );
}
