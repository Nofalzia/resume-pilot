# Testing

## Stack
- Vitest 4 with a single-thread pool for stable Windows execution.
- React Testing Library with jsdom and `@testing-library/jest-dom`.
- V8 coverage via `@vitest/coverage-v8`.

## Coverage
The suite covers prompt branching and anti-fabrication instructions, `AnalysisSchema` valid/invalid output, `/api/analyze` malformed/missing/oversized input, `/api/chat` missing/invalid/oversized input, and the shared Button loading and click behavior. AI provider calls are not made by the tests.

## Commands
```bash
npm run test
npm run test -- --coverage
```

## Latest result
Run date: 2026-08-27

- `npm run test`: **14 tests passed in 6 test files**.
- `npm run test -- --coverage`: **14 tests passed in 6 test files**.
- Coverage: **19.35% statements, 16.47% branches, 10.71% functions, 19.73% lines** across the configured application include set.

The percentage is intentionally reported as measured. The suite is focused on validation, prompt contracts, and a representative UI component; it is not a claim of full application coverage.
