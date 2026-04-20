import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyKits } from "../api";
import { BRIEF_LIMITS, initialBriefForm } from "../briefSchema";
import { logger } from "../logger";
import type { BriefForm, KitSummary } from "../types";

const SOCIAL_WIZARD_DRAFT_KEY = "ai-content-dashboard:wizard-draft:social:v1";

type BrandCard = {
  id: string;
  brandName: string;
  tone: string;
  targetAudience: string[];
  industry: string;
  platforms: string[];
  updatedAt: string;
  sourceBrief: BriefForm;
};

function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,،]/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseBrief(briefJson: string): BriefForm | null {
  try {
    const parsed = JSON.parse(briefJson) as Record<string, unknown>;
    const base = initialBriefForm();

    const brief: BriefForm = {
      ...base,
      source_mode: parsed.source_mode === "agency" ? "agency" : base.source_mode,
      brand_name: typeof parsed.brand_name === "string" ? parsed.brand_name.trim() : "",
      industry: typeof parsed.industry === "string" ? parsed.industry.trim() : "",
      business_links: typeof parsed.business_links === "string" ? parsed.business_links : "",
      target_audience: ensureStringArray(parsed.target_audience),
      main_goal: typeof parsed.main_goal === "string" ? parsed.main_goal : "",
      platforms: ensureStringArray(parsed.platforms),
      brand_tone: typeof parsed.brand_tone === "string" ? parsed.brand_tone : "",
      brand_colors: typeof parsed.brand_colors === "string" ? parsed.brand_colors : "",
      offer: typeof parsed.offer === "string" ? parsed.offer : "",
      competitors: typeof parsed.competitors === "string" ? parsed.competitors : "",
      visual_notes: typeof parsed.visual_notes === "string" ? parsed.visual_notes : "",
      reference_image: typeof parsed.reference_image === "string" ? parsed.reference_image : "",
      campaign_duration: typeof parsed.campaign_duration === "string" ? parsed.campaign_duration : "",
      budget_level: typeof parsed.budget_level === "string" ? parsed.budget_level : "",
      best_content_types: ensureStringArray(parsed.best_content_types),
      diagnostic_role: typeof parsed.diagnostic_role === "string" ? parsed.diagnostic_role : "",
      diagnostic_account_stage: typeof parsed.diagnostic_account_stage === "string" ? parsed.diagnostic_account_stage : "",
      diagnostic_followers_band:
        typeof parsed.diagnostic_followers_band === "string" ? parsed.diagnostic_followers_band : "",
      diagnostic_primary_blocker:
        typeof parsed.diagnostic_primary_blocker === "string" ? parsed.diagnostic_primary_blocker : "",
      diagnostic_revenue_goal: typeof parsed.diagnostic_revenue_goal === "string" ? parsed.diagnostic_revenue_goal : "",
      campaign_mode: "social",
      num_posts:
        typeof parsed.num_posts === "number"
          ? Math.max(BRIEF_LIMITS.num_posts.min, Math.min(BRIEF_LIMITS.num_posts.max, parsed.num_posts))
          : base.num_posts,
      num_image_designs:
        typeof parsed.num_image_designs === "number"
          ? Math.max(BRIEF_LIMITS.num_image_designs.min, Math.min(BRIEF_LIMITS.num_image_designs.max, parsed.num_image_designs))
          : base.num_image_designs,
      num_video_prompts:
        typeof parsed.num_video_prompts === "number"
          ? Math.max(BRIEF_LIMITS.num_video_prompts.min, Math.min(BRIEF_LIMITS.num_video_prompts.max, parsed.num_video_prompts))
          : base.num_video_prompts,
      include_content_package: typeof parsed.include_content_package === "boolean" ? parsed.include_content_package : false,
      content_package_idea_count:
        typeof parsed.content_package_idea_count === "number"
          ? Math.max(
              BRIEF_LIMITS.content_package_idea_count.min,
              Math.min(BRIEF_LIMITS.content_package_idea_count.max, parsed.content_package_idea_count)
            )
          : base.content_package_idea_count,
      client_name: typeof parsed.client_name === "string" ? parsed.client_name : "",
      client_phone: typeof parsed.client_phone === "string" ? parsed.client_phone : "",
      client_email: typeof parsed.client_email === "string" ? parsed.client_email : "",
    };

    return brief;
  } catch {
    return null;
  }
}

function toBrandCards(kits: KitSummary[]): BrandCard[] {
  const byBrand = new Map<string, BrandCard>();

  for (const kit of kits) {
    const brief = parseBrief(kit.brief_json);
    if (!brief) continue;
    const brandName = brief.brand_name.trim();
    if (!brandName) continue;
    const key = brandName.toLowerCase();
    const current = byBrand.get(key);

    const card: BrandCard = {
      id: key,
      brandName,
      tone: brief.brand_tone || "Not specified",
      targetAudience: brief.target_audience,
      industry: brief.industry,
      platforms: brief.platforms,
      updatedAt: kit.updated_at,
      sourceBrief: brief,
    };

    if (!current || new Date(card.updatedAt).getTime() > new Date(current.updatedAt).getTime()) {
      byBrand.set(key, card);
    }
  }

  return Array.from(byBrand.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export default function MyBrandsPage() {
  const navigate = useNavigate();
  const [kits, setKits] = useState<KitSummary[] | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    listMyKits()
      .then((data) => {
        setError("");
        setKits(data);
      })
      .catch((loadError) => {
        logger.error(loadError);
        setError("Couldn't load your saved brands right now.");
        setKits([]);
      });
  }, []);

  const brands = useMemo(() => toBrandCards(kits ?? []), [kits]);

  const handleCreateAgain = (brand: BrandCard) => {
    try {
      localStorage.setItem(
        SOCIAL_WIZARD_DRAFT_KEY,
        JSON.stringify({
          step: 0,
          form: {
            ...initialBriefForm(),
            ...brand.sourceBrief,
            campaign_mode: "social",
          },
        })
      );
    } catch (error) {
      logger.error(error);
    }
    navigate("/wizard/social");
  };

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Brands | علاماتي التجارية</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Reuse your saved brand setup and start a new request in one click.
        </p>
      </header>

      {kits === null ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-black/30 dark:text-gray-400">
          Loading your brands...
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {kits !== null && brands.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-black/30">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No saved brands yet. Submit your first request and your brand profile will appear here.
          </p>
        </div>
      ) : null}

      {brands.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => (
            <article
              key={brand.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black/30"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Brand</p>
              <h2 className="mt-1 text-lg font-semibold">{brand.brandName}</h2>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="text-gray-500 dark:text-gray-400">Tone:</span> {brand.tone}
                </p>
                <p>
                  <span className="text-gray-500 dark:text-gray-400">Target Audience:</span>{" "}
                  {brand.targetAudience.length ? brand.targetAudience.join(", ") : "Not specified"}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {brand.platforms.slice(0, 3).map((platform) => (
                  <span
                    key={`${brand.id}-${platform}`}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs dark:border-white/10 dark:bg-white/5"
                  >
                    {platform}
                  </span>
                ))}
                {brand.industry ? (
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
                    {brand.industry}
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => handleCreateAgain(brand)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
              >
                Create Again | طلب محتوى جديد لهذا البراند
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
