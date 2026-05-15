import { describe, expect, it } from "vitest";

import { shouldTrustAuthHost } from "@/lib/auth-host";

describe("Auth.js trusted host configuration", () => {
  it("trusts explicit configuration", () => {
    expect(
      shouldTrustAuthHost({
        authTrustHost: true,
        appUrl: "https://example.com",
        nodeEnv: "production",
      }),
    ).toBe(true);
  });

  it("trusts local production starts", () => {
    expect(
      shouldTrustAuthHost({
        authTrustHost: false,
        appUrl: "http://localhost:3000",
        nodeEnv: "production",
      }),
    ).toBe(true);
  });

  it("does not trust arbitrary production hosts by default", () => {
    expect(
      shouldTrustAuthHost({
        authTrustHost: false,
        appUrl: "https://example.com",
        nodeEnv: "production",
      }),
    ).toBe(false);
  });

  it("matches the starter default through AUTH_TRUST_HOST", () => {
    expect(
      shouldTrustAuthHost({
        authTrustHost: true,
        appUrl: "https://client.example.com",
        nodeEnv: "production",
      }),
    ).toBe(true);
  });
});
