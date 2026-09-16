# DayNight Pilot — Technical Security Controls Inventory

This document details the active technical security controls implemented across the DayNight Pilot platform, providing direct file paths and verification test suites.

---

## 1. Authentication & Session Security Controls

| Control ID | Control Description | Implementation File | Verification Test Suite |
| :--- | :--- | :--- | :--- |
| **SEC-AUTH-01** | Server-Side Authentication Guard (`requireAuthentication`) | `web/src/lib/security/auth.ts` | `tests/security/sessions/session-lifecycle.test.ts` |
| **SEC-AUTH-02** | Session Revocation & Invalidation | `web/src/lib/security/auth.ts` | `tests/security/sessions/session-lifecycle.test.ts` |
| **SEC-AUTH-03** | Secure Cookie Attributes (HttpOnly, Secure, SameSite=Lax) | `web/src/lib/security/auth.ts` | `tests/security/sessions/session-lifecycle.test.ts` |
| **SEC-AUTH-04** | Secret Token Masking in Logs | `web/src/lib/security/envelopeEncryption.ts` | `tests/security/oauth/token-protection.test.ts` |
| **SEC-AUTH-05** | Production Guard on Test Session Injections | `web/src/lib/security/auth.ts` | `tests/security/auth/auth-guard.test.ts` |

---

## 2. Multi-Tenant Isolation & Authorization Controls

| Control ID | Control Description | Implementation File | Verification Test Suite |
| :--- | :--- | :--- | :--- |
| **SEC-TEN-01** | Scoped Database Access Layer (`ScopedDb`) | `web/src/lib/security/scopedDb.ts` | `tests/security/tenancy/cross-tenant-read.test.ts` |
| **SEC-TEN-02** | Resource Ownership Validation (`requireWorkspaceResource`) | `web/src/lib/security/authz.ts` | `tests/security/tenancy/cross-tenant-write.test.ts` |
| **SEC-TEN-03** | Soft-Delete Isolation (`deletedAt: null` default filtering) | `web/src/lib/security/scopedDb.ts` | `tests/security/tenancy/cross-tenant-delete.test.ts` |
| **SEC-TEN-04** | 5-Role Capability Model (`hasPermission`) | `web/src/lib/security/rbac.ts` | `tests/security/authorization/role-matrix.test.ts` |
| **SEC-TEN-05** | BOLA / BFLA Prevention | `web/src/lib/security/authz.ts` | `tests/security/api/bola.test.ts`, `bfla.test.ts` |

---

## 3. AI Safety & Tool Execution Controls

| Control ID | Control Description | Implementation File | Verification Test Suite |
| :--- | :--- | :--- | :--- |
| **SEC-AI-01** | Pilot Tool Firewall Registry & Validation Gateway | `web/src/lib/security/aiFirewall.ts` | `tests/security/ai/tool-firewall.test.ts` |
| **SEC-AI-02** | 5-Tier Tool Risk Classification (`READ_ONLY` to `CRITICAL`) | `web/src/lib/security/aiFirewall.ts` | `tests/security/ai/tool-firewall.test.ts` |
| **SEC-AI-03** | Prompt Injection Defense Filter (100-case suite) | `web/src/lib/security/promptInjection.ts` | `tests/security/ai/prompt-injection.test.ts` |
| **SEC-AI-04** | AI Self-Authorization Prevention Rule | `web/src/lib/security/aiFirewall.ts` | `tests/security/authorization/ai-self-grant.test.ts` |
| **SEC-AI-05** | Data Exfiltration Defense & PII Redaction | `web/src/lib/security/dataClassification.ts` | `tests/security/privacy/pii-redaction.test.ts` |

---

## 4. Network, Edge & Data Protection Controls

| Control ID | Control Description | Implementation File | Verification Test Suite |
| :--- | :--- | :--- | :--- |
| **SEC-NET-01** | SSRF Defense Guard (`safeFetchWithSsrfGuard`) | `web/src/lib/security/ssrfGuard.ts` | `tests/security/ssrf/ssrf-guard.test.ts` |
| **SEC-NET-02** | Edge Rate Limiting & 429 Retry-After Headers | `web/src/middleware.ts`, `rateLimiter.ts` | `tests/security/rate-limit/rate-limiter.test.ts` |
| **SEC-NET-03** | Security Headers (CSP, HSTS, X-Content-Type-Options) | `web/src/middleware.ts` | `tests/security/headers/security-headers.test.ts` |
| **SEC-DAT-01** | AES-256-GCM Envelope Encryption for OAuth Credentials | `web/src/lib/security/envelopeEncryption.ts` | `tests/security/oauth/token-protection.test.ts` |
| **SEC-DAT-02** | Tamper-Evident SHA-256 Audit Log Chaining | `web/src/lib/security/auditLog.ts` | `tests/security/audit/hash-chain.test.ts` |
| **SEC-DAT-03** | Server-Side Entitlements & Quota Enforcer | `web/src/lib/billing/entitlements.ts` | `tests/security/billing/entitlements.test.ts` |
| **SEC-DAT-04** | Upload File Validation (MIME sniffing, file size, safe names) | `web/src/lib/security/dataClassification.ts` | `tests/security/uploads/upload-security.test.ts` |
