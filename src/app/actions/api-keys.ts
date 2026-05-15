"use server";

export type CreateApiKeyState = { ok: false; error: string } | null;

export async function createDashboardApiKey(): Promise<CreateApiKeyState> {
  return { ok: false, error: "API keys not available in this project." };
}

export async function revokeDashboardApiKey() {
  return;
}
