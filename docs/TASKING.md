# Tasking rules (issues & PRs)

Use this for human and AI contributors so each change stays **small, testable, and traceable to code**.

## Size limits

- **One PR = one goal** that can be described in a single sentence (e.g. “fix wizard step validation for offer path”).
- If the work touches **unrelated** areas (DB migration + unrelated UI tweak), split into separate PRs.
- Prefer **vertical slices** (API + minimal UI) over large horizontal refactors unless an ADR exists.

## Task / issue template

Copy and fill:

| Field | Content |
|--------|---------|
| **Context** | Why this change; link to user story, bug, or `docs/PROJECT_STATE.md` item. |
| **Acceptance criteria** | Bullet list of observable outcomes (what the user or API does). |
| **Expected files / areas** | Likely paths (e.g. `server/src/routes/…`, `client/src/components/…`). |
| **Verification** | How to prove it: command(s), manual steps, or Playwright spec name. |
| **Code evidence (required to close)** | At least one of: path to changed file(s), test name, or PR diff link — **not** “done” from task text alone. |
| **Docs updated (required if substantive)** | `Y` or `N`. If `Y`, list paths (e.g. `docs/DATABASE.md`, `README.md`). If `N`, confirm no substantive contract change (or link follow-up ticket). See **Documentation sync** below. |

## Documentation sync (mandatory for substantive changes)

Substantive changes are those that alter a **contract** or **operational truth**: Drizzle schema or migrations; kit/API JSON shape; REST routes or request/response semantics; prompt assembly or model output schema; new or renamed env vars; auth/security behavior; or locked stack (requires ADR).

| Trigger (examples) | Update these docs (at minimum) |
|---------------------|--------------------------------|
| `server/src/db/schema.ts` or migrations | [`docs/DATABASE.md`](DATABASE.md); align [`PROJECT_BRIEF.md`](../PROJECT_BRIEF.md) §10.3 only if product narrative must match (avoid duplicating full columns — prefer `DATABASE.md`). |
| `server/src/logic/responseSchema.ts`, `promptComposer.ts`, `promptResolver.ts`, or Gemini call path | [`docs/GEMINI_PROMPTS.md`](GEMINI_PROMPTS.md); if product-facing behavior of the kit changes, add/adjust a short pointer in `PROJECT_BRIEF.md` §10.5. |
| New/changed `/api/*` routes or HTTP semantics | [`README.md`](../README.md) API table; `PROJECT_BRIEF.md` §10.8 if the brief is the contract for reviewers. |
| New/required env vars | [`README.md`](../README.md); root [`.env.example`](../.env.example) (and `server/.env` / `client/.env.local` examples as applicable). |
| Stack or integration change (e.g. new major dependency) | [`ARCHITECTURE.md`](../ARCHITECTURE.md) + new ADR under [`docs/adr/`](adr/). |
| UI tokens, RTL, or “do not add library X” policy | [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md). |

**Rule:** Work is **not** complete until related docs are updated **in the same branch / same PR** as the code. “Docs later” is allowed only with a **tracked ticket** and explicit note in the PR — not silently.

## Definition of done

- Acceptance criteria met.
- **Code evidence** column filled (see [phase audit template](templates/phase-audit.md)).
- **Documentation sync:** If the change is substantive (see table above), **Docs updated** is `Y` with paths, or a ticket link for deferred doc work with team agreement.
- Pre-push checks from [`TESTING.md`](TESTING.md) run where applicable.
