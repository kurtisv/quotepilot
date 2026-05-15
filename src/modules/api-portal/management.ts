import { z } from "zod";

export const apiKeyFormSchema = z.object({
  name: z.string().trim().min(2, "API key name is required"),
  scopes: z.string().trim().default("demo:read"),
});

export function parseApiKeyFormData(formData: FormData) {
  const parsed = apiKeyFormSchema.parse({
    name: formData.get("name"),
    scopes: formData.get("scopes") || "demo:read",
  });

  return {
    name: parsed.name,
    scopes: parsed.scopes
      .split(",")
      .map((scope) => scope.trim())
      .filter(Boolean),
  };
}
