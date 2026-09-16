# Universal Software Engineering & Reliability Standards

> **MANDATORY POLICY FOR ALL CODE CHANGES AND SYSTEM ARCHITECTURE.**

## 1. Systematic Root-Cause Debugging
- Never apply "shotgun debugging" (guessing or modifying random lines of code).
- Never suppress TypeScript errors with `as any` or `@ts-ignore`.
- Always follow the 5-step diagnostic protocol:
  1. Build a minimal reproduction or failing unit test.
  2. Inspect state and callstack backwards from point of failure.
  3. Formulate a falsifiable hypothesis.
  4. Isolate using binary search (`git bisect` or component pruning).
  5. Implement the clean fix and add a regression test.

## 2. Secure & Predictable API Design
- Standardize RESTful JSON error envelopes with `error.code`, `error.message`, and `requestId`.
- Validate all incoming request payloads at the boundary using `Zod` schemas.
- Non-idempotent mutations (`POST`) must support `Idempotency-Key` deduplication.
- Protect outbound API calls with strict `AbortController` timeout budgets and circuit breakers.

## 3. Twelve-Factor Production Readiness
- Separate `/api/health/live` (process alive) from `/api/health/ready` (dependencies connected).
- Implement graceful shutdown listeners (`process.on('SIGTERM')`) that drain connections before exiting.
- Use single-line structured JSON logging with request correlation IDs and PII scrubbing.
