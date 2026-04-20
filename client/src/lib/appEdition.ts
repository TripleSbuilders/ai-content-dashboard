export type AppEdition = "self_serve" | "agency";

function normalizeEdition(value: unknown): AppEdition {
  return String(value ?? "").trim().toLowerCase() === "agency" ? "agency" : "self_serve";
}

/** Build-time edition switch for routing/copy behavior. */
export const APP_EDITION: AppEdition = normalizeEdition(import.meta.env.VITE_APP_EDITION);

export function isAgencyEdition(): boolean {
  return APP_EDITION === "agency";
}
