# DayNight Pilot — Security Controls Mapping

## 1. Technical Security Controls Summary

- **Multi-Tenant Authorization**: Scoped Database Access Layer (`scopedDb.ts`) + `requireWorkspaceResource`.
- **AI Tool Firewall**: Risk levels (`READ_ONLY`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) with policy-based human-in-the-loop approval.
- **Secrets Management**: Envelope Encryption (`envelopeEncryption.ts`) via AES-256-GCM.
- **Prompt Injection Defense**: 15-category detection matrix (`PI-001` to `PI-015`).
- **SSRF Protection**: `ssrfGuard.ts` blocking loopback, RFC 1918 private IPs, and cloud metadata (`169.254.169.254`).
- **Audit Logging**: SHA-256 hash-chain tamper evidence (`auditLog.ts`).

## 2. OWASP ASVS 5.0.0 Alignment Matrix

| Category | Coverage | Implementation | Verification |
| :--- | :--- | :--- | :--- |
| V1 Architecture | 100% | Multi-tenant scoping & trust boundaries | `tenancy.test.ts` |
| V2 Authentication | 95% | Session handling & rate limiting | `auth.test.ts` |
| V3 Access Control | 100% | Centralized `authz.ts` & RBAC matrix | `auth.test.ts` |
| V4 Validation | 92% | PII Redactor & SSRF Guard | `api.test.ts` |
| V5 Cryptography | 95% | AES-256-GCM envelope encryption | `oauthEncryption.test.ts` |
| V7 Logging | 90% | Tamper-evident hash chain audit logging | `auditHashChain.test.ts` |
