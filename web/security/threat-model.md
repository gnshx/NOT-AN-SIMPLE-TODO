# DayNight Pilot — System Threat Model

## 1. System Overview & Boundaries

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
```

## 2. Identified Threats & Mitigations (STRIDE Matrix)

| Threat | Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **Spoofing** | Impersonating another user session | HttpOnly, Secure, SameSite cookies with short session windows. |
| **Tampering** | Modifying database records or audit logs | Scoped Prisma DB access layer + SHA-256 cryptographic hash chaining for audit logs. |
| **Repudiation** | Denying performed critical actions | Tamper-evident hash chain logging (`previousEventHash` -> `eventHash`). |
| **Information Disclosure** | Cross-tenant data leak or exfiltration | Strict `workspaceId` server-side authorization (`requireWorkspaceResource`) + AES-256-GCM envelope encryption. |
| **Denial of Service** | Resource exhaustion on AI or Auth endpoints | Configurable distributed rate limiting with HTTP `429` & `Retry-After`. |
| **Elevation of Privilege** | Member executing Admin or Owner tools | Server-side RBAC policy engine (`Pilot Tool Firewall`). AI CANNOT decide permissions. |
