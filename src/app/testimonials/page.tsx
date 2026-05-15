import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Section } from "@/components/marketing/section";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  "Un starter concu pour livrer vite des projets client.",
  "La separation contenu, business logic et dashboard rend la base claire.",
  "Le module API portal donne une vraie option SaaS des le depart.",
];

export default function TestimonialsPage() {
  return (
    <MarketingPageShell>
      <Section>
        <h1 className="text-4xl font-semibold">Temoignages</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial}>
              <CardContent className="pt-6 text-sm text-muted-foreground">{testimonial}</CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </MarketingPageShell>
  );
}
