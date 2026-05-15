import { describe, expect, it } from "vitest";

import { hashApiKey } from "@/lib/security/api-keys";

import { authenticateApiRequest } from "./db-access";

describe("database API access", () => {
  it("authenticates demo credentials before database lookup", async () => {
    const result = await authenticateApiRequest({
      headers: new Headers({ authorization: "Bearer demo-key" }),
      requiredScopes: ["demo:read"],
      demoCredentials: [{ key: "demo-key", scopes: ["demo:read"] }],
      findDatabaseCredential: async () => null,
    });

    expect(result).toEqual({
      ok: true,
      source: "demo",
      key: "demo-key",
      scopes: ["demo:read"],
    });
  });

  it("authenticates hashed database keys by prefix", async () => {
    const plainTextKey = "kv_test.secret";
    const hashedKey = await hashApiKey(plainTextKey);
    const result = await authenticateApiRequest({
      headers: new Headers({ "x-api-key": plainTextKey }),
      requiredScopes: ["demo:read"],
      findDatabaseCredential: async (prefix) => ({
        id: "key_1",
        userId: "user_1",
        prefix,
        hashedKey,
        scopes: ["demo:read"],
        revokedAt: null,
      }),
    });

    expect(result).toEqual({
      ok: true,
      source: "database",
      key: "kv_test",
      scopes: ["demo:read"],
      apiKeyId: "key_1",
      userId: "user_1",
    });
  });

  it("rejects revoked database keys", async () => {
    const result = await authenticateApiRequest({
      headers: new Headers({ "x-api-key": "kv_test.secret" }),
      requiredScopes: ["demo:read"],
      findDatabaseCredential: async (prefix) => ({
        id: "key_1",
        userId: "user_1",
        prefix,
        hashedKey: "hash",
        scopes: ["demo:read"],
        revokedAt: new Date("2026-05-18T09:00:00.000Z"),
      }),
    });

    expect(result).toEqual({ ok: false, status: 401, error: "Invalid API key" });
  });
});
