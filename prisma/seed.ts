import { PrismaClient } from "../src/generated/prisma";
import { customAlphabet } from "nanoid";

const prisma = new PrismaClient();
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 32);

function token() {
  return nanoid();
}

async function main() {
  // Clients
  const acme = await prisma.client.upsert({
    where: { email: "info@acmelocal.qc.ca" },
    update: {},
    create: {
      name: "Marie-Claude Tremblay",
      email: "info@acmelocal.qc.ca",
      companyName: "Acme Local Services",
      phone: "514-555-0110",
      address: "123 rue Saint-Denis, Montreal, QC H2X 3K2",
    },
  });

  const northline = await prisma.client.upsert({
    where: { email: "contact@northlinestudio.ca" },
    update: {},
    create: {
      name: "Philippe Bergeron",
      email: "contact@northlinestudio.ca",
      companyName: "Northline Studio",
      phone: "438-555-0204",
      address: "450 boul. Saint-Laurent, Montreal, QC H2Y 2Y7",
    },
  });

  const urban = await prisma.client.upsert({
    where: { email: "urban@repairco.ca" },
    update: {},
    create: {
      name: "Josee Lavoie",
      email: "urban@repairco.ca",
      companyName: "Urban Repair Co.",
      phone: "514-555-0388",
    },
  });

  // Quotes
  const year = new Date().getFullYear();
  const pad = (n: number) => String(n).padStart(4, "0");

  await prisma.quote.upsert({
    where: { quoteNumber: `QP-${year}-0001` },
    update: {},
    create: {
      quoteNumber: `QP-${year}-0001`,
      title: "Refonte site vitrine + SEO",
      description: "Conception et developpement d'un site vitrine moderne avec optimisation pour les moteurs de recherche.",
      status: "ACCEPTED",
      clientId: acme.id,
      taxRateBps: 1498,
      subtotalCents: 350000,
      taxCents: 52413,
      totalCents: 402413,
      publicToken: token(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      acceptedAt: new Date(),
      items: {
        create: [
          { name: "Design maquettes (5 pages)", quantity: 1, unitPriceCents: 120000, totalCents: 120000, position: 0 },
          { name: "Developpement Next.js", quantity: 1, unitPriceCents: 180000, totalCents: 180000, position: 1 },
          { name: "Configuration SEO + sitemap", quantity: 1, unitPriceCents: 30000, totalCents: 30000, position: 2 },
          { name: "Formation CMS (2h)", quantity: 1, unitPriceCents: 20000, totalCents: 20000, position: 3 },
        ],
      },
    },
  });

  await prisma.quote.upsert({
    where: { quoteNumber: `QP-${year}-0002` },
    update: {},
    create: {
      quoteNumber: `QP-${year}-0002`,
      title: "Identite visuelle complete",
      description: "Logo, charte graphique, declinaisons print et numerique.",
      status: "SENT",
      clientId: northline.id,
      taxRateBps: 1498,
      subtotalCents: 220000,
      taxCents: 32945,
      totalCents: 252945,
      publicToken: token(),
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      sentAt: new Date(),
      items: {
        create: [
          { name: "Creation logo (3 concepts)", quantity: 1, unitPriceCents: 95000, totalCents: 95000, position: 0 },
          { name: "Charte graphique complete", quantity: 1, unitPriceCents: 75000, totalCents: 75000, position: 1 },
          { name: "Declinaisons cartes + en-tete", quantity: 1, unitPriceCents: 30000, totalCents: 30000, position: 2 },
          { name: "Kit reseaux sociaux", quantity: 1, unitPriceCents: 20000, totalCents: 20000, position: 3 },
        ],
      },
    },
  });

  await prisma.quote.upsert({
    where: { quoteNumber: `QP-${year}-0003` },
    update: {},
    create: {
      quoteNumber: `QP-${year}-0003`,
      title: "Application mobile React Native",
      description: "Prototype MVP pour gestion de commandes terrain.",
      status: "DRAFT",
      clientId: urban.id,
      taxRateBps: 1498,
      subtotalCents: 580000,
      taxCents: 86855,
      totalCents: 666855,
      publicToken: token(),
      validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { name: "Architecture technique", quantity: 1, unitPriceCents: 40000, totalCents: 40000, position: 0 },
          { name: "Developpement React Native", quantity: 1, unitPriceCents: 400000, totalCents: 400000, position: 1 },
          { name: "Integration API REST", quantity: 1, unitPriceCents: 80000, totalCents: 80000, position: 2 },
          { name: "Tests et demarrage", quantity: 1, unitPriceCents: 60000, totalCents: 60000, position: 3 },
        ],
      },
    },
  });

  await prisma.quote.upsert({
    where: { quoteNumber: `QP-${year}-0004` },
    update: {},
    create: {
      quoteNumber: `QP-${year}-0004`,
      title: "Campagne emailing + landing page",
      description: "Template email, sequences automatisees et page d'atterrissage pour lancement produit.",
      status: "REJECTED",
      clientId: acme.id,
      taxRateBps: 1498,
      subtotalCents: 95000,
      taxCents: 14226,
      totalCents: 109226,
      publicToken: token(),
      rejectedAt: new Date(),
      items: {
        create: [
          { name: "Design template email", quantity: 1, unitPriceCents: 35000, totalCents: 35000, position: 0 },
          { name: "Sequences automatisees (3)", quantity: 3, unitPriceCents: 12000, totalCents: 36000, position: 1 },
          { name: "Landing page conversion", quantity: 1, unitPriceCents: 24000, totalCents: 24000, position: 2 },
        ],
      },
    },
  });

  console.log("Seed complete: 3 clients, 4 quotes.");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
