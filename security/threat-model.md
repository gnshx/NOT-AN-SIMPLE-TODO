# DayNight Pilot — System Threat Model

## 1. System Topology & Trust Boundaries

```
                    INTERNET / UNTRUSTED CLIENTS
                               │
                               ▼
                ┌─────────────────────────────┐
                │   Edge Gateway / Middleware │
                │  - Rate Limiting (429)      │
                │  - Security Headers (CSP)   │
                └──────────────┬──────────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
   ┌──────────────────────┐          ┌──────────────────────┐
   │ Next.js Route Engine │          │ Background Worker    │
   │ - requireAuth()      │          │ (BullMQ / Redis)     │
   │ - requireWorkspace() │          │ - Tenant isolation   │
   └──────────┬───────────┘          └──────────┬───────────┘
              │                                 │
              ▼                                 ▼
   ┌──────────────────────┐          ┌──────────────────────┐
   │ Scoped Database Layer│          │ External Integrations│
   │ - ScopedDb           │          │ - Gmail Reader       │
   │ - PostgreSQL 16      │          │ - Stripe Webhooks    │
   └──────────┬───────────┘          └──────────────────────┘
              │
              ▼
   ┌──────────────────────────────────────────┐
   │ AI Pilot Security Boundary               │
   │   Prompt Injection Filter                │
   │              │                           │
   │              ▼                           │
   │      LLM (Gemini / GPT-4o)               │
   │              │                           │
   │              ▼ (Tool Proposals Only)     │
   │   Pilot Tool Firewall                    │
   │    - Schema Validation                   │
   │    - RBAC Authorization                  │
   │    - Risk Engine & Human Gate            │
   │              │                           │
   │              ▼                           │
   │   Controlled Tool Execution              │
   └──────────────────────────────────────────┘
```

---

## 2. Threat Actors & Capabilities

| Actor | Description & Assumed Capabilities | Primary Vectors |
| :--- | :--- | :--- |
| **External Attacker** | Internet-based adversary without valid platform credentials. | Credential stuffing, brute force, DDoS, SSRF, prompt injection via public webhooks or shared links. |
| **Malicious Tenant / Insider** | Authenticated user within Workspace A attempting to breach Workspace B. | Broken Object Level Authorization (BOLA), parameter tampering, mass assignment, cross-tenant API requests. |
| **Compromised AI Agent** | LLM subjected to indirect prompt injection from resumes or untrusted emails. | Tool manipulation, data exfiltration, system prompt extraction, privilege escalation attempts. |
| **Compromised Third-Party** | Malicious or hijacked external webhook provider or OAuth endpoint. | Replay attacks, forged webhook payloads, malformed JSON bodies, open redirects. |

---

## 3. Assets & Sensitivity Classification

| Asset | Classification | Storage Location | Protection Mechanisms |
| :--- | :---: | :--- | :--- |
| **OAuth Tokens (Google/Notion)** | `SECRET` | PostgreSQL / Memory | AES-256-GCM envelope encryption at rest, redacted in logs and AI prompts. |
| **Master Encryption Key** | `SECRET` | Environment variable | Fail-fast resolution; must be >= 32 chars in production. |
| **Candidate Resumes & PII** | `CONFIDENTIAL` | PostgreSQL / Object Store | Workspace isolation (`workspaceId`), PII redaction before LLM prompts. |
| **Job Applications & Notes** | `CONFIDENTIAL` | PostgreSQL | `ScopedDb` enforcement, soft deletion filters (`deletedAt: null`). |
| **Audit Logs** | `CONFIDENTIAL` | PostgreSQL | SHA-256 tamper-evident hash chain (`previousEventHash` -> `eventHash`). |
| **Aggregated Metrics & Funnels** | `INTERNAL` | PostgreSQL / Redis | Scoped to organization ID. |
| **Public Job Descriptions** | `PUBLIC` | PostgreSQL | Public read access, sanitized input schemas. |

---

## 4. STRIDE Threat Matrix & Verified Mitigations

| Category | Threat Scenario | Impact | Mitigation Architecture | Verification Evidence |
| :--- | :--- | :---: | :--- | :--- |
| **Spoofing** | Session token theft or replay; forged client identity headers (`x-user-id`). | High | Server-side session validation via `requireAuthentication()`; client identity headers ignored; HttpOnly/Secure/SameSite=Lax cookies. | `tests/security/sessions/` |
| **Tampering** | In-transit request modification; database record tampering; audit log alteration. | Critical | Strict TLS 1.3; Zod input schemas; SHA-256 cryptographic audit chaining with database persistence. | `tests/security/audit/` |
| **Repudiation** | User denies performing destructive action (e.g. deleting application or changing settings). | Medium | Non-repudiation audit logging recording `actorId`, `workspaceId`, `action`, `timestamp`, and `eventHash`. | `tests/security/audit/` |
| **Information Disclosure** | Cross-tenant data leakage (BOLA); OAuth tokens exposed in telemetry; PII in AI logs. | Critical | `ScopedDb` forcing `workspaceId` checks; AES-256-GCM envelope encryption; automated regex PII redaction. | `tests/security/tenancy/`, `tests/security/privacy/` |
| **Denial of Service** | Resource exhaustion on AI endpoints or APIs via high-concurrency floods. | High | Distributed rate limiter returning HTTP `429 Too Many Requests` with `Retry-After`; AI budget limits. | `tests/security/rate-limit/`, `tests/security/api/` |
| **Elevation of Privilege** | Member user invoking Admin capabilities (BFLA); AI agent self-granting admin privileges. | Critical | Server-side RBAC policy engine (`hasPermission()`); Pilot Tool Firewall; AI output is never authorization. | `tests/security/authorization/`, `tests/security/ai/` |

---

## 5. Trust Boundaries & External Dependencies

1. **Client to Edge Gateway**:
   - Boundary: Public Internet to Next.js Edge Middleware.
   - Mitigations: Rate limiting, CSP, HSTS, frame protection, strict input length validation.

2. **Edge Gateway to Internal Business Logic**:
   - Boundary: Request headers to `requireAuthentication()` and `requireWorkspaceResource()`.
   - Mitigations: Zero trust for client headers; database lookup for active session and organization membership.

3. **Application to Database**:
   - Boundary: `ScopedDb` to PostgreSQL via Prisma ORM.
   - Mitigations: Parameterized queries, automatic workspace scoping, composite indexes, soft-delete filtering.

4. **Application to AI Models**:
   - Boundary: Internal context to external LLM providers (Gemini / OpenAI).
   - Mitigations: PII masking, system prompt confidentiality, prompt injection detection before model invocation.

5. **AI Models to Execution Gateway**:
   - Boundary: Model response payload to tool execution engine.
   - Mitigations: AI proposes tools only; Pilot Tool Firewall validates schema, RBAC permissions, and risk tiers before running any tool.
