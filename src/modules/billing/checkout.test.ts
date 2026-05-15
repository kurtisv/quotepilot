import { describe, expect, it } from "vitest";

import { buildCheckoutMetadata, getPlanPriceId } from "./checkout";

describe("billing checkout helpers", () => {
  it("selects Stripe price ids by plan", () => {
    expect(getPlanPriceId({ plan: "PRO", proPriceId: "price_pro" })).toBe("price_pro");
    expect(getPlanPriceId({ plan: "BUSINESS", businessPriceId: "price_business" })).toBe(
      "price_business",
    );
  });

  it("builds checkout metadata", () => {
    expect(buildCheckoutMetadata({ plan: "PRO", userId: "user_1" })).toEqual({
      plan: "PRO",
      userId: "user_1",
    });
  });
});
