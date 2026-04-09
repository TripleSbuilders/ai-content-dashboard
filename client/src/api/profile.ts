import { apiUrl, buildHeaders } from "./httpClient";

export type StudioProfile = { display_name: string; email: string; updated_at: string };
export type StudioPreferences = { compact_table: boolean; updated_at: string };
export type BrandVoicePillar = { title: string; body: string };
export type BrandVoicePayload = {
  pillars: BrandVoicePillar[];
  avoid_words: string[];
  sample_snippet: string;
  updated_at: string;
};

export async function getProfile(): Promise<StudioProfile> {
  const res = await fetch(apiUrl("/api/profile"), { headers: buildHeaders() });
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json() as Promise<StudioProfile>;
}

export async function updateProfile(partial: { display_name?: string; email?: string }): Promise<StudioProfile> {
  const res = await fetch(apiUrl("/api/profile"), {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(partial),
  });
  if (!res.ok) throw new Error("Failed to save profile");
  return res.json() as Promise<StudioProfile>;
}

export async function getPreferences(): Promise<StudioPreferences> {
  const res = await fetch(apiUrl("/api/preferences"), { headers: buildHeaders() });
  if (!res.ok) throw new Error("Failed to load preferences");
  return res.json() as Promise<StudioPreferences>;
}

export async function updatePreferences(compact_table: boolean): Promise<StudioPreferences> {
  const res = await fetch(apiUrl("/api/preferences"), {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify({ compact_table }),
  });
  if (!res.ok) throw new Error("Failed to save preferences");
  return res.json() as Promise<StudioPreferences>;
}

export async function getBrandVoice(): Promise<BrandVoicePayload> {
  const res = await fetch(apiUrl("/api/brand-voice"), { headers: buildHeaders() });
  if (!res.ok) throw new Error("Failed to load brand voice");
  return res.json() as Promise<BrandVoicePayload>;
}

export async function updateBrandVoice(payload: {
  pillars: BrandVoicePillar[];
  avoid_words: string[];
  sample_snippet: string;
}): Promise<BrandVoicePayload> {
  const res = await fetch(apiUrl("/api/brand-voice"), {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save brand voice");
  return res.json() as Promise<BrandVoicePayload>;
}
