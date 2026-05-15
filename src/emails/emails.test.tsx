import { isValidElement } from "react";
import { describe, expect, it } from "vitest";

import { BookingConfirmationEmail, formatBookingDate } from "./booking-confirmation";
import { ContactConfirmationEmail } from "./contact-confirmation";

describe("transactional emails", () => {
  it("creates contact and booking email elements", () => {
    expect(isValidElement(<ContactConfirmationEmail name="Alex" />)).toBe(true);
    expect(
      isValidElement(
        <BookingConfirmationEmail
          customerName="Alex"
          serviceName="Discovery call"
          startAt={new Date("2026-05-18T09:00:00.000Z")}
        />,
      ),
    ).toBe(true);
  });

  it("formats booking dates in UTC", () => {
    expect(formatBookingDate(new Date("2026-05-18T09:00:00.000Z"))).toContain("2026");
  });
});
