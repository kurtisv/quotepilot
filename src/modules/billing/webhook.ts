import { checkoutPlanSchema, type CheckoutPlan } from "./checkout";

export type StripeSubscriptionLike = {
  id: string;
  customer: string | { id: string } | null;
  status: string;
  current_period_end?: number | null;
  metadata?: Record<string, string>;
};

export function getStripeId(value: string | { id: string } | null | undefined) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

export function getPlanFromMetadata(metadata?: Record<string, string> | null): CheckoutPlan | null {
  const parsed = checkoutPlanSchema.safeParse(metadata?.plan);

  return parsed.success ? parsed.data : null;
}

export function getCurrentPeriodEnd(timestamp?: number | null) {
  return timestamp ? new Date(timestamp * 1000) : null;
}

export function mapStripeSubscription(subscription: StripeSubscriptionLike) {
  return {
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: getStripeId(subscription.customer),
    plan: getPlanFromMetadata(subscription.metadata),
    status: subscription.status,
    currentPeriodEnd: getCurrentPeriodEnd(subscription.current_period_end),
  };
}
