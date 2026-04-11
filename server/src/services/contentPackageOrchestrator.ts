import type { SubmissionSnapshot } from "../logic/constants.js";
import type { GeminiReferenceImage, GeminiSettings } from "../logic/geminiClient.js";
import {
  buildHooksStepPrompt,
  buildIdeasStepPrompt,
  buildScriptsStepPrompt,
  buildTemplatesStepPrompt,
} from "../logic/packagePrompts.js";
import {
  getHooksStepSchema,
  getIdeasStepSchema,
  getScriptsStepSchema,
  getTemplatesStepSchema,
} from "../logic/packageResponseSchema.js";
import {
  type ContentHook,
  type ContentIdea,
  type ContentIdeasPackage,
  type ContentTemplate,
  type ContentVideoScript,
  validateHooksStep,
  validateIdeasStep,
  validatePackageCoherence,
  validateScriptsStep,
  validateTemplatesStep,
} from "../logic/packageValidate.js";
import { type AIGenerationDependencies, generateJsonStepWithGuardrails } from "./aiGenerationProvider.js";

function asIdeasData(raw: unknown) {
  const r = validateIdeasStep(raw);
  if (!r.ok) return r;
  return { ok: true as const, data: r.data.ideas };
}

function asScriptsData(raw: unknown) {
  const r = validateScriptsStep(raw);
  if (!r.ok) return r;
  return { ok: true as const, data: r.data.scripts };
}

function asHooksData(raw: unknown) {
  const r = validateHooksStep(raw);
  if (!r.ok) return r;
  return { ok: true as const, data: r.data.hooks };
}

function asTemplatesData(raw: unknown) {
  const r = validateTemplatesStep(raw);
  if (!r.ok) return r;
  return { ok: true as const, data: r.data.templates };
}

export async function runContentPackageChain(
  snapshot: SubmissionSnapshot,
  settings: GeminiSettings,
  referenceImage?: GeminiReferenceImage,
  deps?: AIGenerationDependencies
): Promise<ContentIdeasPackage> {
  const ideasPrompt = buildIdeasStepPrompt(snapshot);
  const ideas: ContentIdea[] = await generateJsonStepWithGuardrails(
    ideasPrompt,
    settings,
    getIdeasStepSchema(),
    asIdeasData,
    referenceImage,
    deps
  );

  const ideasPayloadJson = JSON.stringify({ ideas }, null, 2);

  const scriptsPrompt = buildScriptsStepPrompt(snapshot, ideasPayloadJson);
  const hooksPrompt = buildHooksStepPrompt(snapshot, ideasPayloadJson);
  const templatesPrompt = buildTemplatesStepPrompt(snapshot, ideasPayloadJson);

  let scripts: ContentVideoScript[];
  let hooks: ContentHook[];
  let templates: ContentTemplate[];
  try {
    [scripts, hooks, templates] = await Promise.all([
      generateJsonStepWithGuardrails(
        scriptsPrompt,
        settings,
        getScriptsStepSchema(),
        asScriptsData,
        referenceImage,
        deps
      ),
      generateJsonStepWithGuardrails(
        hooksPrompt,
        settings,
        getHooksStepSchema(),
        asHooksData,
        referenceImage,
        deps
      ),
      generateJsonStepWithGuardrails(
        templatesPrompt,
        settings,
        getTemplatesStepSchema(),
        asTemplatesData,
        referenceImage,
        deps
      ),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`content_package_chain phase2 failed: ${msg}`);
  }

  const coherence = validatePackageCoherence(ideas, scripts, hooks, templates);
  if (coherence.length) {
    throw new Error(`content_package_chain coherence failed: ${coherence.join(" | ")}`);
  }

  return { ideas, scripts, hooks, templates };
}
