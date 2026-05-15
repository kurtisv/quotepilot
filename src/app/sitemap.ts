import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

const routes = [
  "",
  "/services",
  "/pricing",
  "/contact",
  "/faq",
  "/testimonials",
  "/booking",
  "/developers",
  "/docs",
  "/docs/api",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${env.NEXT_PUBLIC_APP_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
