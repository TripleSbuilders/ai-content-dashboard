import type { Context } from "hono";

const API_MAX_CONTENT_LENGTH_BYTES = Math.max(
  1024,
  Math.min(parseInt(process.env.API_MAX_CONTENT_LENGTH_BYTES ?? "262144", 10) || 262144, 5 * 1024 * 1024),
);

export function requestSizeLimit(maxBytes = API_MAX_CONTENT_LENGTH_BYTES) {
  return async function requestSizeLimitMiddleware(
    c: Context,
    next: () => Promise<Response | void>,
  ) {
    const contentLengthHeader = c.req.header("content-length");
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10);
      if (Number.isFinite(contentLength) && contentLength > maxBytes) {
        return c.json({ error: "Payload too large" }, 413);
      }
    }
    return await next();
  };
}

export const apiRequestSizeLimit = requestSizeLimit();

