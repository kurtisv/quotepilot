import { describe, expect, it } from "vitest";

import { protectedRouteMatcher } from "@/lib/proxy-config";

describe("proxy config", () => {
  it("protects dashboard routes only", () => {
    expect(protectedRouteMatcher).toEqual(["/dashboard/:path*"]);
  });
});
