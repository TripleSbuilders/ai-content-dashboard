# Agency Pivot Execution (V2)

This document records the Self-Serve to Agency pivot implementation while preserving the existing V1 flow.

## Deployment model

- `v1` (Self-Serve): existing behavior, no functional removal.
- `v2` (Agency): intake-first journey with thank-you delivery flow.
- Both run from separate branches/services.

## Edition switches

### Backend

- `APP_EDITION=self_serve|agency`
  - `self_serve`: standard owner-access behavior for `/api/kits` and `/api/kits/:id`.
  - `agency`: non-admin access to kit listing/detail is blocked; admin routes stay available.

### Frontend

- `VITE_APP_EDITION=self_serve|agency`
  - `self_serve`: existing dashboard/wizard language and kit navigation.
  - `agency`: service-intake copy, two-column wizard, thank-you page redirect.

## New lead routing contract

The wizard now includes:

- `client_name`
- `client_phone`
- `client_email`
- `source_mode` (`self_serve` or `agency`)

In V2 (`VITE_APP_EDITION=agency`), frontend injects:

- `source_mode: "agency"`

In V1, default remains:

- `source_mode: "self_serve"`

## Client journey (V2)

1. User submits wizard.
2. Server generates and persists kit as usual.
3. User is redirected to `OrderReceivedPage` (no public Kit Viewer).
4. Sales/internal team handles delivery from admin kit pages.

## Admin/internal visibility

Admin pages now surface routing context:

- source mode (`agency` / `self_serve` / `unknown`)
- client contact fields from `brief_json`

## Telegram team alert

If `TELEGRAM_WEBHOOK_URL` is set, successful generation sends a non-blocking alert containing:

- source mode
- client contact details
- brand/mode
- kit id
- correlation id
- optional admin link (`ADMIN_BASE_URL + /admin/kits/:id`)

Failures in webhook delivery are logged and do not block generation success.

## Validation summary

Executed during implementation:

- `npm run build`
- `npm run test`
- `npm run test:e2e`
- `npx tsc --noEmit -p client/tsconfig.json`
- `npx tsc --noEmit -p server/tsconfig.json`
