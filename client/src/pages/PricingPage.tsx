import { useEffect, useMemo, useState } from "react";
import LoginModal from "../components/LoginModal";
import { useAuth } from "../auth/AuthContext";

type PlanId = "free" | "creator_pro" | "agency";

const WHATSAPP_BASE = "https://wa.me/";
const DEFAULT_PHONE = "";

function planToLabel(plan: PlanId) {
  if (plan === "creator_pro") return "Creator Pro";
  if (plan === "agency") return "Agency";
  return "Free Trial";
}

function buildUpgradeUrl(plan: PlanId): string {
  const direct = String(import.meta.env.VITE_UPGRADE_WHATSAPP_URL ?? "").trim();
  if (direct) return direct;

  const phone = String(import.meta.env.VITE_UPGRADE_WHATSAPP_PHONE ?? DEFAULT_PHONE).trim();
  if (!phone) return "";

  const message = encodeURIComponent(
    `Hi, I want to upgrade to ${planToLabel(plan)} plan in Social Geni.`
  );
  return `${WHATSAPP_BASE}${phone}?text=${message}`;
}

function FeatureItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
      <span className="material-symbols-outlined text-[18px] text-gray-900 dark:text-white mt-0.5">check_circle</span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

export default function PricingPage() {
  const { session, signInWithGoogle, entitlements } = useAuth();
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const currentPlan = entitlements?.plan_code ?? "free";

  useEffect(() => {
    if (!session || !pendingPlan) return;
    const url = buildUpgradeUrl(pendingPlan);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    setLoginModalOpen(false);
    setPendingPlan(null);
  }, [session, pendingPlan]);

  const planCards = useMemo(
    () => [
      {
        id: "free" as const,
        title: "Free Trial",
        price: "$0",
        subtitle: "Start and feel the product",
        highlight: false,
        features: [
          "2 kits / month",
          "Social campaign only",
          "No reference image upload",
          "Device-based history",
        ],
      },
      {
        id: "creator_pro" as const,
        title: "Creator Pro",
        price: "$15",
        subtitle: "Best for creators and founders",
        highlight: true,
        features: [
          "30 kits / month",
          "Social + Offer + Deep modes",
          "Reference image enabled",
          "Full account history",
        ],
      },
      {
        id: "agency" as const,
        title: "Agency",
        price: "$39",
        subtitle: "For managers and teams",
        highlight: false,
        features: [
          "150 kits / month",
          "All Creator Pro features",
          "Retry/Regenerate practically unlimited",
          "Built for heavy production workflows",
        ],
      },
    ],
    []
  );

  const onUpgradeClick = (plan: PlanId) => {
    if (plan === "free") return;
    const url = buildUpgradeUrl(plan);
    if (!url) return;
    setPendingPlan(plan);
    if (!session) {
      setLoginModalOpen(true);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const onLogin = async () => {
    setLoginLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <section className="space-y-12">
      <header className="text-center max-w-3xl mx-auto py-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Choose the plan that fits your growth
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Start free, then upgrade when you are ready. Server-side gatekeeping is active for all plan limits.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Current plan:</span>
          <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 py-1 px-3 text-xs font-semibold uppercase tracking-widest text-gray-900 dark:text-white shadow-sm">
            {currentPlan}
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3 items-start max-w-6xl mx-auto">
        {planCards.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isMissingUrl = !buildUpgradeUrl(plan.id) && plan.id !== "free";
          const ctaLabel =
            plan.id === "free"
              ? "Start Free"
              : isCurrent
                ? "Current Plan"
                : plan.id === "creator_pro"
                  ? "Upgrade to Creator Pro"
                  : "Upgrade to Agency";
          const isDisabled = plan.id === "free" || isCurrent || isMissingUrl;
          
          return (
            <article
              key={plan.id}
              className={[
                "relative flex flex-col rounded-3xl p-8 bg-white dark:bg-[#111] shadow-xl transition-transform hover:-translate-y-1",
                plan.highlight
                  ? "border border-indigo-500/20 dark:border-indigo-500/30 ring-1 ring-inset ring-indigo-500/10 dark:ring-indigo-500/20 shadow-indigo-500/5 lg:-mt-4 lg:mb-4 lg:scale-105"
                  : "border border-gray-200 dark:border-white/10",
              ].join(" ")}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Recommended
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.title}</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{plan.subtitle}</p>
              </div>

              <div className="mb-8 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">/month</span>
              </div>

              <ul className="mb-10 space-y-4 flex-1">
                {plan.features.map((f) => (
                  <FeatureItem key={f}>{f}</FeatureItem>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onUpgradeClick(plan.id)}
                disabled={isDisabled}
                className={[
                  "w-full rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all focus-visible:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#111]",
                  plan.highlight && !isDisabled
                    ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 focus:ring-gray-900 dark:focus:ring-white"
                    : isDisabled
                    ? "bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-600 cursor-not-allowed"
                    : "bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 focus:ring-gray-200 dark:focus:ring-white/20"
                ].join(" ")}
              >
                {ctaLabel}
              </button>
              
              {isMissingUrl && (
                <div className="mt-3 text-center">
                  <p className="text-[10px] text-red-500 dark:text-red-400 opacity-80">
                    Upgrade link not configured. Check env vars.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] p-5 text-center text-sm text-gray-500 dark:text-gray-400 shadow-sm backdrop-blur-sm">
        Activation is currently handled securely by support via WhatsApp until direct checkout is deployed.
      </div>

      <LoginModal
        open={loginModalOpen}
        loading={loginLoading}
        onClose={() => setLoginModalOpen(false)}
        onLogin={onLogin}
        title="Sign in to upgrade"
        description="Securely link your account before proceeding to checkout."
        footer={
          pendingPlan ? (
            <span className="font-medium">
              Target plan: <strong className="text-gray-900 dark:text-white ml-1">{planToLabel(pendingPlan)}</strong>
            </span>
          ) : null
        }
      />
    </section>
  );
}
