import { z } from "zod";
import { isPlainObject } from "./parse.js";
import { PACKAGE_EXPECTED_HOOKS, PACKAGE_HOOKS_PER_IDEA, PACKAGE_IDEA_COUNT } from "./packageConstants.js";

const ideaSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1),
  description: z.string().min(1),
});

const ideasRootSchema = z.object({
  ideas: z.array(ideaSchema).length(PACKAGE_IDEA_COUNT),
});

const scriptSchema = z.object({
  idea_id: z.number().int(),
  visuals: z.string().min(1),
  voiceover: z.string().min(1),
});

const scriptsRootSchema = z.object({
  scripts: z.array(scriptSchema).length(PACKAGE_IDEA_COUNT),
});

const hookSchema = z.object({
  idea_id: z.number().int(),
  variant_index: z.number().int().min(1).max(PACKAGE_HOOKS_PER_IDEA),
  hook_text: z.string().min(1),
});

const hooksRootSchema = z.object({
  hooks: z.array(hookSchema).length(PACKAGE_EXPECTED_HOOKS),
});

const templateSchema = z.object({
  idea_id: z.number().int(),
  template_format: z.string().min(1),
});

const templatesRootSchema = z.object({
  templates: z.array(templateSchema).length(PACKAGE_IDEA_COUNT),
});

export type ContentIdea = z.infer<typeof ideaSchema>;
export type ContentVideoScript = z.infer<typeof scriptSchema>;
export type ContentHook = z.infer<typeof hookSchema>;
export type ContentTemplate = z.infer<typeof templateSchema>;

export type ContentIdeasPackage = {
  ideas: ContentIdea[];
  scripts: ContentVideoScript[];
  hooks: ContentHook[];
  templates: ContentTemplate[];
};

function zodErrors(err: z.ZodError): string[] {
  return err.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
}

export function validateIdeasStep(raw: unknown): { ok: true; data: z.infer<typeof ideasRootSchema> } | { ok: false; errors: string[] } {
  const parsed = ideasRootSchema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, errors: zodErrors(parsed.error) };
}

export function validateScriptsStep(raw: unknown): { ok: true; data: z.infer<typeof scriptsRootSchema> } | { ok: false; errors: string[] } {
  const parsed = scriptsRootSchema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, errors: zodErrors(parsed.error) };
}

export function validateHooksStep(raw: unknown): { ok: true; data: z.infer<typeof hooksRootSchema> } | { ok: false; errors: string[] } {
  const parsed = hooksRootSchema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, errors: zodErrors(parsed.error) };
}

export function validateTemplatesStep(raw: unknown): { ok: true; data: z.infer<typeof templatesRootSchema> } | { ok: false; errors: string[] } {
  const parsed = templatesRootSchema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, errors: zodErrors(parsed.error) };
}

/** Cross-step: scripts/hooks/templates must reference the same idea ids as `ideas`. */
export function validatePackageCoherence(
  ideas: ContentIdea[],
  scripts: ContentVideoScript[],
  hooks: ContentHook[],
  templates: ContentTemplate[]
): string[] {
  const errors: string[] = [];
  const expectedIds = new Set(ideas.map((i) => i.id));
  if (expectedIds.size !== PACKAGE_IDEA_COUNT) {
    errors.push(`ideas must have ${PACKAGE_IDEA_COUNT} distinct integer ids.`);
  }

  const scriptIds = scripts.map((s) => s.idea_id);
  if (scriptIds.length !== PACKAGE_IDEA_COUNT) {
    errors.push(`scripts length must be ${PACKAGE_IDEA_COUNT}.`);
  }
  for (const s of scripts) {
    if (!expectedIds.has(s.idea_id)) errors.push(`scripts: unknown idea_id ${s.idea_id}`);
  }
  const scriptIdSet = new Set(scriptIds);
  if (scriptIdSet.size !== PACKAGE_IDEA_COUNT) {
    errors.push("scripts: each idea_id must appear exactly once.");
  }

  for (const h of hooks) {
    if (!expectedIds.has(h.idea_id)) errors.push(`hooks: unknown idea_id ${h.idea_id}`);
  }
  for (const t of templates) {
    if (!expectedIds.has(t.idea_id)) errors.push(`templates: unknown idea_id ${t.idea_id}`);
  }
  const templateIds = templates.map((t) => t.idea_id);
  if (new Set(templateIds).size !== PACKAGE_IDEA_COUNT) {
    errors.push("templates: each idea_id must appear exactly once.");
  }

  for (const idea of ideas) {
    const forIdea = hooks.filter((h) => h.idea_id === idea.id);
    if (forIdea.length !== PACKAGE_HOOKS_PER_IDEA) {
      errors.push(`hooks: idea_id ${idea.id} must have exactly ${PACKAGE_HOOKS_PER_IDEA} hooks.`);
      continue;
    }
    const variants = new Set(forIdea.map((h) => h.variant_index));
    for (let v = 1; v <= PACKAGE_HOOKS_PER_IDEA; v += 1) {
      if (!variants.has(v)) {
        errors.push(`hooks: idea_id ${idea.id} missing variant_index ${v}.`);
      }
    }
  }

  return errors;
}

export function asRecordForValidation(raw: unknown): Record<string, unknown> | null {
  return isPlainObject(raw) ? raw : null;
}
