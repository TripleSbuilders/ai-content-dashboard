# Design system (UI)

This project uses **Tailwind CSS** with **CSS variables** for semantic colors (light + dark). Source of truth for tokens: [`client/src/index.css`](../client/src/index.css) (`:root` and `html.dark`).

## Colors

- **Light:** “earthy” cream background (`#FAF9F6`), brown text (`#3E2723`), **forest green** primary (`#2E7D32`), terracotta secondary (`#8D6E63`).
- **Dark:** GitHub-inspired base (`#0d1117` / `#161b22`), **blue** primary accent (`#58a6ff`), muted text `#8b949f`.
- Prefer **semantic Tailwind** classes mapped to variables: `background`, `on-background`, `surface`, `primary`, `on-primary`, `on-surface`, etc. (see [`client/tailwind.config.js`](../client/tailwind.config.js)).

## Typography & layout

- Tailwind utilities for spacing and type scale; no separate design-token package — keep **consistent spacing** (`gap-*`, `p-*`, `max-w-*`) with existing screens.
- **Forms:** `@tailwindcss/forms` is enabled.

## RTL / bilingual

- Product supports **Arabic and English** content in generated kits; UI should not assume LTR-only copy in user-visible strings where Arabic is shown. Prefer logical properties where layout must mirror (`ms`/`me`, `text-start`/`text-end`) when adding new layout-heavy components.

## Do / don’t

- **Do** reuse existing patterns in `client/src` (cards, buttons, wizard steps).
- **Don’t** add a new component library (MUI, Chakra, etc.) without an **ADR** and team agreement — see [`ARCHITECTURE.md`](../ARCHITECTURE.md).
