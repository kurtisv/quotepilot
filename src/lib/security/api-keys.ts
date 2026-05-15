import { compare, hash } from "bcryptjs";
import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const random = customAlphabet(alphabet, 32);

export function createApiKey() {
  const prefix = `kv_${random(8)}`;
  const secret = random(32);

  return {
    prefix,
    plainTextKey: `${prefix}.${secret}`,
  };
}

export async function hashApiKey(apiKey: string) {
  return hash(apiKey, 12);
}

export async function verifyApiKey(apiKey: string, hashedKey: string) {
  return compare(apiKey, hashedKey);
}

export function getApiKeyPrefix(apiKey: string) {
  return apiKey.split(".")[0] ?? "";
}
