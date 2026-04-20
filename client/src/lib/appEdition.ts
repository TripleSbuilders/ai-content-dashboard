export type AppEdition = "self_serve" | "agency";

function normalizeEdition(value: unknown): AppEdition {
  return String(value ?? "").trim().toLowerCase() === "agency" ? "agency" : "self_serve";
}

/** Build-time edition switch for routing/copy behavior. */
export const APP_EDITION: AppEdition = normalizeEdition(import.meta.env.VITE_APP_EDITION);

function normalizeBoolean(value: unknown): boolean {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

export function isAgencyEdition(): boolean {
  return APP_EDITION === "agency";
}

export function isSelfServeEdition(): boolean {
  return APP_EDITION === "self_serve";
}

/** Enables the public V1 redirect gate while keeping internal admin backdoor access. */
export function isV1PublicDecommissionEnabled(): boolean {
  return isSelfServeEdition() && normalizeBoolean(import.meta.env.VITE_V1_PUBLIC_DECOMMISSION);
}

export function getV2CanonicalUrl(): string {
  const configured = String(import.meta.env.VITE_V2_CANONICAL_URL ?? "").trim();
  if (configured) return configured;
  return "https://ai-content-dashboard-app-v2.onrender.com/wizard/social";
}
