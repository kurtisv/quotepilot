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

export function ContactConfirmationEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Votre message a ete recu.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Merci {name}</Heading>
          <Section>
            <Text style={text}>
              Votre demande a ete recue. Nous allons vous repondre rapidement
              avec les prochaines etapes.
            </Text>
          </Section>
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
  fontSize: "24px",
  lineHeight: "32px",
  margin: "0 0 16px",
};

const text = {
  color: "#5f5b53",
  fontSize: "15px",
  lineHeight: "24px",
};
