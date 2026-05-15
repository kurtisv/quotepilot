import { redirect } from "next/navigation";

import { signInWithCredentials, signInWithGitHub } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Acces administrateur pour le boilerplate.</CardDescription>
        </CardHeader>
        <CardContent>
          {params.error ? (
            <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Identifiants invalides.
            </p>
          ) : null}
          <div className="grid gap-4">
            {env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET ? (
              <form action={signInWithGitHub}>
                <Button className="w-full" type="submit">
                  Se connecter avec GitHub
                </Button>
              </form>
            ) : null}

            {env.AUTH_ENABLE_DEMO_LOGIN ? (
              <form action={signInWithCredentials} className="grid gap-4">
                <Input
                  autoComplete="email"
                  defaultValue={env.AUTH_DEMO_EMAIL}
                  name="email"
                  placeholder="admin@example.com"
                  type="email"
                />
                <Input
                  autoComplete="current-password"
                  defaultValue={env.AUTH_DEMO_PASSWORD}
                  name="password"
                  placeholder="Mot de passe"
                  type="password"
                />
                <Button type="submit">Se connecter</Button>
              </form>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
