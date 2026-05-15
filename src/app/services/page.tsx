import { CheckCircle2 } from "lucide-react";

import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Section } from "@/components/marketing/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  "Site vitrine professionnel",
  "Prise de rendez-vous",
  "Portail API payante",
  "Dashboard client/admin",
  "SEO local et contenu",
  "Integrations Stripe, Resend, Sanity",
];

export default function ServicesPage() {
  return (
    <MarketingPageShell>
      <Section>
        <h1 className="text-4xl font-semibold">Services</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Une structure prete pour vendre rapidement des sites de service, des plateformes booking et des portails SaaS/API.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service}>
              <CardHeader>
                <CheckCircle2 className="size-5" />
                <CardTitle>{service}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Module activable et adaptable selon le projet client.
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </MarketingPageShell>
  );
}
