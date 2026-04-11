import { describe, expect, it } from "vitest";
import { PACKAGE_HOOKS_PER_IDEA, PACKAGE_IDEA_COUNT } from "./packageConstants.js";
import { validatePackageCoherence } from "./packageValidate.js";

const ideas = Array.from({ length: PACKAGE_IDEA_COUNT }, (_, i) => ({
  id: i + 1,
  title: `t${i}`,
  description: `d${i}`,
}));

const goodScripts = ideas.map((idea) => ({
  idea_id: idea.id,
  visuals: "v",
  voiceover: "vo",
}));

const goodHooks = ideas.flatMap((idea) =>
  Array.from({ length: PACKAGE_HOOKS_PER_IDEA }, (_, j) => ({
    idea_id: idea.id,
    variant_index: j + 1,
    hook_text: "h",
  }))
);

const goodTemplates = ideas.map((idea) => ({
  idea_id: idea.id,
  template_format: "fmt",
}));

describe("validatePackageCoherence", () => {
  it("accepts a consistent package", () => {
    expect(validatePackageCoherence(ideas, goodScripts, goodHooks, goodTemplates)).toEqual([]);
  });

  it("rejects duplicate script idea_id", () => {
    const scripts = [...goodScripts];
    scripts[1] = { ...scripts[1]!, idea_id: 1 };
    const errs = validatePackageCoherence(ideas, scripts, goodHooks, goodTemplates);
    expect(errs.some((e) => e.includes("scripts"))).toBe(true);
  });
});
