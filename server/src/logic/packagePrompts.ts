import type { SubmissionSnapshot } from "./constants.js";
import { buildClientContextBlock } from "./promptComposer.js";
import { PACKAGE_EXPECTED_HOOKS, PACKAGE_HOOKS_PER_IDEA, PACKAGE_IDEA_COUNT } from "./packageConstants.js";

export function buildIdeasStepPrompt(snapshot: SubmissionSnapshot): string {
  return [
    "You are a social content strategist.",
    `Generate exactly ${PACKAGE_IDEA_COUNT} distinct short-form content ideas for the brand below.`,
    "Return JSON with root key `ideas`: array of objects with integer `id`, string `title`, and string `description`.",
    `CRITICAL: use ids 1 through ${PACKAGE_IDEA_COUNT} exactly once each (one idea per id).`,
    "Titles and descriptions must be non-empty and specific to the brief.",
    "",
    "Client context:",
    buildClientContextBlock(snapshot),
  ].join("\n");
}

export function buildScriptsStepPrompt(snapshot: SubmissionSnapshot, ideasPayloadJson: string): string {
  return [
    "You are a video creative director.",
    "Given the ideas JSON below, produce exactly one short-form video script per idea.",
    `Return JSON with root key \`scripts\`: exactly ${PACKAGE_IDEA_COUNT} objects with integer \`idea_id\`, string \`visuals\` (shot direction), and string \`voiceover\` (spoken script).`,
    `Each idea id from the input must appear exactly once as idea_id.`,
    "",
    "Client context:",
    buildClientContextBlock(snapshot),
    "",
    "Ideas (source of truth — do not invent new ids):",
    ideasPayloadJson,
  ].join("\n");
}

export function buildHooksStepPrompt(snapshot: SubmissionSnapshot, ideasPayloadJson: string): string {
  return [
    "You are a hook copywriter for short-form social video.",
    `Given the ideas JSON below, write exactly ${PACKAGE_HOOKS_PER_IDEA} hook lines per idea (${PACKAGE_EXPECTED_HOOKS} hooks total).`,
    "Return JSON with root key `hooks`: array of objects with integer `idea_id`, integer `variant_index` (1, 2, or 3 only), and string `hook_text`.",
    `For each idea_id, variant_index must be 1, 2, and 3 with no duplicates.`,
    "",
    "Client context:",
    buildClientContextBlock(snapshot),
    "",
    "Ideas (source of truth):",
    ideasPayloadJson,
  ].join("\n");
}

export function buildTemplatesStepPrompt(snapshot: SubmissionSnapshot, ideasPayloadJson: string): string {
  return [
    "You are a content systems designer.",
    `Given the ideas JSON below, produce exactly ${PACKAGE_IDEA_COUNT} reusable template descriptions (one per idea).`,
    "Return JSON with root key `templates`: array of objects with integer `idea_id` and string `template_format` (e.g. carousel slide outline, reel beat sheet, story sequence).",
    "Each idea_id from the input must appear exactly once.",
    "",
    "Client context:",
    buildClientContextBlock(snapshot),
    "",
    "Ideas (source of truth):",
    ideasPayloadJson,
  ].join("\n");
}
