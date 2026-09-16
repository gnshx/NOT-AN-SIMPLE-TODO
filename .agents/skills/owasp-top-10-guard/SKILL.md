---
name: owasp-top-10-guard
description: "OWASP Top 10 defense patterns: SQL/NoSQL injection prevention, SSRF guards, BOLA/IDOR tenant authorization, XSS sanitization, and security headers."
category: security
risk: safe
tags: [owasp, security, pentesting, defense, web-security]
---

# OWASP Top 10 Defense Patterns

Comprehensive guidelines for eliminating the most common web application vulnerabilities.

## 1. Broken Object Level Authorization (BOLA / IDOR)

- Never query records by ID alone: `prisma.application.findUnique({ where: { id } })` ❌
- Always scope queries to the authenticated user's workspace/tenant:
  `prisma.application.findFirst({ where: { id, workspaceId: session.workspaceId } })` ✅

## 2. Server-Side Request Forgery (SSRF) Guard

When fetching URLs provided by users (e.g. webhooks or link previews):
- Prohibit loopback addresses (`127.0.0.1`, `localhost`, `::1`).
- Prohibit RFC 1918 private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
- Prohibit cloud metadata endpoints (`169.254.169.254`, `metadata.google.internal`).
- Restrict protocols strictly to `http:` and `https:`.

## 3. Cross-Site Scripting (XSS)

- In React, never use `dangerouslySetInnerHTML` without DOMPurify scrubbing.
- Enforce strict Content-Security-Policy (CSP) with `frame-ancestors 'none'` and disallow `unsafe-eval` in production.
