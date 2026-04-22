# Product scope (locked reference)

**Product:** Social Geni — AI Content Dashboard (`social-geni` in repo). Turn a structured wizard brief into a persisted **kit** (JSON): posts, image/video creative specs, and strategy blocks.

## In scope (current)

- Guided **wizard** (social / offer / deep campaign modes) with draft auto-save.
- **Synchronous** kit generation via **Gemini** + strict **JSON response schema**; persist to **PostgreSQL** (`social_geni` schema).
- **Dashboard**, kit list, **kit viewer** with copy actions, retry, per-item regenerate.
- **Auth** (Supabase), plans/usage, admin surfaces (prompt catalog, kits review, plans) as implemented in repo.
- **Bilingual** output fields where schema requires (`post_ar` / `post_en`, captions, etc.).

## Out of scope (unless explicitly re-scoped)

- **Native mobile apps** (not in repo as first-class deliverable).
- **Post scheduling** / calendar publishing to social networks (product copy positions creation-first; scheduling is future).
- Replacing **Postgres** with SQLite or edge-only storage for production (stack is locked — see [ARCHITECTURE.md](ARCHITECTURE.md)).
- **Client-side** Gemini keys (generation is server-only).

## Changing this scope

1. Update **this file** and, if needed, [PROJECT_BRIEF.md](PROJECT_BRIEF.md) §11 (future direction).
2. For stack or integration changes, add or update an ADR under [docs/adr/](docs/adr/).
3. Record the decision owner and date in the PR or issue.
