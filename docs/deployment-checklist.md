# Deployment Checklist

Run date: 2026-08-27

## Completed verification

- [x] Production URL: https://ai-resume-pilot-nz.vercel.app/
- [x] `npm install` completed and lockfile updated.
- [x] `npm run lint` completed with existing Next image warnings and no errors.
- [x] `npm run test` passed: 14 tests in 5 files.
- [x] `npm run test -- --coverage` passed; result recorded in [testing.md](testing.md).
- [x] `npm run typecheck` passed.
- [x] `npm run build` passed.
- [ ] Latest image/hydration optimization changes deployed to Vercel.
- [x] Environment variable names documented without values.
- [x] `.env*` files are ignored by Git; no `.env.local` is tracked.
- [x] Landing and workspace accessibility flows audited with axe-core.
- [x] Production landing page audited with Lighthouse.
- [x] Production deployment source is the connected GitHub repository `Nofalzia/resume-pilot` and Vercel project URL above. The exact deployed commit was not asserted locally.
- [x] API failure paths verified by tests for malformed, missing, oversized, and invalid input.

The currently recorded deployed Lighthouse Performance score is 73. The latest optimized local production run measured 72, and these changes have not been deployed in this work session, so the Performance >=85 target is not claimed as satisfied.

## Dependency audit note

`npm audit --audit-level=high` currently reports 5 high-severity transitive advisories involving `brace-expansion`, `js-yaml`, `postcss`, and `sharp`. Automatic remediation would require dependency upgrades outside the current Next.js range, so this repository does not claim a clean dependency audit. Review and test those upgrades separately before applying them.

## Environment

Required server-side variable:

- `OPENROUTER_API_KEY`: server-only OpenRouter credential.

Optional variables:

- `ANALYSIS_MODEL`: override the analysis model.
- `COPILOT_MODEL`: override the Copilot model.
- `NEXT_PUBLIC_API_URL`: retained template variable; the current client uses same-origin API routes.

Set variables in Vercel Project Settings for production. Never place the OpenRouter key in client code or commit it.

## Safe failure behavior
`/api/analyze` returns 400 for invalid input, 429 for detected provider rate limits, and a generic 502 for provider failures. `/api/chat` validates message history, resume size, and analysis shape before contacting the provider, then returns safe 429/502 responses. The UI provides retry/error states and does not expose raw provider errors.

## Rollback procedure
1. In Vercel, open the project’s Deployments list.
2. Identify the last known-good deployment and promote it using Vercel’s rollback/promote action.
3. If a new build is needed, redeploy the known-good Git commit from the connected repository.
4. Verify `/`, `/workspace`, and both API failure paths after rollback.

This project does not currently claim an external incident-management or automated rollback system.

## Monitoring and logging
Current operational signals are Vercel deployment/build logs and Vercel runtime logs. The API routes log provider error messages server-side with route labels while returning sanitized client responses. There is no Sentry, uptime monitor, database, or custom alerting integration currently configured.

## Final verification
Before a release, rerun:

```bash
npm install
npm run lint
npm run test
npm run test -- --coverage
npm run typecheck
npm run build
```

Then smoke-test the production URL, submit a short resume with and without a job description, and verify a provider failure/rate-limit message remains user-safe.
