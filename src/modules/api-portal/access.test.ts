import { describe, expect, it } from "vitest";

import {
  getApiKeyFromHeaders,
  hasRequiredScopes,
  parseApiCredentials,
  verifyApiAccess,
} from "./access";

describe("api portal access", () => {
  it("extracts API keys from bearer and x-api-key headers", () => {
    expect(getApiKeyFromHeaders(new Headers({ authorization: "Bearer kv_test.secret" }))).toBe(
      "kv_test.secret",
    );
    expect(getApiKeyFromHeaders(new Headers({ "x-api-key": "kv_header.secret" }))).toBe(
      "kv_header.secret",
    );
  });

  it("parses semicolon-separated demo credentials", () => {
    expect(parseApiCredentials("key_a:demo:read,usage:read;key_b:*")).toEqual([
      { key: "key_a", scopes: ["demo:read", "usage:read"] },
      { key: "key_b", scopes: ["*"] },
    ]);
  });

  it("allows wildcard scopes and rejects missing scopes", () => {
    expect(hasRequiredScopes(["*"], ["demo:read"])).toBe(true);
    expect(hasRequiredScopes(["usage:read"], ["demo:read"])).toBe(false);
  });

  it("verifies keys and required scopes", () => {
    const result = verifyApiAccess({
      headers: new Headers({ authorization: "Bearer demo-key" }),
      credentials: [{ key: "demo-key", scopes: ["demo:read"] }],
      requiredScopes: ["demo:read"],
    });

    expect(result).toEqual({ ok: true, key: "demo-key", scopes: ["demo:read"] });
  });

  it("returns public demo access when no credentials are configured", () => {
    expect(
      verifyApiAccess({
        headers: new Headers(),
        credentials: [],
        requiredScopes: ["demo:read"],
      }),
    ).toEqual({ ok: true, key: "public-demo", scopes: ["*"] });
  });
});
