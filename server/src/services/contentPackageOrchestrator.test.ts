import { describe, expect, it } from "vitest";
import { buildSubmissionSnapshot } from "../logic/parse.js";
import { runContentPackageChain } from "./contentPackageOrchestrator.js";

const settings = { apiKey: "x", model: "m", timeoutMs: 60_000, maxRetries: 0 };

function ideasPayload() {
  return {
    ideas: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Title ${i + 1}`,
      description: `Desc ${i + 1}`,
    })),
  };
}

function scriptsPayload(ideaList: { id: number }[]) {
  return {
    scripts: ideaList.map((idea) => ({
      idea_id: idea.id,
      visuals: `v${idea.id}`,
      voiceover: `vo${idea.id}`,
    })),
  };
}

function hooksPayload(ideaList: { id: number }[]) {
  const hooks = ideaList.flatMap((idea) =>
    [1, 2, 3].map((variant_index) => ({
      idea_id: idea.id,
      variant_index,
      hook_text: `h${idea.id}-${variant_index}`,
    }))
  );
  return { hooks };
}

function templatesPayload(ideaList: { id: number }[]) {
  return {
    templates: ideaList.map((idea) => ({
      idea_id: idea.id,
      template_format: `tf${idea.id}`,
    })),
  };
}

function routingMock(ideas = ideasPayload()) {
  return async (prompt: string) => {
    if (prompt.includes("Generate exactly 10 distinct")) return ideas;
    if (prompt.includes("You are a video creative director.")) return scriptsPayload(ideas.ideas);
    if (prompt.includes("You are a hook copywriter")) return hooksPayload(ideas.ideas);
    if (prompt.includes("You are a content systems designer.")) return templatesPayload(ideas.ideas);
    throw new Error("unexpected prompt fragment");
  };
}

describe("contentPackageOrchestrator", () => {
  it("runs step1 then parallel step2 and returns merged package", async () => {
    const snapshot = buildSubmissionSnapshot({ brand_name: "Acme", industry: "SaaS" });
    const out = await runContentPackageChain(snapshot, settings, undefined, {
      callAPI: routingMock(),
    });
    expect(out.ideas).toHaveLength(10);
    expect(out.scripts).toHaveLength(10);
    expect(out.hooks).toHaveLength(30);
    expect(out.templates).toHaveLength(10);
    expect(out.ideas[0]?.id).toBe(1);
  });

  it("fails coherence when hooks omit a variant_index for an idea", async () => {
    const ideas = ideasPayload();
    const badHooks = {
      hooks: ideas.ideas.flatMap((idea) => {
        if (idea.id === 1) {
          return [
            { idea_id: 1, variant_index: 1, hook_text: "a" },
            { idea_id: 1, variant_index: 2, hook_text: "b" },
            { idea_id: 1, variant_index: 2, hook_text: "c" },
          ];
        }
        return [1, 2, 3].map((variant_index) => ({
          idea_id: idea.id,
          variant_index,
          hook_text: `h${idea.id}-${variant_index}`,
        }));
      }),
    };
    const callAPI = async (prompt: string) => {
      if (prompt.includes("Generate exactly 10 distinct")) return ideas;
      if (prompt.includes("You are a video creative director.")) return scriptsPayload(ideas.ideas);
      if (prompt.includes("You are a hook copywriter")) return badHooks;
      if (prompt.includes("You are a content systems designer.")) return templatesPayload(ideas.ideas);
      throw new Error("unexpected");
    };
    await expect(
      runContentPackageChain(buildSubmissionSnapshot({}), settings, undefined, { callAPI })
    ).rejects.toThrow(/content_package_chain coherence failed/);
  });
});
