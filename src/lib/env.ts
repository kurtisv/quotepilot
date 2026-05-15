import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  APP_NAME: z.string().default("KV Web Starter"),
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  AUTH_URL: z.string().url().optional(),
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),
  AUTH_TRUST_HOST: z.coerce.boolean().default(true),
  AUTH_ENABLE_DEMO_LOGIN: z.coerce.boolean().default(process.env.NODE_ENV !== "production"),
  AUTH_DEMO_EMAIL: z.string().email().default("admin@example.com"),
  AUTH_DEMO_PASSWORD: z.string().min(8).default("password123"),
  DASHBOARD_BOOTSTRAP_EMAILS: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),
  STRIPE_PRICE_BUSINESS: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  API_DEMO_KEYS: z.string().optional(),
  FEATURE_BOOKING: z.coerce.boolean().default(true),
  FEATURE_API_PORTAL: z.coerce.boolean().default(true),
  FEATURE_CMS: z.coerce.boolean().default(false),
  FEATURE_BILLING: z.coerce.boolean().default(true),
});

export const env = envSchema.parse(process.env);
