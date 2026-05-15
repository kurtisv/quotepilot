import { describe, expect, it } from "vitest";

import { createApiKey, getApiKeyPrefix, hashApiKey, verifyApiKey } from "./api-keys";

describe("api keys", () => {
  it("creates, hashes, and verifies API keys", async () => {
    const key = createApiKey();
    const hashedKey = await hashApiKey(key.plainTextKey);

    expect(getApiKeyPrefix(key.plainTextKey)).toBe(key.prefix);
    await expect(verifyApiKey(key.plainTextKey, hashedKey)).resolves.toBe(true);
  });
});
