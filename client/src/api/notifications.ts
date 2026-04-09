import { apiUrl, buildHeaders } from "./httpClient";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  kind: string;
  kit_id: string | null;
  read: boolean;
  created_at: string;
};

export async function listNotifications(): Promise<{ items: NotificationItem[] }> {
  const res = await fetch(apiUrl("/api/notifications"), { headers: buildHeaders() });
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json() as Promise<{ items: NotificationItem[] }>;
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await fetch(apiUrl("/api/notifications/read-all"), { method: "PATCH", headers: buildHeaders() });
  if (!res.ok) throw new Error("Failed to mark notifications read");
}
