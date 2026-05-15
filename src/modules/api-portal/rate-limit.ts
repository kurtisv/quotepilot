export function getApiRateLimitKey(input: {
  source: "demo" | "database";
  key: string;
  ip?: string | null;
}) {
  const identifier = input.source === "database" ? input.key : input.ip || input.key;
  return `api:${input.source}:${identifier}`;
}

export async function limitApiRequest(_identifier: string) {
  return { success: true as const };
}
