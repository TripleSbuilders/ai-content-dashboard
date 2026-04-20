import { describe, expect, it } from "vitest";
import { buildKitViewModel, groupPostsByPlatformAndDay } from "./kitViewModel";
import type { KitSummary } from "../../types";

function makeKit(result_json: unknown): KitSummary {
  return {
    id: "k1",
    brief_json: "{}",
    result_json,
    delivery_status: "ok",
    status_badge: "done",
    badge_palette: { bg: "#000", fg: "#fff", border: "#111" },
    model_used: "test",
    last_error: "",
    correlation_id: "c1",
    row_version: 1,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}

describe("buildKitViewModel strategy metadata", () => {
  it("maps strategy metadata for posts/images/videos", () => {
    const vm = buildKitViewModel(
      makeKit({
        localization_check_passed: true,
        posts: [
          {
            platform: "instagram",
            strategic_rationale: {
              trigger_used: "urgency",
              contrast_note: "before/after",
              engagement_vector: "saves",
            },
            algorithmic_advantage: "Boosts save intent and completion.",
          },
        ],
        image_designs: [
          {
            strategic_rationale: {
              trigger_used: "curiosity",
              contrast_note: "problem/solution",
              engagement_vector: "shares",
            },
            algorithmic_advantage: "Improves shares via high-contrast framing.",
          },
        ],
        video_prompts: [
          {
            strategic_rationale: {
              trigger_used: "social proof",
              contrast_note: "proof stack",
              engagement_vector: "watch time",
            },
            algorithmic_advantage: "Optimized for retention and watch-through rate.",
          },
        ],
      })
    );

    expect(vm.localizationCheckPassed).toBe(true);
    expect(vm.postStrategy[0]?.algorithmic_advantage).toContain("save intent");
    expect(vm.imageStrategy[0]?.strategic_rationale?.engagement_vector).toBe("shares");
    expect(vm.videoStrategy[0]?.strategic_rationale?.trigger_used).toBe("social proof");
  });

  it("keeps legacy kits renderable without new fields", () => {
    const vm = buildKitViewModel(
      makeKit({
        posts: [{ platform: "instagram", post_ar: "a", post_en: "b", hashtags: [], cta: "x", format: "reel", goal: "reach" }],
        image_designs: [{ caption_ar: "x", caption_en: "y" }],
        video_prompts: [{ caption_ar: "x", caption_en: "y", scenes: [] }],
      })
    );

    expect(vm.localizationCheckPassed).toBeNull();
    expect(vm.postStrategy[0]?.algorithmic_advantage).toBe("");
    expect(vm.imageStrategy[0]?.strategic_rationale).toBeNull();
    expect(vm.videoStrategy[0]?.strategic_rationale).toBeNull();
    expect(vm.missingCriticalSections).toEqual([]);
  });
});

describe("groupPostsByPlatformAndDay", () => {
  it("groups posts by platform and assigns day sequence per platform", () => {
    const grouped = groupPostsByPlatformAndDay(
      [
        { platform: "instagram", post_ar: "a1" },
        { platform: "instagram", post_ar: "a2" },
        { platform: "facebook", post_ar: "b1" },
        { platform: "", post_ar: "u1" },
      ],
      [{ strategic_rationale: null, algorithmic_advantage: "s1" }, { strategic_rationale: null, algorithmic_advantage: "s2" }]
    );

    expect(grouped).toHaveLength(3);
    expect(grouped[0]?.platformLabel).toBe("instagram");
    expect(grouped[0]?.days.map((d) => d.dayLabel)).toEqual(["Day 1", "Day 2"]);
    expect(grouped[1]?.platformLabel).toBe("facebook");
    expect(grouped[1]?.days[0]?.globalIndex).toBe(2);
    expect(grouped[2]?.platformLabel).toBe("Unknown platform");
    expect(grouped[0]?.days[0]?.strategy?.algorithmic_advantage).toBe("s1");
    expect(grouped[0]?.days[1]?.strategy?.algorithmic_advantage).toBe("s2");
    expect(grouped[1]?.days[0]?.strategy).toBeNull();
  });
});

