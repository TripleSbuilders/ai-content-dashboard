import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listMyKits } from "./api";
import { logger } from "./logger";
import type { KitSummary } from "./types";
import { useToast } from "./useToast";

function readBrandName(briefJson: string): string {
  try {
    const parsed = JSON.parse(briefJson) as { brand_name?: unknown };
    return typeof parsed.brand_name === "string" ? parsed.brand_name.trim() : "";
  } catch {
    return "";
  }
}

export default function Dashboard() {
  const [kits, setKits] = useState<KitSummary[] | null>(null);
  const { toasts, push } = useToast();

  useEffect(() => {
    listMyKits()
      .then(setKits)
      .catch((error) => {
        logger.error(error);
        push("Could not load your activity yet", "error");
      });
  }, [push]);

  const summary = useMemo(() => {
    if (!kits?.length) {
      return {
        totalRequests: 0,
        savedBrands: 0,
        lastActivityLabel: "No requests yet",
        topBrands: [] as string[],
      };
    }

    const uniqueBrands = new Set<string>();
    const topBrands: string[] = [];
    for (const kit of kits) {
      const brand = readBrandName(kit.brief_json);
      const normalized = brand.toLowerCase();
      if (!normalized || uniqueBrands.has(normalized)) continue;
      uniqueBrands.add(normalized);
      topBrands.push(brand);
      if (topBrands.length >= 3) break;
    }

    const newestCreatedAt = kits[0]?.created_at ? new Date(kits[0].created_at) : null;
    return {
      totalRequests: kits.length,
      savedBrands: uniqueBrands.size,
      lastActivityLabel: newestCreatedAt ? newestCreatedAt.toLocaleDateString() : "No recent date",
      topBrands,
    };
  }, [kits]);

  return (
    <>
      <div className="toast-host fixed bottom-4 end-4 z-[100] flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-xl dark:border-white/10 dark:bg-[#111] dark:text-gray-100"
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>

      <section className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Welcome</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Your Content Portal</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Request your content once, and our team handles strategy, production, and delivery for you.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-black/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">1) Request Content</p>
            <p className="mt-1 text-sm font-medium">Fill a short brief with your brand details.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-black/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">2) We Craft It</p>
            <p className="mt-1 text-sm font-medium">Our team prepares your tailored package.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-black/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">3) Delivered via WhatsApp</p>
            <p className="mt-1 text-sm font-medium">Receive final deliverables quickly and ready.</p>
          </div>
        </div>
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-black/30">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Requests</p>
          <p className="mt-2 text-3xl font-bold">{summary.totalRequests}</p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-black/30">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Saved Brands</p>
          <p className="mt-2 text-3xl font-bold">{summary.savedBrands}</p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-black/30">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Last Activity</p>
          <p className="mt-2 text-lg font-semibold">{summary.lastActivityLabel}</p>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Start a new request now, or continue from your saved brands.
            </p>
            {summary.topBrands.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {summary.topBrands.map((brand) => (
                  <span
                    key={brand}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs dark:border-white/10 dark:bg-white/5"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/wizard/social"
              className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
            >
              Request Content
            </Link>
            <Link
              to="/my-brands"
              className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold dark:border-white/10"
            >
              Open My Brands
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
