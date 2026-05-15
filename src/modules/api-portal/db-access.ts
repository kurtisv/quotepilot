import { getApiKeyPrefix, verifyApiKey } from "@/lib/security/api-keys";

import {
  type ApiCredential,
  getApiKeyFromHeaders,
  hasRequiredScopes,
} from "./access";

export type DatabaseApiCredential = {
  id: string;
  userId: string;
  prefix: string;
  hashedKey: string;
  scopes: string[];
  revokedAt: Date | null;
};

export type AuthenticatedApiAccess =
  | {
      ok: true;
      source: "demo" | "database";
      key: string;
      scopes: string[];
      apiKeyId?: string;
      userId?: string;
    }
  | {
      ok: false;
      status: 401 | 403;
      error: string;
    };

type AuthenticateApiRequestInput = {
  headers: Headers;
  requiredScopes?: string[];
  demoCredentials?: ApiCredential[];
  findDatabaseCredential: (prefix: string) => Promise<DatabaseApiCredential | null>;
};

export async function authenticateApiRequest({
  headers,
  requiredScopes = [],
  demoCredentials = [],
  findDatabaseCredential,
}: AuthenticateApiRequestInput): Promise<AuthenticatedApiAccess> {
  const apiKey = getApiKeyFromHeaders(headers);

  if (!apiKey && demoCredentials.length === 0) {
    return {
      ok: true,
      source: "demo",
      key: "public-demo",
      scopes: ["*"],
    };
  }

  if (!apiKey) {
    return {
      ok: false,
      status: 401,
      error: "Missing API key",
    };
  }

  const demoCredential = demoCredentials.find((credential) => credential.key === apiKey);

  if (demoCredential) {
    if (!hasRequiredScopes(demoCredential.scopes, requiredScopes)) {
      return {
        ok: false,
        status: 403,
        error: "Insufficient API key scope",
      };
    }

    return {
      ok: true,
      source: "demo",
      key: apiKey,
      scopes: demoCredential.scopes,
    };
  }

  const prefix = getApiKeyPrefix(apiKey);
  const databaseCredential = await findDatabaseCredential(prefix);

  if (!databaseCredential || databaseCredential.revokedAt) {
    return {
      ok: false,
      status: 401,
      error: "Invalid API key",
    };
  }

  const isValidKey = await verifyApiKey(apiKey, databaseCredential.hashedKey);

  if (!isValidKey) {
    return {
      ok: false,
      status: 401,
      error: "Invalid API key",
    };
  }

  if (!hasRequiredScopes(databaseCredential.scopes, requiredScopes)) {
    return {
      ok: false,
      status: 403,
      error: "Insufficient API key scope",
    };
  }

  return {
    ok: true,
    source: "database",
    key: prefix,
    scopes: databaseCredential.scopes,
    apiKeyId: databaseCredential.id,
    userId: databaseCredential.userId,
  };
}
