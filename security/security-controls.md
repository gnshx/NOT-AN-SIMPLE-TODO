# DayNight Pilot — Security Controls Mapping

## Technical Security Controls Inventory

1. **Multi-Tenant Isolation Control**:
   - Implementation: `web/src/lib/security/scopedDb.ts` & `authz.ts`.
   - Verification: `tests/security/tenancy/cross-tenant-read.test.ts`.

2. **Role-Based Access Control (RBAC)**:
   - Implementation: `web/src/lib/security/rbac.ts`.
   - Verification: `tests/security/auth/session.test.ts`.

3. **Pilot Tool Firewall Control**:
   - Implementation: `web/src/lib/security/aiFirewall.ts`.
   - Verification: `tests/security/ai/tool-firewall.test.ts`.

4. **Prompt Injection Defense Control**:
   - Implementation: `web/src/lib/security/promptInjection.ts`.
   - Verification: `tests/security/ai/prompt-injection.test.ts`.

5. **Secrets & OAuth Encryption Control**:
   - Implementation: `web/src/lib/security/envelopeEncryption.ts`.
   - Verification: `tests/security/oauth/token-protection.test.ts`.

6. **SSRF Protection Control**:
   - Implementation: `web/src/lib/security/ssrfGuard.ts`.
   - Verification: `tests/security/api/ssrf.test.ts`.

7. **Tamper-Evident Audit Logging Control**:
   - Implementation: `web/src/lib/security/auditLog.ts`.
   - Verification: `tests/security/audit/hashChain.test.ts`.
