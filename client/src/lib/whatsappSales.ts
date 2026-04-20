const WHATSAPP_BASE = "https://wa.me/";

const DEFAULT_MESSAGE =
  "أهلاً، مهتم بالاشتراك في الباقة المدفوعة لمنصة Social Geni وأريد إتمام الدفع (فودافون كاش / انستاباي).";

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export function getWhatsAppSalesNumber(): string {
  return normalizePhone(String(import.meta.env.VITE_WHATSAPP_SALES_NUMBER ?? "").trim());
}

export function getWhatsAppSalesUrl(message = DEFAULT_MESSAGE): string {
  const phone = getWhatsAppSalesNumber();
  if (!phone) return "";
  return `${WHATSAPP_BASE}${phone}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppSales(message?: string): boolean {
  const url = getWhatsAppSalesUrl(message);
  if (!url) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

export const WHATSAPP_SALES_DEFAULT_MESSAGE = DEFAULT_MESSAGE;
