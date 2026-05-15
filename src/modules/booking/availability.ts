export type AvailabilityRule = {
  weekday: number;
  startTime: string;
  endTime: string;
  timezone?: string;
};

export type AvailabilityException = {
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  isClosed?: boolean;
};

export type BookedInterval = {
  startAt: Date;
  endAt: Date;
};

export type BookingSlot = {
  date: string;
  startTime: string;
  endTime: string;
  startAt: Date;
  endAt: Date;
};

type GenerateSlotsInput = {
  date: string;
  rules: AvailabilityRule[];
  exceptions?: AvailabilityException[];
  bookedIntervals?: BookedInterval[];
  serviceDurationMin: number;
  slotIntervalMin?: number;
};

export function generateBookingSlots({
  date,
  rules,
  exceptions = [],
  bookedIntervals = [],
  serviceDurationMin,
  slotIntervalMin = serviceDurationMin,
}: GenerateSlotsInput) {
  if (serviceDurationMin <= 0) {
    throw new Error("serviceDurationMin must be greater than zero");
  }

  if (slotIntervalMin <= 0) {
    throw new Error("slotIntervalMin must be greater than zero");
  }

  const weekday = getUtcWeekday(date);
  const dayRules = rules.filter((rule) => rule.weekday === weekday);
  const dayExceptions = exceptions.filter((exception) => exception.date === date);

  if (dayExceptions.some((exception) => exception.isClosed)) {
    return [];
  }

  const blockedIntervals = [
    ...dayExceptions
      .filter((exception) => exception.startTime && exception.endTime)
      .map((exception) => ({
        start: timeToMinutes(exception.startTime as string),
        end: timeToMinutes(exception.endTime as string),
      })),
    ...bookedIntervals.map((booking) => ({
      start: booking.startAt.getUTCHours() * 60 + booking.startAt.getUTCMinutes(),
      end: booking.endAt.getUTCHours() * 60 + booking.endAt.getUTCMinutes(),
    })),
  ];

  return dayRules.flatMap((rule) => {
    const start = timeToMinutes(rule.startTime);
    const end = timeToMinutes(rule.endTime);
    const slots: BookingSlot[] = [];

    for (let cursor = start; cursor + serviceDurationMin <= end; cursor += slotIntervalMin) {
      const slotEnd = cursor + serviceDurationMin;
      const isBlocked = blockedIntervals.some((interval) =>
        intervalsOverlap(cursor, slotEnd, interval.start, interval.end),
      );

      if (!isBlocked) {
        const startTime = minutesToTime(cursor);
        const endTime = minutesToTime(slotEnd);

        slots.push({
          date,
          startTime,
          endTime,
          startAt: toUtcDate(date, startTime),
          endAt: toUtcDate(date, endTime),
        });
      }
    }

    return slots;
  });
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    throw new Error(`Invalid time: ${time}`);
  }

  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function getUtcWeekday(date: string) {
  return new Date(`${date}T00:00:00.000Z`).getUTCDay();
}

function toUtcDate(date: string, time: string) {
  return new Date(`${date}T${time}:00.000Z`);
}

function intervalsOverlap(startA: number, endA: number, startB: number, endB: number) {
  return startA < endB && startB < endA;
}
