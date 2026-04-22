export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export type FailureCode =
  | "INVALID_MODEL_JSON"
  | "MODEL_TIMEOUT"
  | "API_KEY_MISSING"
  | "CONTENT_PACKAGE_CHAIN_FAILED"
  | "GENERATION_FAILED"
  | "RETRY_FAILED"
  | "REGENERATE_CALL_FAILED";

function normalizeErrorMessage(err: unknown): string {
  if (err instanceof Error) return String(err.message ?? "").trim();
  return String(err ?? "").trim();
}

export function toFailureCode(err: unknown, fallbackCode: FailureCode = "GENERATION_FAILED"): FailureCode {
  const message = normalizeErrorMessage(err).toLowerCase();
  if (!message) return fallbackCode;

  if (message.includes("missing gemini_api_key")) return "API_KEY_MISSING";
  if (message.includes("content_package_chain")) return "CONTENT_PACKAGE_CHAIN_FAILED";
  if (
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("etimedout") ||
    message.includes("deadline")
  ) {
    return "MODEL_TIMEOUT";
  }
  if (
    message.includes("invalid json") ||
    message.includes("model returned invalid") ||
    message.includes("malformed json") ||
    message.includes("unexpected token")
  ) {
    return "INVALID_MODEL_JSON";
  }

  return fallbackCode;
}

export function failureHintForCode(code: FailureCode): string {
  switch (code) {
    case "INVALID_MODEL_JSON":
      return "Model response format was invalid. Retry should regenerate a valid payload.";
    case "MODEL_TIMEOUT":
      return "Model request timed out. Retry in a moment.";
    case "API_KEY_MISSING":
      return "AI provider key is missing in server environment.";
    case "CONTENT_PACKAGE_CHAIN_FAILED":
      return "Supplementary content-package step failed. Core generation may still work on retry.";
    case "RETRY_FAILED":
      return "Retry attempt failed. Review prompt inputs and run retry again.";
    case "REGENERATE_CALL_FAILED":
      return "Single-item regeneration call failed. Try regenerating the item again.";
    case "GENERATION_FAILED":
    default:
      return "Generation failed due to an internal processing issue. Retry is recommended.";
  }
}

export function safeClientError(err: unknown, fallback = "Generation failed. Please retry."): string {
  if (err instanceof HttpError) return err.message;
  return fallback;
}
