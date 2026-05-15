import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function BookingConfirmationEmail({
  customerName,
  serviceName,
  startAt,
}: {
  customerName: string;
  serviceName: string;
  startAt: Date;
}) {
  return (
    <Html>
      <Head />
      <Preview>Votre demande de reservation est en attente.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Reservation recue</Heading>
          <Section>
            <Text style={text}>Bonjour {customerName},</Text>
            <Text style={text}>
              Nous avons recu votre demande pour {serviceName}. Le statut est
              en attente jusqu a confirmation finale.
            </Text>
            <Text style={strongText}>{formatBookingDate(startAt)}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function formatBookingDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
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
  fontSize: "24px",
  lineHeight: "32px",
  margin: "0 0 16px",
};

const text = {
  color: "#5f5b53",
  fontSize: "15px",
  lineHeight: "24px",
};

const strongText = {
  color: "#161513",
  fontSize: "16px",
  fontWeight: "700",
  lineHeight: "24px",
};
