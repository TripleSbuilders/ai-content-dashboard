# Social Geni — Executive Brief (One Page)

## What it is

**Social Geni** is an AI Content Dashboard that turns one structured business brief into a complete, usable **content kit**: social posts, image prompts, video plans, and strategic messaging.

It is not a generic AI chat. It is a **structured generation pipeline** with predictable outputs, stored artifacts, and a UI built for execution.

---

## Core problem

Most small teams and founders struggle with:

- fragmented AI outputs that are hard to execute,
- weak consistency across channels and languages,
- poor prompt quality for image/video tools,
- no single asset bundle ready for production.

Social Geni solves this by generating one coherent kit per submission and allowing targeted iteration without restarting from zero.

---

## Product flow

1. User fills a guided wizard (brand, audience, goals, platforms, tone, budget, output counts).
2. Backend generates a structured kit with strict schema validation.
3. User reviews, copies, and regenerates specific items as needed.
4. Artifacts are persisted for reuse, refinement, and operational visibility.

---

## Deliverable & intake (snapshot)

**The kit (what ships to the customer):** Each run produces one stored **JSON artifact** with **eight required blocks**—social posts, image briefs, video plans, plus marketing strategy, sales system, offer optimization, a short diagnosis plan, and a narrative summary—so the product is a **defined deliverable**, not a chat log. Optional add-ons include KPI scaffolding and a **content-ideas package** (ideas, hooks, templates); bilingual caption/post fields support Arabic/English execution without breaking the UI contract.

**The wizard (how context is captured):** **Four to six guided steps** depending on campaign path (**social**, **offer**, or **deep**) and whether the session uses the optional **“quick diagnosis”** first screen (~A/B). Users move through **cards, pills, and structured selects** with **per-step validation**, **auto-saved drafts**, and a clear final commit; generation is **synchronous** (~10–30 seconds) into the kit above.

**Where to read details when the full brief does not fit in context:** start with **[`docs/CONTEXT_INDEX.md`](docs/CONTEXT_INDEX.md)** — it routes to **§5.2** / **§10.4** in [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md), [`docs/DATABASE.md`](docs/DATABASE.md) (tables/columns), and [`docs/GEMINI_PROMPTS.md`](docs/GEMINI_PROMPTS.md) (prompt excerpts + file map). **Scope and stack locks:** [`SCOPE.md`](SCOPE.md), [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## Current phase: Paid Beta

The product is running a **Paid Beta** model:

- **Starter**: free trial entry to test output quality quickly.
- **Early Adopter**: low-cost paid tier with practical monthly asset quotas.

Goal: maximize first adoption, collect usage evidence, then optimize pricing and packaging.

---

## Differentiation

- **Vs chat tools**: fixed output shape, artifact storage, retry/regenerate controls.
- **Vs template products**: generated from each user brief, not static documents.
- **Vs schedulers**: creation-first platform (copy + prompts + strategy), scheduling optional for later.

---

## Admin and operations

Admin workflows support:

- user and role management (including privileged access),
- prompt governance and quality tuning,
- analytics and full-kit review for product iteration.

---

## Quality and reliability principles

- strict JSON schema contracts for stable UI rendering,
- idempotent generation behavior and safer retries,
- per-item regeneration for practical editing workflows,
- anti-repetition and prompt quality controls for more diverse outputs.

---

## Strategic direction

Short-to-mid term focus:

- stronger multi-select semantics and richer wizard fidelity,
- better validation feedback and repair flows,
- deeper type sharing across client/server,
- continued conversion optimization from trial to paid.

---

## Tech snapshot

- **Frontend**: React (Vite, TypeScript)
- **Backend**: Hono (TypeScript)
- **Database**: PostgreSQL (Drizzle)
- **Generation**: Gemini

For technical details: [`README.md`](README.md) (run, API, quality gates), [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) (full narrative + §10), and the index [`docs/CONTEXT_INDEX.md`](docs/CONTEXT_INDEX.md). Agent collaboration rules: [`AGENTS.md`](AGENTS.md).
