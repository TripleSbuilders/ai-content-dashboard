# V1/V2 Decision Comparison

## Objective
Provide a clear decision memo for choosing between:
- Continuing with `V1 + V2` in parallel
- Refactoring into a simpler unified path

---

## Path A: Continue As-Is (V1 + V2 in parallel)

### What it means
- Keep current split behavior:
  - V1 continues to exist as a self-serve product path
  - V2 continues to exist as agency/productized-service path
- Keep edition flags and branch-driven deployment behavior.

### Advantages
- Fastest short-term delivery.
- Minimal immediate code churn.
- Easy fallback (V1 is already running).
- Lower immediate migration risk.

### Disadvantages
- Ongoing complexity in auth/redirect behavior.
- Higher support/debug overhead (two user journeys).
- Feature duplication risk (same feature handled in two modes).
- More QA surface area for every release.
- Higher chance of regression when touching shared auth/routes.

### Best for
- Urgent launch windows where shipping this week matters more than architecture quality.

---

## Path B: Full Refactor (Return to simpler unified architecture)

### What it means
- Remove dual-track operational complexity.
- Consolidate to one canonical auth flow and one canonical user entry path.
- Keep agency page behavior as product mode logic inside one app structure.

### Advantages
- Simpler mental model for product and engineering.
- Fewer redirect/auth edge cases.
- Lower long-term maintenance cost.
- Faster iteration after cleanup.
- Reduced QA matrix.

### Disadvantages
- Higher immediate implementation effort.
- Requires migration and retesting all critical user flows.
- Temporary delivery slowdown during cleanup period.

### Best for
- Teams prioritizing reliability and maintainability over short-term speed.

---

## Practical Middle Option (Recommended)

### Targeted Refactor (not full rollback)
- Keep V2 as canonical external experience.
- Keep current successful V2 functional changes (wizard, async generation, admin workflow).
- Decommission V1 as an active entry path (informational redirect, no active login flow).
- Normalize auth logic so only one active production sign-in journey is used.

### Why this is recommended
- Preserves delivered V2 business work.
- Removes the main source of repeated incidents (split auth/redirect behavior).
- Lower risk than a complete rollback-and-rebuild.
- Faster stabilization than continuing dual-mode indefinitely.

---

## Comparison Table (Decision-Oriented)

- **Time-to-ship now**
  - Path A: Highest
  - Path B: Lowest
  - Targeted Refactor: Medium

- **Operational complexity**
  - Path A: High
  - Path B: Low
  - Targeted Refactor: Low-Medium

- **Auth/redirect incident risk**
  - Path A: High
  - Path B: Low
  - Targeted Refactor: Low

- **Long-term maintenance cost**
  - Path A: High
  - Path B: Low
  - Targeted Refactor: Low

- **Migration risk this week**
  - Path A: Low
  - Path B: High
  - Targeted Refactor: Medium

---

## Decision Guidance

Choose **Path A** only if:
- You must ship immediately and can accept recurring auth/routing support work.

Choose **Path B** if:
- You can absorb short-term slowdown to eliminate architecture debt now.

Choose **Targeted Refactor** if:
- You want a stable, pragmatic path: keep delivered business value while removing the main technical risk.

---

## Suggested Next Step
- Approve one direction explicitly (A, B, or Targeted Refactor).
- Lock auth strategy first (single canonical login journey).
- Then execute route visibility policy (what normal users can/cannot see) as a separate controlled change.
