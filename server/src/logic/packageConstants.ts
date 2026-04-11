/** Counts for the chained content ideas package (aligned with product brief). */
export const PACKAGE_IDEA_COUNT = 10;
export const PACKAGE_HOOKS_PER_IDEA = 3;
export const PACKAGE_EXPECTED_HOOKS = PACKAGE_IDEA_COUNT * PACKAGE_HOOKS_PER_IDEA;

/** Merged into kit `result_json` when the chained package runs successfully. */
export const CONTENT_IDEAS_PACKAGE_KEY = "content_ideas_package" as const;
