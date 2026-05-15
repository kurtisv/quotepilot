import { describe, expect, it } from "vitest";

import { summarizeApiUsage } from "./usage";

describe("api usage summary", () => {
  it("summarizes request totals, errors, units, and latency", () => {
    expect(
      summarizeApiUsage([
        { statusCode: 200, latencyMs: 20, units: 1 },
        { statusCode: 500, latencyMs: 40, units: 2 },
        { statusCode: 200, latencyMs: null, units: 1 },
      ]),
    ).toEqual({
      totalRequests: 3,
      totalUnits: 4,
      errorRequests: 1,
      averageLatencyMs: 30,
    });
  });
});
