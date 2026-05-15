import { describe, expect, it } from "vitest";

import { getCurrentPeriodEnd, getPlanFromMetadata, getStripeId, mapStripeSubscription } from "./webhook";

describe("billing webhook helpers", () => {
  it("normalizes Stripe ids", () => {
    expect(getStripeId("cus_123")).toBe("cus_123");
    expect(getStripeId({ id: "cus_456" })).toBe("cus_456");
    expect(getStripeId(null)).toBeNull();
  });

  it("parses plan metadata safely", () => {
    expect(getPlanFromMetadata({ plan: "PRO" })).toBe("PRO");
    expect(getPlanFromMetadata({ plan: "BAD" })).toBeNull();
  });

  it("maps subscription data for persistence", () => {
    expect(
      mapStripeSubscription({
        id: "sub_123",
        customer: "cus_123",
        status: "active",
        current_period_end: 1_800_000_000,
        metadata: { plan: "BUSINESS" },
      }),
    ).toEqual({
      stripeSubscriptionId: "sub_123",
      stripeCustomerId: "cus_123",
      plan: "BUSINESS",
      status: "active",
      currentPeriodEnd: getCurrentPeriodEnd(1_800_000_000),
    });
  });
});
