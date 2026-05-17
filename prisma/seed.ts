import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import { customAlphabet } from "nanoid";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/quotepilot";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 32);

function token() {
  return nanoid();
}

async function main() {
  // Clients
  const mara = await prisma.client.upsert({
    where: { email: "mara@northlinestudio.ca" },
    update: {},
    create: {
      name: "Mara Chen",
      email: "mara@northlinestudio.ca",
      companyName: "Northline Studio",
      phone: "514-555-0141",
      address: "450 boul. Saint-Laurent, Montreal, QC H2Y 2Y7",
    },
  });

  const elliot = await prisma.client.upsert({
    where: { email: "elliot@atelierboutique.ca" },
    update: {},
    create: {
      name: "Elliot Moore",
      email: "elliot@atelierboutique.ca",
      companyName: "Atelier Boutique",
      phone: "418-555-0198",
      address: "72 rue Saint-Jean, Quebec City, QC G1R 1N5",
    },
  });

  const nadia = await prisma.client.upsert({
    where: { email: "nadia@riversidecondo.ca" },
    update: {},
    create: {
      name: "Nadia Fortin",
      email: "nadia@riversidecondo.ca",
      companyName: "Riverside Condo",
      phone: "450-555-0176",
    },
  });

  // Quotes
  const year = new Date().getFullYear();

  await prisma.quote.upsert({
    where: { quoteNumber: `QP-${year}-0001` },
    update: {},
    create: {
      quoteNumber: `QP-${year}-0014`,
      title: "Northline launch workspace",
      description: "Proposal created from the Luma Studio inquiry, then scheduled through ReserveFlow and delivered in ClientHub.",
      status: "ACCEPTED",
      clientId: mara.id,
      taxRateBps: 1498,
      subtotalCents: 2400000,
      taxCents: 359520,
      totalCents: 2759520,
      publicToken: token(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      acceptedAt: new Date(),
      items: {
        create: [
          { name: "Discovery and scope mapping", quantity: 1, unitPriceCents: 180000, totalCents: 180000, position: 0 },
          { name: "ClientHub delivery workspace", quantity: 1, unitPriceCents: 980000, totalCents: 980000, position: 1 },
          { name: "Launch kit implementation", quantity: 1, unitPriceCents: 890000, totalCents: 890000, position: 2 },
          { name: "Support and API usage setup", quantity: 1, unitPriceCents: 350000, totalCents: 350000, position: 3 },
        ],
      },
    },
  });

  await prisma.quote.upsert({
    where: { quoteNumber: `QP-${year}-0019` },
    update: {},
    create: {
      quoteNumber: `QP-${year}-0019`,
      title: "Atelier Boutique operations portal",
      description: "Commercial proposal for a workshop-driven rollout connected to ReserveFlow, EventPass, and CommerceKit.",
      status: "SENT",
      clientId: elliot.id,
      taxRateBps: 1498,
      subtotalCents: 1800000,
      taxCents: 269640,
      totalCents: 2069640,
      publicToken: token(),
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      sentAt: new Date(),
      items: {
        create: [
          { name: "Operational audit", quantity: 1, unitPriceCents: 220000, totalCents: 220000, position: 0 },
          { name: "ReserveFlow workshop setup", quantity: 1, unitPriceCents: 360000, totalCents: 360000, position: 1 },
          { name: "EventPass registration surface", quantity: 1, unitPriceCents: 520000, totalCents: 520000, position: 2 },
          { name: "CommerceKit fulfillment handoff", quantity: 1, unitPriceCents: 700000, totalCents: 700000, position: 3 },
        ],
      },
    },
  });

  await prisma.quote.upsert({
    where: { quoteNumber: `QP-${year}-0021` },
    update: {},
    create: {
      quoteNumber: `QP-${year}-0021`,
      title: "Riverside condo support refresh",
      description: "Smaller Luma consultation that becomes a ReserveFlow appointment and a SupportDesk follow-up.",
      status: "DRAFT",
      clientId: nadia.id,
      taxRateBps: 1498,
      subtotalCents: 620000,
      taxCents: 92876,
      totalCents: 712876,
      publicToken: token(),
      validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { name: "Material consultation", quantity: 1, unitPriceCents: 190000, totalCents: 190000, position: 0 },
          { name: "ReserveFlow follow-up booking", quantity: 1, unitPriceCents: 80000, totalCents: 80000, position: 1 },
          { name: "ClientHub decision package", quantity: 1, unitPriceCents: 230000, totalCents: 230000, position: 2 },
          { name: "SupportDesk post-delivery window", quantity: 1, unitPriceCents: 120000, totalCents: 120000, position: 3 },
        ],
      },
    },
  });

  await prisma.quote.upsert({
    where: { quoteNumber: `QP-${year}-0024` },
    update: {},
    create: {
      quoteNumber: `QP-${year}-0024`,
      title: "Event and API credit expansion",
      description: "Optional add-on that sells workshop seats and prepaid API usage through CommerceKit.",
      status: "REJECTED",
      clientId: mara.id,
      taxRateBps: 1498,
      subtotalCents: 408000,
      taxCents: 61118,
      totalCents: 469118,
      publicToken: token(),
      rejectedAt: new Date(),
      items: {
        create: [
          { name: "Workshop seat bundle", quantity: 2, unitPriceCents: 24900, totalCents: 49800, position: 0 },
          { name: "Priority support credits", quantity: 1, unitPriceCents: 12900, totalCents: 12900, position: 1 },
          { name: "API usage credits", quantity: 2, unitPriceCents: 15900, totalCents: 31800, position: 2 },
          { name: "Integration planning", quantity: 1, unitPriceCents: 313500, totalCents: 313500, position: 3 },
        ],
      },
    },
  });

  console.log("Seed complete: 3 ecosystem clients, 4 connected quotes.");
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
