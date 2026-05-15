import { Role } from "@/generated/prisma";

export const dashboardRoles = [Role.OWNER, Role.ADMIN] as const;

export function isDashboardRole(role: Role | null | undefined) {
  return role === Role.OWNER || role === Role.ADMIN;
}

export function parseBootstrapEmails(value: string | null | undefined) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function canBootstrapDashboard({
  email,
  bootstrapEmails,
  membershipCount,
  nodeEnv,
}: {
  email: string;
  bootstrapEmails?: string | null;
  membershipCount: number;
  nodeEnv: string | undefined;
}) {
  const allowedEmails = parseBootstrapEmails(bootstrapEmails);

  if (allowedEmails.has(email.toLowerCase())) {
    return true;
  }

  return membershipCount === 0 && nodeEnv !== "production";
}
