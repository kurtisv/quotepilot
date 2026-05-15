import { describe, expect, it } from "vitest";

import {
  parseAvailabilityExceptionFormData,
  parseAvailabilityRuleFormData,
  parseServiceFormData,
  parseStaffFormData,
  slugifyServiceName,
} from "./management";

describe("booking management forms", () => {
  it("slugifies service names", () => {
    expect(slugifyServiceName("Premium Audit Call")).toBe("premium-audit-call");
  });

  it("parses service form data with generated slug", () => {
    const formData = new FormData();
    formData.set("name", "Strategy Session");
    formData.set("durationMin", "45");
    formData.set("priceCents", "12500");

    expect(parseServiceFormData(formData)).toMatchObject({
      name: "Strategy Session",
      slug: "strategy-session",
      durationMin: 45,
      priceCents: 12500,
    });
  });

  it("normalizes blank staff email", () => {
    const formData = new FormData();
    formData.set("name", "Jane Operator");
    formData.set("email", "");

    expect(parseStaffFormData(formData)).toEqual({
      name: "Jane Operator",
      email: undefined,
    });
  });

  it("parses weekly availability rules", () => {
    const formData = new FormData();
    formData.set("staffId", "staff_1");
    formData.set("weekday", "1");
    formData.set("startTime", "09:00");
    formData.set("endTime", "17:00");

    expect(parseAvailabilityRuleFormData(formData)).toEqual({
      staffId: "staff_1",
      weekday: 1,
      startTime: "09:00",
      endTime: "17:00",
      timezone: "America/Toronto",
    });
  });

  it("parses closed-day availability exceptions", () => {
    const formData = new FormData();
    formData.set("staffId", "staff_1");
    formData.set("date", "2026-05-18");
    formData.set("isClosed", "on");

    expect(parseAvailabilityExceptionFormData(formData)).toMatchObject({
      staffId: "staff_1",
      isClosed: true,
      startTime: undefined,
      endTime: undefined,
    });
  });
});
