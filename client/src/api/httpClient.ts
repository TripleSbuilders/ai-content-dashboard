import { getDeviceId } from "../lib/deviceId";
import { getAccessToken } from "../lib/authToken";

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const base = import.meta.env.VITE_API_URL ?? "";
const apiSecret = String(import.meta.env.VITE_API_SECRET ?? "").trim();

export function buildHeaders(extra?: Record<string, string>): HeadersInit {
  const token = getAccessToken();
  const authorization = token || apiSecret ? `Bearer ${token || apiSecret}` : undefined;
  return {
    "Content-Type": "application/json",
    "X-Device-ID": getDeviceId(),
    ...(authorization ? { Authorization: authorization } : {}),
    ...extra,
  };
}

export function apiUrl(path: string) {
  return `${base}${path}`;
}

export async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  const j = await res.json().catch(() => ({}));
  return (j as { error?: string }).error ?? fallback;
}
