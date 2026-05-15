import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { z } from "zod";

import { shouldTrustAuthHost } from "@/lib/auth-host";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: env.AUTH_SECRET ?? "development-only-secret-change-before-production",
  trustHost: shouldTrustAuthHost({
    authTrustHost: env.AUTH_TRUST_HOST,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    nodeEnv: process.env.NODE_ENV,
  }),
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [
    ...(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET
      ? [
          GitHub({
            clientId: env.AUTH_GITHUB_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
          }),
        ]
      : []),
    ...(env.AUTH_ENABLE_DEMO_LOGIN
      ? [
          Credentials({
            name: "Demo credentials",
            credentials: {
              email: { label: "Email", type: "email" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              const parsed = z
                .object({
                  email: z.string().email(),
                  password: z.string().min(8),
                })
                .safeParse(credentials);

              if (!parsed.success) {
                return null;
              }

              const isDemoUser =
                parsed.data.email === env.AUTH_DEMO_EMAIL &&
                parsed.data.password === env.AUTH_DEMO_PASSWORD;

              if (!isDemoUser) {
                return null;
              }

              return {
                id: "demo-admin",
                name: "Demo Admin",
                email: env.AUTH_DEMO_EMAIL,
              };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
  },
});
