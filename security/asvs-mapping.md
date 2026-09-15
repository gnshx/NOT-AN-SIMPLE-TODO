# DayNight Pilot — OWASP ASVS v5.0.0 Coverage Mapping

| Requirement ID | Description | Implementation File | Verification Test | Status |
| :--- | :--- | :--- | :--- | :---: |
| **V1.1** | Trust boundary definition | `security/threat-model.md` | Architectural Inspection | ✅ Verified |
| **V2.1** | Session handling | `web/src/lib/security/auth.ts` | `tests/security/auth/session.test.ts` | ✅ Verified |
| **V3.1** | Multi-tenant isolation | `web/src/lib/security/authz.ts` | `tests/security/tenancy/cross-tenant-read.test.ts` | ✅ Verified |
| **V3.2** | Role permissions | `web/src/lib/security/rbac.ts` | `tests/security/auth/session.test.ts` | ✅ Verified |
| **V4.1** | Input validation & SSRF | `web/src/lib/security/ssrfGuard.ts` | `tests/security/api/ssrf.test.ts` | ✅ Verified |
| **V5.1** | Envelope encryption | `web/src/lib/security/envelopeEncryption.ts` | `tests/security/oauth/token-protection.test.ts` | ✅ Verified |
| **V7.1** | Audit hash chaining | `web/src/lib/security/auditLog.ts` | `tests/security/audit/hashChain.test.ts` | ✅ Verified |
| **V13.1**| Rate limiting | `web/src/lib/security/rateLimiter.ts` | `tests/security/api/resource-consumption.test.ts` | ✅ Verified |
