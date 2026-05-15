import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Section } from "@/components/marketing/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  ["Est-ce un template SaaS complet?", "Non. C'est une base modulaire pour construire vite sans trainer du code inutile."],
  ["Peut-on cacher les modules?", "Oui. Les feature flags servent a masquer booking, billing, CMS ou API portal selon le projet."],
  ["Sanity remplace-t-il Postgres?", "Non. Sanity gere le contenu marketing; Postgres garde la logique business."],
];

export default function FaqPage() {
  return (
    <MarketingPageShell>
      <Section>
        <h1 className="text-4xl font-semibold">FAQ</h1>
        <Accordion className="mt-8">
          {faqs.map(([question, answer]) => (
            <AccordionItem key={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </MarketingPageShell>
  );
}
