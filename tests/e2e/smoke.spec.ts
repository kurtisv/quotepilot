import { expect, test } from "@playwright/test";

test("marketing, docs, and public API routes render", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /base premium/i })).toBeVisible();

  await page.goto("/booking?date=2026-05-18");
  await expect(page.getByRole("heading", { name: /reservation claire/i })).toBeVisible();

  await page.goto("/docs");
  await expect(page.getByRole("heading", { name: /utiliser kv web starter/i })).toBeVisible();

  await page.goto("/docs/api");
  await expect(page.getByText(/kv web starter api/i).first()).toBeVisible();

  const openapi = await request.get("/api/openapi");
  expect(openapi.ok()).toBe(true);

  const demo = await request.get("/api/v1/demo");
  expect(demo.ok()).toBe(true);
});

test("dashboard routes require login", async ({ page }) => {
  await page.goto("/dashboard/api-usage");
  await expect(page).toHaveURL(/\/login/);
});
