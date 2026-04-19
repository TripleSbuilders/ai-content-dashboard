# ADR 0001: Record architecture decisions in-repo

## Status

Accepted

## Context

The team uses AI-assisted development and needs a lightweight way to lock **stack and integration** choices without bloating the main brief.

## Decision

- Significant changes to **frontend framework**, **API layer**, **database engine**, or **default AI provider** are documented as **Architecture Decision Records** under `docs/adr/` using sequential numbers (`0002-…`, etc.).
- Each ADR includes: **context**, **decision**, **consequences** (positive/negative).

## Consequences

- Onboarding and agents can read `ARCHITECTURE.md` + ADRs instead of inferring from scattered PRs.
- Small refactors inside the same stack do not require an ADR.
