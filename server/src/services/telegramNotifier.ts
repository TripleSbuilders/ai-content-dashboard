import type { SubmissionSnapshot } from "../logic/constants.js";

export async function notifyTelegramNewLead(input: {
  snapshot: SubmissionSnapshot;
  kitId: string;
  correlationId: string;
}) {
  const webhookUrl = String(process.env.TELEGRAM_WEBHOOK_URL ?? "").trim();
  if (!webhookUrl) return;

  const adminBaseUrl = String(process.env.ADMIN_BASE_URL ?? "").trim();
  const adminLink = adminBaseUrl ? `${adminBaseUrl.replace(/\/$/, "")}/admin/kits/${input.kitId}` : "";
  const sourceLabel = input.snapshot.source_mode === "agency" ? "agency" : "self_serve";

  const lines = [
    "New content request received",
    `Source: ${sourceLabel}`,
    `Client: ${input.snapshot.client_name || "-"}`,
    `Phone: ${input.snapshot.client_phone || "-"}`,
    `Email: ${input.snapshot.client_email || input.snapshot.email || "-"}`,
    `Brand: ${input.snapshot.brand_name || "-"}`,
    `Mode: ${input.snapshot.campaign_mode || "-"}`,
    `Kit ID: ${input.kitId}`,
    `Correlation: ${input.correlationId}`,
    adminLink ? `Admin: ${adminLink}` : "",
  ].filter(Boolean);

  const payload = { text: lines.join("\n") };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const body = await response.text();
      console.warn("[telegram_notify_failed]", JSON.stringify({ status: response.status, body }));
    }
  } catch (error) {
    console.warn("[telegram_notify_error]", String(error));
  }
}
