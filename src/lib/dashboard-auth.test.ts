import { describe, expect, it } from "vitest";

import { Role } from "@/generated/prisma";
import {
  canBootstrapDashboard,
  isDashboardRole,
  parseBootstrapEmails,
} from "@/lib/dashboard-auth-rules";

describe("dashboard authorization", () => {
  it("limits dashboard management roles to owner and admin", () => {
    expect(isDashboardRole(Role.OWNER)).toBe(true);
    expect(isDashboardRole(Role.ADMIN)).toBe(true);
    expect(isDashboardRole(Role.MEMBER)).toBe(false);
    expect(isDashboardRole(Role.CUSTOMER)).toBe(false);
  });

  it("normalizes bootstrap email configuration", () => {
    expect(parseBootstrapEmails(" owner@example.com,ADMIN@example.com ,, ").has("admin@example.com")).toBe(
      true,
    );
  });

  it("allows configured bootstrap emails in production", () => {
    expect(
      canBootstrapDashboard({
        email: "owner@example.com",
        bootstrapEmails: "owner@example.com",
        membershipCount: 42,
        nodeEnv: "production",
      }),
    ).toBe(true);
  });

  it("only allows first-user bootstrap outside production when no memberships exist", () => {
    expect(
      canBootstrapDashboard({
        email: "first@example.com",
        membershipCount: 0,
        nodeEnv: "development",
      }),
    ).toBe(true);

    expect(
      canBootstrapDashboard({
        email: "first@example.com",
        membershipCount: 1,
        nodeEnv: "development",
      }),
    ).toBe(false);
  });
});
