import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireDashboardAccess() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return {
    email: session.user.email,
    name: session.user.name,
  };
}
