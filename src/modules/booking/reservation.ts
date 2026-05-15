import { z } from "zod";

export type ExistingBookingWindow = {
  startAt: Date;
  endAt: Date;
};

export const bookingRequestSchema = z.object({
  serviceId: z.string().trim().min(1, "Service is required"),
  staffId: z.string().trim().optional(),
  customerName: z.string().trim().min(2, "Name is required"),
  customerEmail: z.string().trim().email("Valid email is required"),
  customerPhone: z.string().trim().optional(),
  startAt: z.coerce.date(),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export function parseBookingRequestFormData(formData: FormData) {
  const parsed = bookingRequestSchema.parse({
    serviceId: formData.get("serviceId"),
    staffId: formData.get("staffId") || undefined,
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone") || undefined,
    startAt: formData.get("startAt"),
  });

  return {
    ...parsed,
    staffId: parsed.staffId || undefined,
    customerPhone: parsed.customerPhone || undefined,
  };
}

export function calculateBookingEndAt(startAt: Date, durationMin: number) {
  if (!Number.isInteger(durationMin) || durationMin <= 0) {
    throw new Error("durationMin must be a positive integer");
  }

  return new Date(startAt.getTime() + durationMin * 60_000);
}

export function hasBookingConflict({
  startAt,
  endAt,
  existingBookings,
}: {
  startAt: Date;
  endAt: Date;
  existingBookings: ExistingBookingWindow[];
}) {
  return existingBookings.some(
    (booking) => startAt < booking.endAt && booking.startAt < endAt,
  );
}
