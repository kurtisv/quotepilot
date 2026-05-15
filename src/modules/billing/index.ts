export const billingModule = {
  key: "billing",
  routes: ["/pricing", "/dashboard/billing", "/api/webhooks/stripe"],
};

export {
  buildCheckoutMetadata,
  checkoutPlanSchema,
  getPlanPriceId,
  type CheckoutPlan,
} from "./checkout";

export {
  getCurrentPeriodEnd,
  getPlanFromMetadata,
  getStripeId,
  mapStripeSubscription,
  type StripeSubscriptionLike,
} from "./webhook";

export {
  hasMinimumPlan,
  hasPlanEntitlement,
  isSubscriptionUsable,
  type BillablePlan,
  type SubscriptionEntitlement,
} from "./entitlements";
