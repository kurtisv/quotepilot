import { describe, expect, it } from "vitest";

import {
  calculateBookingEndAt,
  hasBookingConflict,
  parseBookingRequestFormData,
} from "./reservation";

describe("booking reservation", () => {
  it("parses booking request form data", () => {
    const formData = new FormData();
    formData.set("serviceId", "service_1");
    formData.set("customerName", "Client Example");
    formData.set("customerEmail", "client@example.com");
    formData.set("startAt", "2026-05-18T09:00:00.000Z");

    expect(parseBookingRequestFormData(formData)).toMatchObject({
      serviceId: "service_1",
      customerName: "Client Example",
      customerEmail: "client@example.com",
      staffId: undefined,
    });
  });

  it("calculates booking end time from service duration", () => {
    expect(calculateBookingEndAt(new Date("2026-05-18T09:00:00.000Z"), 45)).toEqual(
      new Date("2026-05-18T09:45:00.000Z"),
    );
  });

  it("detects overlapping booking windows", () => {
    const existingBookings = [
      {
        startAt: new Date("2026-05-18T10:00:00.000Z"),
        endAt: new Date("2026-05-18T10:30:00.000Z"),
      },
    ];

    expect(
      hasBookingConflict({
        startAt: new Date("2026-05-18T10:15:00.000Z"),
        endAt: new Date("2026-05-18T10:45:00.000Z"),
        existingBookings,
      }),
    ).toBe(true);

    expect(
      hasBookingConflict({
        startAt: new Date("2026-05-18T10:30:00.000Z"),
        endAt: new Date("2026-05-18T11:00:00.000Z"),
        existingBookings,
      }),
    ).toBe(false);
  });
});
