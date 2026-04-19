# Agent collaboration (AI coding assistants)

Short rules for humans and tools (Cursor, Codex, etc.) working on this repo.

**New to this repo:** read **[`AI_HANDOFF.md`](AI_HANDOFF.md)** first (status, path map, strict no-rewrite rule), then [`docs/CONTEXT_INDEX.md`](docs/CONTEXT_INDEX.md).

## Context routing

- Start from **[`docs/CONTEXT_INDEX.md`](docs/CONTEXT_INDEX.md)** when the full [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) does not fit in context.
- **Mandatory entry points (single source of truth):** Before writing code, open **`docs/CONTEXT_INDEX.md`** → section **Mandatory entry points by task type** and read the listed files for your task type (Frontend, Backend/API, Database, AI, or Product/scope). Do not skip this when onboarding or switching agents.
- **Database:** [`docs/DATABASE.md`](docs/DATABASE.md) + source `server/src/db/schema.ts`.
- **Gemini prompts:** [`docs/GEMINI_PROMPTS.md`](docs/GEMINI_PROMPTS.md) + `server/src/logic/promptComposer.ts` / `promptResolver.ts`.
- **Documentation sync:** Substantive changes must update related docs before the work is done — see [`docs/TASKING.md`](docs/TASKING.md) (Documentation sync) and [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md) (Commits and documentation).

## Single-model continuity

- Prefer **one session / one model** for a coherent feature when possible.
- If work is split across models or sessions, do a **manual pass** for consistency before merge.
- If context is truncated, re-attach **`docs/CONTEXT_INDEX.md`** and the files for the current task — do not rely on memory of earlier turns.

## Process

- Tasks: [`docs/TASKING.md`](docs/TASKING.md).
- Phase verification: [`docs/templates/phase-audit.md`](docs/templates/phase-audit.md).
- Git/commits: [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md).
- Tests: [`docs/TESTING.md`](docs/TESTING.md).

## Scope & stack

- Product scope: [`SCOPE.md`](SCOPE.md).
- Locked stack and ADR pattern: [`ARCHITECTURE.md`](ARCHITECTURE.md), [`docs/adr/0001-record-architecture.md`](docs/adr/0001-record-architecture.md).
