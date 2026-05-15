import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z.string().trim().min(2, "Service name is required"),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  durationMin: z.coerce.number().int().min(5).max(480),
  priceCents: z.coerce.number().int().min(0).optional(),
});

export const staffFormSchema = z.object({
  name: z.string().trim().min(2, "Staff name is required"),
  email: z.string().trim().email().optional().or(z.literal("")),
});

export const availabilityRuleFormSchema = z.object({
  staffId: z.string().trim().min(1, "Staff member is required"),
  weekday: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must use HH:mm"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must use HH:mm"),
  timezone: z.string().trim().min(1).default("America/Toronto"),
});

export const availabilityExceptionFormSchema = z.object({
  staffId: z.string().trim().min(1, "Staff member is required"),
  date: z.coerce.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  isClosed: z.coerce.boolean().default(false),
});

export type ServiceFormInput = z.infer<typeof serviceFormSchema>;
export type StaffFormInput = z.infer<typeof staffFormSchema>;
export type AvailabilityRuleFormInput = z.infer<typeof availabilityRuleFormSchema>;
export type AvailabilityExceptionFormInput = z.infer<typeof availabilityExceptionFormSchema>;

export function slugifyServiceName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseServiceFormData(formData: FormData) {
  const parsed = serviceFormSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    durationMin: formData.get("durationMin"),
    priceCents: formData.get("priceCents") || undefined,
  });

  return {
    ...parsed,
    slug: parsed.slug || slugifyServiceName(parsed.name),
  };
}

export function parseStaffFormData(formData: FormData) {
  const parsed = staffFormSchema.parse({
    name: formData.get("name"),
    email: formData.get("email") || undefined,
  });

  return {
    ...parsed,
    email: parsed.email || undefined,
  };
}

export function parseAvailabilityRuleFormData(formData: FormData) {
  return availabilityRuleFormSchema.parse({
    staffId: formData.get("staffId"),
    weekday: formData.get("weekday"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    timezone: formData.get("timezone") || "America/Toronto",
  });
}

export function parseAvailabilityExceptionFormData(formData: FormData) {
  const parsed = availabilityExceptionFormSchema.parse({
    staffId: formData.get("staffId"),
    date: formData.get("date"),
    startTime: formData.get("startTime") || undefined,
    endTime: formData.get("endTime") || undefined,
    isClosed: formData.get("isClosed") === "on",
  });

  return {
    ...parsed,
    startTime: parsed.startTime || undefined,
    endTime: parsed.endTime || undefined,
  };
}
