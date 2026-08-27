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

- `npm run test`: **19 tests passed in 7 test files**.
- `npm run test -- --coverage`: **19 tests passed in 7 test files**.
- Coverage: **56.12% statements, 64.77% branches, 53.57% functions, 57.23% lines** across the configured application include set.

The percentage is intentionally reported as measured. The suite is focused on validation, prompt contracts, and a representative UI component; it is not a claim of full application coverage.
