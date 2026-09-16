---
name: production-readiness-checklist
description: "Twelve-factor production readiness: graceful shutdowns, liveness/readiness probes, structured JSON logging, crash telemetry, and unhandled exception safety."
category: devops
risk: safe
tags: [production, devops, reliability, monitoring, snyk]
---

# Production Readiness Checklist (Twelve-Factor App)

Verification checklist before promoting any backend or full-stack service to production.

## 1. Health Checks & Probes

Provide distinct endpoints for orchestrators (Kubernetes/Docker):
- `/api/health/live`: Fast ping confirming the process event loop is alive (returns HTTP 200).
- `/api/health/ready`: Verifies database, Redis, and external dependency connectivity. Returns 503 if DB is unreachable.

## 2. Graceful Shutdown (SIGTERM / SIGINT)

Never let containers abruptly terminate active HTTP requests or database transactions:
```ts
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Starting graceful drain...');
  server.close(async () => {
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
  });
});
```

## 3. Structured Logging & Correlation

- Logs must be single-line JSON (`pino` / `winston`).
- Every request must generate or propagate an `x-request-id` header included in all subsequent log entries.
- Scrub sensitive fields (`password`, `token`, `authorization`, `creditCard`) before serialization.
