"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/db";

const clientSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  companyName: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  address: z.string().max(300).optional(),
});

export async function createClient(formData: FormData) {
  await requireDashboardAccess();

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    companyName: formData.get("companyName") || undefined,
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
  });

  if (!parsed.success) redirect("/dashboard/clients/new?error=invalid");

  const client = await prisma.client.create({ data: parsed.data });

  revalidatePath("/dashboard/clients");
  redirect(`/dashboard/clients/${client.id}`);
}
