export function assertSafeCorsOriginForRuntime(nodeEnv: string | undefined, corsOrigin: string | undefined): void {
  const env = String(nodeEnv ?? "").trim().toLowerCase();
  const origin = String(corsOrigin ?? "*").trim() || "*";
  if (env === "production" && origin === "*") {
    throw new Error(
      "[SECURITY] Refusing to start: CORS_ORIGIN='*' is not allowed in production. Configure trusted domain(s).",
    );
  }
}
