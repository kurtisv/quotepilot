import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Section } from "@/components/marketing/section";

export default function TermsPage() {
  return (
    <MarketingPageShell>
      <Section>
        <h1 className="text-4xl font-semibold">Conditions utilisation</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Page legale placeholder a reviser selon le projet, le pays et le modele commercial.
        </p>
      </Section>
    </MarketingPageShell>
  );
}
