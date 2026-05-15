import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface QuoteEmailProps {
  clientName: string;
  quoteNumber: string;
  title: string;
  totalCents: number;
  publicUrl: string;
}

export function QuoteEmail({
  clientName,
  quoteNumber,
  title,
  totalCents,
  publicUrl,
}: QuoteEmailProps) {
  const total = (totalCents / 100).toLocaleString("fr-CA", {
    style: "currency",
    currency: "CAD",
  });

  return (
    <Html>
      <Head />
      <Preview>Soumission {quoteNumber} — {title}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Votre soumission est prete</Heading>
          <Section>
            <Text style={text}>Bonjour {clientName},</Text>
            <Text style={text}>
              Nous avons prepare une soumission pour vous. Consultez les details
              ci-dessous et acceptez-la directement en ligne.
            </Text>
            <Text style={label}>Reference</Text>
            <Text style={value}>{quoteNumber}</Text>
            <Text style={label}>Description</Text>
            <Text style={value}>{title}</Text>
            <Text style={label}>Total</Text>
            <Text style={strongValue}>{total} (taxes incluses)</Text>
          </Section>
          <Section style={buttonSection}>
            <Button href={publicUrl} style={button}>
              Voir et accepter la soumission
            </Button>
          </Section>
          <Text style={footer}>
            Ce lien est unique et vous donne acces a votre soumission sans compte.
            Si vous avez des questions, repondez simplement a ce courriel.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f5f2",
  color: "#161513",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #dedbd2",
  margin: "32px auto",
  padding: "32px",
  width: "560px",
};

const heading = {
  fontSize: "22px",
  lineHeight: "30px",
  margin: "0 0 20px",
};

const text = {
  color: "#5f5b53",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 12px",
};

const label = {
  color: "#9c9690",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.08em",
  margin: "16px 0 2px",
  textTransform: "uppercase" as const,
};

const value = {
  color: "#161513",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "0",
};

const strongValue = {
  color: "#161513",
  fontSize: "18px",
  fontWeight: "700",
  lineHeight: "26px",
  margin: "0",
};

const buttonSection = {
  margin: "28px 0",
};

const button = {
  backgroundColor: "#161513",
  borderRadius: "0",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "500",
  padding: "12px 24px",
  textDecoration: "none",
};

const footer = {
  borderTop: "1px solid #e8e5dc",
  color: "#9c9690",
  fontSize: "12px",
  lineHeight: "20px",
  marginTop: "24px",
  paddingTop: "16px",
};
