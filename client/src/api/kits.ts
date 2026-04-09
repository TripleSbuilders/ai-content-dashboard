import type { BriefForm, KitSummary } from "../types";
import { apiUrl, ApiError, buildHeaders, parseErrorMessage } from "./httpClient";

export async function generateKit(brief: BriefForm, idempotencyKey: string): Promise<KitSummary> {
  const res = await fetch(apiUrl("/api/kits/generate"), {
    method: "POST",
    headers: buildHeaders({ "Idempotency-Key": idempotencyKey }),
    body: JSON.stringify({ ...brief, submitted_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, res.statusText));
  return res.json() as Promise<KitSummary>;
}

export async function listKits(): Promise<KitSummary[]> {
  const res = await fetch(apiUrl("/api/kits"), { headers: buildHeaders() });
  if (!res.ok) throw new Error("Failed to list kits");
  return res.json() as Promise<KitSummary[]>;
}

export async function getKit(id: string): Promise<KitSummary> {
  const res = await fetch(apiUrl(`/api/kits/${id}`), { headers: buildHeaders() });
  if (!res.ok) throw new Error("Not found");
  return res.json() as Promise<KitSummary>;
}

export async function retryKit(id: string, briefJson: string, rowVersion: number): Promise<KitSummary> {
  const res = await fetch(apiUrl(`/api/kits/${id}/retry`), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ brief_json: briefJson, row_version: rowVersion }),
  });
  if (!res.ok) throw new ApiError(await parseErrorMessage(res, res.statusText), res.status);
  return res.json() as Promise<KitSummary>;
}

export async function regenerateKitItem(
  id: string,
  item_type: "post" | "image" | "video",
  index: number,
  row_version: number,
  feedback?: string
): Promise<KitSummary> {
  const res = await fetch(apiUrl(`/api/kits/${id}/regenerate-item`), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ item_type, index, row_version, feedback }),
  });
  if (!res.ok) throw new ApiError(await parseErrorMessage(res, res.statusText), res.status);
  return res.json() as Promise<KitSummary>;
}
