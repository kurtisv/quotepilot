export const apiPortalModule = {
  key: "api-portal",
  routes: ["/developers", "/docs", "/dashboard/api-keys", "/api/v1"],
};

export {
  getApiKeyFromHeaders,
  hasRequiredScopes,
  parseApiCredentials,
  verifyApiAccess,
  type ApiAccessResult,
  type ApiCredential,
} from "./access";

export { apiKeyFormSchema, parseApiKeyFormData } from "./management";

export {
  authenticateApiRequest,
  type AuthenticatedApiAccess,
  type DatabaseApiCredential,
} from "./db-access";

export { getApiRateLimitKey, limitApiRequest } from "./rate-limit";

export { summarizeApiUsage, type ApiUsageSummaryInput } from "./usage";
