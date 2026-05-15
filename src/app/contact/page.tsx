import { sendContactMessage } from "@/app/actions/contact";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Section } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <MarketingPageShell>
      <Section className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <h1 className="text-4xl font-semibold">Contact</h1>
          <p className="mt-4 text-muted-foreground">
            Formulaire pret a brancher a Resend. Sans cle API, le message est ignore proprement en dev.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle demande</CardTitle>
            <CardDescription>Capture les leads pour les sites vitrines.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form action={sendContactMessage}>
              <FormField>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" required />
              </FormField>
              <FormField>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" required type="email" />
              </FormField>
              <FormField>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required />
              </FormField>
              <Button type="submit">Envoyer</Button>
            </Form>
          </CardContent>
        </Card>
      </Section>
    </MarketingPageShell>
  );
}
