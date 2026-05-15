import { getT } from "@/lib/i18n";

export default async function SettingsPage() {
  const t = await getT();

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t.nav.settings}
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Parametres</h1>

        <div className="mt-8 space-y-4">
          <div className="border bg-background p-5">
            <p className="text-sm font-medium">Application</p>
            <p className="mt-1 text-sm text-muted-foreground">QuotePilot v1.0</p>
          </div>

          <div className="border bg-background p-5">
            <p className="mb-2 text-sm font-medium">Taux de taxe par defaut</p>
            <p className="text-sm text-muted-foreground">TPS (5%) + TVQ (9.975%) = 14.975%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ce taux s&apos;applique automatiquement aux nouvelles soumissions.
            </p>
          </div>

          <div className="border bg-background p-5">
            <p className="mb-2 text-sm font-medium">Format de soumission</p>
            <p className="text-sm text-muted-foreground">QP-{new Date().getFullYear()}-XXXX</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Les numeros sont attribues automatiquement et ne peuvent pas etre modifies.
            </p>
          </div>

          <div className="border bg-muted/30 p-5">
            <p className="mb-1 text-sm font-medium text-muted-foreground">Courriel transactionnel</p>
            <p className="text-xs text-muted-foreground">
              Configure via la variable d&apos;environnement <code className="font-mono">RESEND_FROM_EMAIL</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
