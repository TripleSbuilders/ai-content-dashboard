# Git workflow

## Branches

- Use a **dedicated branch per task** (`feat/…`, `fix/…`, `chore/…`).
- Keep branches **short-lived**; rebase or merge from default branch as needed to reduce drift.

## Commits (micro-checkpoints)

- Prefer **small commits**: one logical unit per commit (e.g. “add validation”, then “wire API”, then “tests”).
- Use **Conventional Commits** style when possible: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Avoid mixing unrelated changes in one commit (harder to bisect and review).

## Commits and documentation

Before **every** commit, run a quick check:

1. Did this change alter a **contract** listed in [`docs/TASKING.md`](TASKING.md) → **Documentation sync** (schema, JSON shapes, API, prompts, env, security, stack)?
2. If **yes**: the same commit or PR must include updates to the listed docs (`docs/`, `README.md`, `PROJECT_BRIEF.md` sections, `.env.example`, ADR as applicable). Prefer a dedicated commit with prefix **`docs:`** for documentation-only edits (easier review) **or** include doc edits in the same commit as the code if the change is small.

**Agents and humans:** Treat missing doc updates on substantive code changes as **incomplete work** — do not push until resolved or explicitly deferred with a ticket per `TASKING.md`.

## Before push

From repo root (see [`README.md`](../README.md) — Pre-Push Quality Gates):

```bash
npx tsc --noEmit -p client/tsconfig.json
npx tsc --noEmit -p server/tsconfig.json
npm audit --audit-level=high
```

Add `npm run test:e2e` when the change affects user flows (see [`TESTING.md`](TESTING.md)).

## Optional automation (team decision)

- **husky** + **lint-staged**: not required by default; adopt explicitly if the team wants pre-commit hooks.
