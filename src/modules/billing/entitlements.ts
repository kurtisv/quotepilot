export type BillablePlan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";

export type SubscriptionEntitlement = {
  plan: BillablePlan;
  status: string;
  currentPeriodEnd: Date | null;
};

const planRanks: Record<BillablePlan, number> = {
  FREE: 0,
  PRO: 1,
  BUSINESS: 2,
  ENTERPRISE: 3,
};

const activeStatuses = new Set(["active", "trialing"]);

export function isSubscriptionUsable(
  subscription: Pick<SubscriptionEntitlement, "status" | "currentPeriodEnd">,
  now = new Date(),
) {
  if (!activeStatuses.has(subscription.status)) {
    return false;
  }

  return !subscription.currentPeriodEnd || subscription.currentPeriodEnd > now;
}

export function hasMinimumPlan(plan: BillablePlan, minimumPlan: BillablePlan) {
  return planRanks[plan] >= planRanks[minimumPlan];
}

export function hasPlanEntitlement({
  subscriptions,
  minimumPlan,
  now = new Date(),
}: {
  subscriptions: SubscriptionEntitlement[];
  minimumPlan: BillablePlan;
  now?: Date;
}) {
  return subscriptions.some(
    (subscription) =>
      isSubscriptionUsable(subscription, now) &&
      hasMinimumPlan(subscription.plan, minimumPlan),
  );
}
