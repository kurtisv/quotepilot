import { describe, expect, it } from "vitest";

import { getApiRateLimitKey } from "./rate-limit";

describe("api portal rate limit", () => {
  it("keys database requests by api key prefix", () => {
    expect(getApiRateLimitKey({ source: "database", key: "kv_demo", ip: "127.0.0.1" })).toBe(
      "api:database:kv_demo",
    );
  });

  it("keys demo requests by ip when available", () => {
    expect(getApiRateLimitKey({ source: "demo", key: "public-demo", ip: "127.0.0.1" })).toBe(
      "api:demo:127.0.0.1",
    );
  });
});
