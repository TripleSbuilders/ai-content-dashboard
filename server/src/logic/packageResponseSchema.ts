/**
 * Gemini responseSchema fragments for chained content-package generation.
 * Each step uses a small OBJECT root to constrain hallucinations.
 */

const ideaItem = {
  type: "OBJECT",
  required: ["id", "title", "description"],
  properties: {
    id: { type: "INTEGER" },
    title: { type: "STRING" },
    description: { type: "STRING" },
  },
} as const;

export function getIdeasStepSchema(): Record<string, unknown> {
  return {
    type: "OBJECT",
    required: ["ideas"],
    properties: {
      ideas: {
        type: "ARRAY",
        items: ideaItem,
      },
    },
  };
}

export function getScriptsStepSchema(): Record<string, unknown> {
  return {
    type: "OBJECT",
    required: ["scripts"],
    properties: {
      scripts: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          required: ["idea_id", "visuals", "voiceover"],
          properties: {
            idea_id: { type: "INTEGER" },
            visuals: { type: "STRING" },
            voiceover: { type: "STRING" },
          },
        },
      },
    },
  };
}

export function getHooksStepSchema(): Record<string, unknown> {
  return {
    type: "OBJECT",
    required: ["hooks"],
    properties: {
      hooks: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          required: ["idea_id", "variant_index", "hook_text"],
          properties: {
            idea_id: { type: "INTEGER" },
            variant_index: { type: "INTEGER" },
            hook_text: { type: "STRING" },
          },
        },
      },
    },
  };
}

export function getTemplatesStepSchema(): Record<string, unknown> {
  return {
    type: "OBJECT",
    required: ["templates"],
    properties: {
      templates: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          required: ["idea_id", "template_format"],
          properties: {
            idea_id: { type: "INTEGER" },
            template_format: { type: "STRING" },
          },
        },
      },
    },
  };
}
