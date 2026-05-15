import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Section } from "@/components/marketing/section";

export default function PrivacyPage() {
  return (
    <MarketingPageShell>
      <Section>
        <h1 className="text-4xl font-semibold">Politique de confidentialite</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Page legale placeholder a personnaliser pour chaque client avant publication.
        </p>
      </Section>
    </MarketingPageShell>
  );
}
