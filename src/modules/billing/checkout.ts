import { z } from "zod";

export const checkoutPlanSchema = z.enum(["PRO", "BUSINESS"]);

export type CheckoutPlan = z.infer<typeof checkoutPlanSchema>;

export function getPlanPriceId(input: {
  plan: CheckoutPlan;
  proPriceId?: string;
  businessPriceId?: string;
}) {
  if (input.plan === "PRO") {
    return input.proPriceId;
  }

  return input.businessPriceId;
}

export function buildCheckoutMetadata(input: { userId?: string; plan: CheckoutPlan }) {
  return {
    plan: input.plan,
    ...(input.userId ? { userId: input.userId } : {}),
  };
}
