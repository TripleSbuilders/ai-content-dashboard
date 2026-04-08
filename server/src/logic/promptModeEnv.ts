export function isUseMetaPrompt(): boolean {
  const v = String(process.env.USE_META_PROMPT ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

