import { auth } from "@/lib/auth";

export async function requireDashboardAccess() {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      email: "recruiter-demo@kvportfolio.dev",
      name: "Recruiter Demo",
    };
  }

  return {
    email: session.user.email,
    name: session.user.name,
  };
}
