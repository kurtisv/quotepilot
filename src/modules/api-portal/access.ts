export type ApiCredential = {
  key: string;
  scopes: string[];
};

export type ApiAccessResult =
  | {
      ok: true;
      key: string;
      scopes: string[];
    }
  | {
      ok: false;
      status: 401 | 403;
      error: string;
    };

type VerifyApiAccessInput = {
  headers: Headers;
  credentials: ApiCredential[];
  requiredScopes?: string[];
};

export function getApiKeyFromHeaders(headers: Headers) {
  const authorization = headers.get("authorization");

  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice("bearer ".length).trim();
  }

  return headers.get("x-api-key")?.trim() ?? "";
}

export function parseApiCredentials(value?: string | null): ApiCredential[] {
  if (!value) {
    return [];
  }

  return value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separatorIndex = entry.indexOf(":");
      const key = separatorIndex === -1 ? entry : entry.slice(0, separatorIndex);
      const scopes = separatorIndex === -1 ? "" : entry.slice(separatorIndex + 1);

      return {
        key: key.trim(),
        scopes: scopes
          .split(",")
          .map((scope) => scope.trim())
          .filter(Boolean),
      };
    })
    .filter((credential) => credential.key.length > 0);
}

export function hasRequiredScopes(grantedScopes: string[], requiredScopes: string[]) {
  if (requiredScopes.length === 0) {
    return true;
  }

  if (grantedScopes.includes("*")) {
    return true;
  }

  return requiredScopes.every((scope) => grantedScopes.includes(scope));
}

export function verifyApiAccess({
  headers,
  credentials,
  requiredScopes = [],
}: VerifyApiAccessInput): ApiAccessResult {
  if (credentials.length === 0) {
    return {
      ok: true,
      key: "public-demo",
      scopes: ["*"],
    };
  }

  const apiKey = getApiKeyFromHeaders(headers);

  if (!apiKey) {
    return {
      ok: false,
      status: 401,
      error: "Missing API key",
    };
  }

  const credential = credentials.find((candidate) => candidate.key === apiKey);

  if (!credential) {
    return {
      ok: false,
      status: 401,
      error: "Invalid API key",
    };
  }

  if (!hasRequiredScopes(credential.scopes, requiredScopes)) {
    return {
      ok: false,
      status: 403,
      error: "Insufficient API key scope",
    };
  }

  return {
    ok: true,
    key: apiKey,
    scopes: credential.scopes,
  };
}
