# Phase 1 Rollout Checklist

## Release gates

- [ ] `npx tsc --noEmit -p client/tsconfig.json`
- [ ] `npx tsc --noEmit -p server/tsconfig.json`
- [ ] `npm audit --audit-level=high`
- [ ] `server/src/routes/kits.test.ts` passes (including stream tests)
- [ ] `npm run test:e2e` smoke flow

## Functional checks

- [ ] Normal generate route still returns `KitSummary` in non-stream mode
- [ ] Stream mode emits `status` + `partial` + `complete`
- [ ] Wizard shows progressive status/progress while loading
- [ ] Viewer handles missing optional fields without crash
- [ ] Viewer warns on missing critical sections

## Observability checks

- [ ] Stream start/complete/error logs present
- [ ] No sensitive prompt/body leaks in logs

## Rollback criteria

Rollback Phase 1 immediately if any of these occur:

- Non-stream `/api/kits/generate` contract breaks for existing clients
- Stream endpoint causes repeated 5xx in production logs
- Wizard hangs without receiving `complete` in stream mode
- Kit viewer regression blocks copy/regenerate workflows

## Rollback plan

1. Disable stream usage in frontend (`useWizardSubmission` fallback to non-stream call).
2. Keep backend stream route additive but unused.
3. Re-run sanity checks and redeploy.
