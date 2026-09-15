# DayNight Pilot — System Threat Model

## 1. System Topology & Trust Boundaries

```
                    INTERNET / UNTRUSTED
                             │
            ┌────────────────▼────────────────┐
            │      Next.js Edge Gateway       │
            │ (Rate Limiting, Security Headers)│
            └────────────────┬────────────────┘
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
            Database        AI        Integrations
          (PostgreSQL)  (Gemini)   (Gmail/Notion)
                           │
                    ┌──────▼──────┐
                    │Tool Firewall│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │Policy Engine│
                    └─────────────┘
```

## 2. STRIDE Threat Matrix & Mitigations

| Threat | Vulnerability | Severity | Mitigation Strategy | Test Verification |
| :--- | :--- | :---: | :--- | :--- |
| **Spoofing** | Session token theft | HIGH | HttpOnly, Secure, SameSite=Lax cookies + short session windows. | `tests/security/auth/session.test.ts` |
| **Tampering** | Database record tampering / Audit deletion | CRITICAL | Scoped DB layer + SHA-256 cryptographic hash chain for audit events. | `tests/security/audit/hashChain.test.ts` |
| **Repudiation** | User denying destructive action | MEDIUM | Tamper-evident hash chain logging (`previousEventHash` -> `eventHash`). | `tests/security/audit/hashChain.test.ts` |
| **Information Disclosure** | Cross-tenant data leak / Exfiltration | CRITICAL | Server-side `workspaceId` scoping (`requireWorkspaceResource`) + AES-256-GCM envelope encryption. | `tests/security/tenancy/cross-tenant-read.test.ts` |
| **Denial of Service** | AI & API Endpoint exhaustion | HIGH | Distributed rate limiting returning HTTP `429 Too Many Requests` with `Retry-After`. | `tests/security/api/resource-consumption.test.ts` |
| **Elevation of Privilege** | Member executing Admin tools / AI self-granting | CRITICAL | Server-side RBAC policy engine (`Pilot Tool Firewall`). AI CANNOT decide permissions. | `tests/security/ai/tool-firewall.test.ts` |
