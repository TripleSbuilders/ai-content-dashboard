# AI Handoff — Entry point for future agents

## 1. Project status (read this first)

This repository describes a **complete, stable, and already-shipped** application: **Social Geni** (AI Content Dashboard). The codebase is **not a greenfield scaffold** — features, wizard flows, API surface, persistence, and generation pipeline are **implemented and in use**.

Your job in maintenance or small feature work is to **respect what exists**: read the paths below, follow [`docs/TASKING.md`](docs/TASKING.md) and [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md), and keep documentation in sync when you change contracts (see **Documentation sync** in `TASKING.md`).

---

## 2. Quick map — mandatory paths by task type

Read these **in order** before editing code. The canonical table with full links lives in [`docs/CONTEXT_INDEX.md`](docs/CONTEXT_INDEX.md) (section **Mandatory entry points by task type**). Summary:

| Task type | Start here (ordered) |
|-----------|----------------------|
| **Frontend / UI** | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) → [`client/src/main.tsx`](client/src/main.tsx) → [`client/src/App.tsx`](client/src/App.tsx); wizard fields → [`client/src/briefSchema.ts`](client/src/briefSchema.ts); wizard shell → [`client/src/pages/wizards/WizardCore.tsx`](client/src/pages/wizards/WizardCore.tsx) |
| **Backend / API** | [`server/src/index.ts`](server/src/index.ts) → [`server/src/middleware/auth.ts`](server/src/middleware/auth.ts) → relevant `server/src/routes/*.ts` (e.g. [`server/src/routes/kits.ts`](server/src/routes/kits.ts)); generation from HTTP → [`server/src/services/kitGenerationService.ts`](server/src/services/kitGenerationService.ts) |
| **Database / schema** | [`server/src/db/schema.ts`](server/src/db/schema.ts) → [`server/src/db/migrations.ts`](server/src/db/migrations.ts) → [`docs/DATABASE.md`](docs/DATABASE.md) |
| **AI / prompts / orchestration** | [`docs/GEMINI_PROMPTS.md`](docs/GEMINI_PROMPTS.md) → [`server/src/logic/promptComposer.ts`](server/src/logic/promptComposer.ts) → [`server/src/logic/promptResolver.ts`](server/src/logic/promptResolver.ts) → [`server/src/logic/responseSchema.ts`](server/src/logic/responseSchema.ts) → [`server/src/logic/geminiClient.ts`](server/src/logic/geminiClient.ts) → [`server/src/services/aiGenerationProvider.ts`](server/src/services/aiGenerationProvider.ts); content package → [`server/src/services/contentPackageOrchestrator.ts`](server/src/services/contentPackageOrchestrator.ts) + `server/src/logic/package*.ts` |
| **Product / scope** | [`SCOPE.md`](SCOPE.md) → relevant sections of [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) |

**Next routing:** [`docs/CONTEXT_INDEX.md`](docs/CONTEXT_INDEX.md) (full doc list + single source of truth table). Collaboration rules: [`AGENTS.md`](AGENTS.md).

---

## 3. Strict directive (non-negotiable)

**Do not rewrite or broadly refactor the existing infrastructure.** The stack (Vite/React client, Hono server, PostgreSQL + Drizzle, Gemini server-side, auth/middleware patterns) and folder layout are **intentional and locked** unless an ADR says otherwise ([`ARCHITECTURE.md`](ARCHITECTURE.md), [`docs/adr/`](docs/adr/)).

Your role is to:

- **Understand** the current code and docs.
- **Build on** them with minimal, task-scoped changes (features, fixes, small improvements).
- **Fix bugs** and contract mismatches **within** the established structure — not replace frameworks, not reorganize the whole repo, not “modernize for modernization’s sake.”

If a change would require large-scale restructuring, **stop** and document the proposal in a ticket/ADR first; do not merge drive-by rewrites.

---

## 4. Operational checklist (reminder)

- Pre-push: [`README.md`](README.md) (Pre-Push Quality Gates) and [`docs/TESTING.md`](docs/TESTING.md).
- Substantive code change → update related docs per [`docs/TASKING.md`](docs/TASKING.md) before considering the work done.
