import { describe, expect, it } from "vitest";

import { generateBookingSlots, minutesToTime, timeToMinutes } from "./availability";

const mondayRule = {
  weekday: 1,
  startTime: "09:00",
  endTime: "12:00",
};

describe("booking availability", () => {
  it("generates bookable slots for matching weekday rules", () => {
    const slots = generateBookingSlots({
      date: "2026-05-18",
      rules: [mondayRule],
      serviceDurationMin: 60,
    });

    expect(slots.map((slot) => slot.startTime)).toEqual(["09:00", "10:00", "11:00"]);
    expect(slots[0]?.endTime).toBe("10:00");
  });

  it("removes slots blocked by exceptions and existing bookings", () => {
    const slots = generateBookingSlots({
      date: "2026-05-18",
      rules: [mondayRule],
      exceptions: [{ date: "2026-05-18", startTime: "10:00", endTime: "11:00" }],
      bookedIntervals: [
        {
          startAt: new Date("2026-05-18T11:00:00.000Z"),
          endAt: new Date("2026-05-18T12:00:00.000Z"),
        },
      ],
      serviceDurationMin: 60,
    });

    expect(slots.map((slot) => slot.startTime)).toEqual(["09:00"]);
  });

  it("returns no slots when the day is closed", () => {
    const slots = generateBookingSlots({
      date: "2026-05-18",
      rules: [mondayRule],
      exceptions: [{ date: "2026-05-18", isClosed: true }],
      serviceDurationMin: 30,
    });

    expect(slots).toEqual([]);
  });

  it("converts time strings and minutes consistently", () => {
    expect(timeToMinutes("13:45")).toBe(825);
    expect(minutesToTime(825)).toBe("13:45");
  });
});
