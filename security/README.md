# DayNight Pilot — Security Engineering Architecture & Verification Index

Welcome to the Security Architecture & Production Engineering Index for **DayNight Pilot**.

DayNight Pilot treats all external content, AI outputs, third-party integration payloads, and client-supplied identifiers as **untrusted**. This directory contains the complete technical specifications, threat models, security controls, and verification matrices underpinning the platform's multi-tenant isolation, AI firewall, and defense-in-depth architecture.

---

## 1. Security Documentation Inventory

| Document | Purpose & Architectural Scope | Primary Code Mappings |
| :--- | :--- | :--- |
| 📊 [Repository Audit](repository-audit.md) | Comprehensive audit of all 28 stack dimensions, Prisma queries, and endpoint auth status. | Full repository, `web/src/` |
| 🛡️ [Threat Model](threat-model.md) | STRIDE analysis, system topology, trust boundaries, and mitigation matrices. | `web/src/middleware.ts`, `aiFirewall.ts` |
| ⚙️ [Security Controls](security-controls.md) | Granular inventory of technical security controls mapped to source code and tests. | `web/src/lib/security/` |
| 🔑 [Authentication Model](auth-model.md) | Session lifecycle, HttpOnly cookie configuration, token rotation, and invalidation. | `web/src/lib/security/auth.ts` |
| 🔒 [Authorization Model](authorization-model.md) | 5-Role RBAC model (`OWNER` to `VIEWER`), BOLA/BFLA prevention, and `ScopedDb`. | `web/src/lib/security/rbac.ts`, `scopedDb.ts` |
| 🧠 [AI Security Architecture](ai-security.md) | Pilot Tool Firewall, 5-tier tool risk classification, and prompt injection defense. | `web/src/lib/security/aiFirewall.ts` |
| 🏷️ [Data Classification](data-classification.md) | 5-tier sensitivity model, PII redaction rules, and data lifecycle management. | `web/src/lib/security/dataClassification.ts` |
| 🚨 [Incident Response Plan](incident-response.md) | Severity definitions (SEV-1 to SEV-3), containment workflows, and key rotation. | `web/src/lib/security/auditLog.ts` |
| 🔍 [Vulnerability Management](vulnerability-management.md) | SAST, DAST, dependency scanning, Gitleaks secrets scanning, and CI/CD gates. | `.github/workflows/security.yml` |

---

## 2. Core Security Guarantees

1. **Server-Side Authorization Authority**:
   No client-supplied `userId`, `workspaceId`, `role`, or permissions are trusted. All security decisions are evaluated server-side in `web/src/lib/security/authz.ts` and enforced via `ScopedDb`.

2. **Immutable Multi-Tenant Isolation**:
   100% of tenant data queries bind `workspaceId` and verify membership. Cross-tenant access attempts are rejected with 403 Forbidden and logged as security events.

3. **AI Trust Boundary & Gateway**:
   AI models **never** authorize themselves. The AI model only proposes tool calls. Every tool proposal is validated against the centralized `TOOL_FIREWALL_REGISTRY` for schema compliance, role permissions, and risk level before execution.

4. **Tamper-Evident Audit Logging**:
   All administrative, destructive, and sensitive actions generate audit events chained with SHA-256 cryptographic hashes (`previousEventHash` -> `eventHash`). The chain state is persisted in PostgreSQL and verifiable on demand.

5. **Envelope Encryption for Secrets**:
   OAuth refresh tokens and sensitive credentials are encrypted at rest using AES-256-GCM. Tokens are automatically redacted from logs, traces, and AI prompt contexts.

---

## 3. Running the Security Test Suite

The security regression test suite runs across 14 specialized domains:

```bash
# Execute the complete automated security test harness
cd web && npm run test:security

# Execute prompt injection evaluations
cd web && npm run test:evals

# Run Python tenant isolation tests
./venv/bin/python test_tenant_isolation.py
```
