import { nanoid } from "nanoid";

export function formatCurrency(cents: number, locale = "fr-CA"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function calculateQuoteTotals(
  items: { quantity: number; unitPriceCents: number }[],
  taxRateBps: number
): { subtotalCents: number; taxCents: number; totalCents: number } {
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceCents,
    0
  );
  const taxCents = Math.round((subtotalCents * taxRateBps) / 10000);
  const totalCents = subtotalCents + taxCents;
  return { subtotalCents, taxCents, totalCents };
}

export function taxRateBpsToPercent(bps: number): string {
  return (bps / 100).toFixed(3).replace(/\.?0+$/, "") + "%";
}

// QP-2026-0001 format
export async function generateQuoteNumber(
  getCount: () => Promise<number>
): Promise<string> {
  const year = new Date().getFullYear();
  const count = await getCount();
  const seq = String(count + 1).padStart(4, "0");
  return `QP-${year}-${seq}`;
}

export function generatePublicToken(): string {
  return nanoid(32);
}
