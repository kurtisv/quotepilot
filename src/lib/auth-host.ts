export function shouldTrustAuthHost({
  authTrustHost,
  appUrl,
  nodeEnv,
}: {
  authTrustHost: boolean;
  appUrl: string;
  nodeEnv: string | undefined;
}) {
  if (authTrustHost || nodeEnv !== "production") {
    return true;
  }

  try {
    const hostname = new URL(appUrl).hostname;

    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
}
