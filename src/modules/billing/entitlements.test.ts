import { describe, expect, it } from "vitest";

import { hasMinimumPlan, hasPlanEntitlement, isSubscriptionUsable } from "./entitlements";

describe("billing entitlements", () => {
  it("orders plans by paid access level", () => {
    expect(hasMinimumPlan("BUSINESS", "PRO")).toBe(true);
    expect(hasMinimumPlan("PRO", "BUSINESS")).toBe(false);
  });

  it("requires active or trialing unexpired subscriptions", () => {
    const now = new Date("2026-05-15T12:00:00.000Z");

    expect(isSubscriptionUsable({ status: "active", currentPeriodEnd: null }, now)).toBe(true);
    expect(
      isSubscriptionUsable({ status: "trialing", currentPeriodEnd: new Date("2026-05-16T12:00:00.000Z") }, now),
    ).toBe(true);
    expect(
      isSubscriptionUsable({ status: "active", currentPeriodEnd: new Date("2026-05-14T12:00:00.000Z") }, now),
    ).toBe(false);
    expect(isSubscriptionUsable({ status: "canceled", currentPeriodEnd: null }, now)).toBe(false);
  });

  it("grants entitlement when any subscription satisfies the minimum plan", () => {
    expect(
      hasPlanEntitlement({
        minimumPlan: "PRO",
        subscriptions: [
          { plan: "FREE", status: "active", currentPeriodEnd: null },
          { plan: "BUSINESS", status: "active", currentPeriodEnd: null },
        ],
      }),
    ).toBe(true);
  });
});
