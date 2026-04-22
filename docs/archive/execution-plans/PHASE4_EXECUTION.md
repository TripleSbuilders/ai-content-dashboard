# Phase 4 Execution Spec (Premium Polish + Viewer Performance)

This document records the Phase 4 implementation baseline:

- 1.2 animation calibration across viewer surfaces
- 4.1 Unicode short-form clipboard formatting
- 4.2 shared-element-style expansion transitions with `framer-motion`
- 4.3 viewer-scoped keyboard shortcuts
- 4.4 progressive rendering/memoization for large viewer payloads

## 1) Motion system updates

- Added `framer-motion` and moved key card/section expand-collapses to motion primitives.
- Standardized transition timing/easing for a calmer interaction profile.
- Added reduced-motion-safe fallback behavior (no forced animation when OS preference disables motion).

## 2) Copy workflow enhancement

- Added a Unicode formatter utility for short, markdown-like emphasis conversion:
  - `**bold**` -> Unicode bold
  - `*italic*` -> Unicode italic
  - `` `inline` `` -> bracketed inline style
- Added guardrails to keep long-form copy on normal plain-text path for readability/accessibility.
- Added enhanced "Copy LinkedIn" path on post cards while preserving existing copy controls.

## 3) Expansion UX continuity

- Expanded cards now preserve context on collapse:
  - restores focus target
  - restores previous scroll position
- Applied style guardrails (radius/shadow) to avoid visual distortion during animated state changes.

## 4) Hotkey layer (viewer scope)

- Added scoped hotkeys:
  - `Cmd/Ctrl + C` -> copy active/fallback block
  - `Cmd/Ctrl + R` -> regenerate active item
  - `Cmd/Ctrl + Enter` -> approve/save contextual action
- Added input guards so shortcuts do not fire while typing in editable fields.
- Added discoverability hints (`<kbd>`) in the viewer index header.

## 5) Large payload rendering safeguards

- Added progressive list rendering helper (`VirtualizedList`) for heavy repeated lists:
  - grouped post days
  - image/video prompt lists
- Wrapped heavy card components with `React.memo` to reduce avoidable re-renders.

## 6) Tests and verification

- Added client tests for:
  - Unicode conversion + guardrails
  - hotkey resolution behavior
  - virtualization range helper behavior
- Verification commands executed:
  - `npx tsc --noEmit -p client/tsconfig.json`
  - `npm run lint -w client`
  - `npm run build -w client`
  - `npm run test -w client`
  - `npm run test:e2e -w client -- --grep "dashboard and wizard shells load"`
