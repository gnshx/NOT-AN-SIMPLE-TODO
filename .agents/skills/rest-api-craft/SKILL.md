---
name: rest-api-craft
description: "World-class REST API design: predictable URIs, proper HTTP status codes, standard error envelopes, idempotency keys, and cursor-based pagination."
category: backend
risk: safe
tags: [api, rest, backend, architecture, design-patterns]
---

# REST API Craft & Design Standards

Engineering standard for designing predictable, robust, and developer-friendly RESTful APIs.

## 1. URI & Resource Conventions

- **Nouns, Not Verbs**: Use plural nouns (`/api/v1/applications`, `/api/v1/resumes`). Use HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`) for actions.
- **Sub-Resource Hierarchy**: Represent relationships cleanly: `/api/v1/workspaces/:id/members`.
- **Custom Actions**: For non-CRUD business actions, use verb suffixes: `/api/v1/applications/:id/archive` or `/api/v1/exports/trigger`.

## 2. Standardized Error Envelopes

Never return raw unhandled exceptions or strings. Always return structured JSON:
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Validation failed for request parameters.",
    "details": [
      { "field": "email", "issue": "Must be a valid email address" }
    ],
    "requestId": "req_01j7abc123"
  }
}
```

## 3. High-Scale Pagination: Cursor-Based

For high-volume records, avoid `OFFSET/LIMIT` (which degrades to $O(N)$ scanning). Use cursor pagination:
- Request: `GET /api/v1/jobs?limit=25&cursor=clt01abc...`
- Response:
```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "clt02def...",
    "hasMore": true
  }
}
```

## 4. Distributed Idempotency

All non-idempotent mutating requests (`POST`) that process billing, webhooks, or job triggers must support the `Idempotency-Key` header with Redis deduplication.
