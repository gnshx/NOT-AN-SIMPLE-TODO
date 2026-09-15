<div align="center">

# ⚡ DayNight Pilot
### **The Security-Engineered AI Career Operations Platform**

> *An intelligent, demonstrably tested operating system that turns fragmented career, application, and work signals into safe actions, decisions, and measurable outcomes.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-Canonical_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![OWASP ASVS](https://img.shields.io/badge/Security-OWASP_ASVS_5.0.0_Aligned-009688?style=for-the-badge)](https://owasp.org/www-project-application-security-verification-standard/)
[![Prompt Injection Defense](https://img.shields.io/badge/AI_Security-50_Case_Benchmark_Active-purple?style=for-the-badge)](security/ai-security.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Executive Summary

**DayNight Pilot** is a production-grade, **security-engineered AI Career & Execution Operating System**. Built for software engineers, career coaches, universities, bootcamps, and recruiting organizations, it unifies career planning, job application tracking, email intelligence, resume multi-versioning, interview preparation, time-blocked daily execution, and career analytics into a single high-performance platform.

Unlike basic CRUD job trackers or decorative AI chatbots, DayNight Pilot treats all external content, AI outputs, integration payloads, and client identifiers as **untrusted**.

```
DISCOVER → ANALYZE → APPLY → TRACK → PREPARE → INTERVIEW → FOLLOW UP → DIAGNOSE → IMPROVE
```

---

## 🔐 Security Architecture & Trust Boundaries

DayNight Pilot enforces security controls at every layer of the execution lifecycle:

```
                ┌──────────────────────┐
                │      INTERNET        │
                └──────────┬───────────┘
                           │
                    UNTRUSTED INPUT
                           │
                           ▼
                ┌──────────────────────┐
                │ Input Validation     │
                │ Rate Limiting (429)  │
                │ Security Headers     │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Authentication       │
                │ Session Validation   │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Tenant Authorization │
                │ Scoped DB Layer      │
                │ RBAC / Permissions   │
                └──────────┬───────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    ┌─────────────────┐         ┌─────────────────┐
    │ Application     │         │ AI Security     │
    │ Services        │         │ Gateway         │
    └────────┬────────┘         └────────┬────────┘
             │                           │
             │                    ┌──────▼───────┐
             │                    │ Tool Policy  │
             │                    │ Risk Engine  │
             │                    └──────┬───────┘
             │                           │
             └─────────────┬─────────────┘
                           ▼
                   ┌───────────────┐
                   │ Audit Logger  │
                   │ (SHA-256 Chain)│
                   └───────┬───────┘
                           ▼
                   ┌───────────────┐
                   │ Canonical DB  │
                   │ Encrypted     │
                   └───────────────┘
```

### Key Architectural Security Guarantees:
1. **AI NEVER Decides Authorization**: AI models can propose tool actions, but CANNOT grant themselves permissions. Server-side policy engine checks role permissions (`OWNER`, `ADMIN`, `MANAGER`, `MEMBER`, `VIEWER`), resource ownership, tool risk level (`READ_ONLY`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and policy settings.
2. **Server-Side Tenant Scoping**: Every database read/write query is strictly bound by `workspaceId: session.workspaceId` via the Scoped Database Access Layer (`scopedDb.ts`), eliminating Broken Object Level Authorization (BOLA).
3. **AES-256-GCM Envelope Encryption**: Sensitive OAuth tokens (Gmail, Notion, Telegram) are encrypted at rest using envelope encryption.
4. **Tamper-Evident Audit Logging**: Audit log events are linked via a SHA-256 cryptographic hash chain (`previousEventHash` $\rightarrow$ `eventHash`), making unauthorized database modifications detectable.
5. **SSRF Guard Protection**: Server-side URL fetching blocks loopback devices (`127.0.0.1`), RFC 1918 private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), AWS metadata endpoints (`169.254.169.254`), and non-standard ports.

---

## 📊 Security Controls & Benchmark Metrics

> Evidence is generated from automated tests. Claims reflect actual implementation, not aspirational targets.
> Last verified: 2026-09-16 · Branch: main

| Metric Category | Control Implemented | Status | Notes |
| :--- | :--- | :---: | :--- |
| **Tenant Isolation** | Scoped DB layer enforces `workspaceId` on every query | ✅ Implemented | Cross-tenant tests in `tests/security/tenancy/` |
| **RBAC Authorization** | 5-role capability matrix, server-side permission checks | ✅ Implemented | Zero frontend-only role checks |
| **Prompt Injection Defense** | 15-category pattern detection, 50-case benchmark | ✅ Implemented | Rate: measured by `runPromptInjectionBenchmark()` |
| **SSRF Protection** | Private IP + cloud metadata endpoint blocking | ✅ Implemented | Loopback, RFC-1918, 169.254.x.x blocked |
| **Rate Limiting** | IP-based, 6 endpoint classes, HTTP 429 + Retry-After | ✅ Implemented | In-memory (Phase 1 upgrades to Redis) |
| **OAuth Token Encryption** | AES-256-GCM envelope encryption | ✅ Implemented | Fail-fast if ENCRYPTION_MASTER_KEY not set in prod |
| **Audit Hash Chain** | SHA-256 chain persisted to database | ✅ Implemented | Chain survives restarts as of P0-05 |
| **Authentication** | Session validation + expiry + revocation | ⚠️ Partial | In-memory store — Phase 1 adds NextAuth.js |
| **Real AI Provider** | Gemini/OpenAI gateway with budget controls | 🔲 Phase 3 | Currently uses mock responses |

Detailed security specifications and threat models are documented in the `/security` directory:
- [System Threat Model](web/security/threat-model.md)
- [Security Controls & ASVS 5.0.0 Mapping](web/security/security-controls.md)
- [Authentication & Capability Model](web/security/auth-model.md)
- [AI Security Boundary & Pilot Tool Firewall](web/security/ai-security.md)
- [Incident Response Plan](web/security/incident-response.md)
- [Data Classification & Privacy Lifecycle](web/security/data-classification.md)
- [Vulnerability & Dependency Management](web/security/vulnerability-management.md)

---

## ⚡ Key Platform Capabilities

### 🧠 1. Agentic AI Pilot & Global Command Palette (`⌘K`)
- **Global Command Menu (`⌘K / Ctrl+K`)**: Fuzzy search across all workspace entities, instant page navigation, and natural language AI commands.
- **Safe Tool Execution Loop**:
  $$\text{AI Request} \longrightarrow \text{Prompt Injection Filter} \longrightarrow \text{Tool Proposal} \longrightarrow \text{Zod Schema Check} \longrightarrow \text{Role Policy} \longrightarrow \text{Human Confirmation} \longrightarrow \text{Execution} \longrightarrow \text{Hash-Chained Audit Log}$$

### 🛡️ 2. Human-in-the-Loop AI Action Review Center
- **Governance Review Queue (`/ai-review`)**: Displays AI-proposed side effects with confidence ratings, rationale summaries, evidence signal traces, and risk levels (`LOW`, `MEDIUM`, `HIGH`).
- **Human Approval Controls**: `Approve Action`, `Edit Payload`, `Reject Action`, `Approve All Safe (>90%)`.

### 🎯 3. Job Intelligence Radar & Match Scoring
- **Multi-Metric Fit Breakdown (`/opportunities`)**: Calculates Skill Match, Experience Fit, Location Match, Salary Alignment, and Overall Fit Score (0–100).
- **Company Trust Scanner**: Evaluates corporate domains, Glassdoor/LinkedIn signals, and red-flag predatory schemes.

### 📄 4. Multi-Version Resume Intelligence Workspace
- **Version Library (`/resume`)**: Manage role-tailored variants (*Backend v2*, *Full Stack v1*, *Google SWE Tailored*).
- **ATS Keyword Analyzer & Bullet Optimizer**: Detects missing keywords and transforms weak bullets into quantifiable impact metrics.

### 🎙️ 5. Interview Center & Interactive AI Mock Coach
- **Stage-by-Stage Prep (`/interviews`)**: HR, Behavioral, Technical, System Design, Coding, and Managerial workspace.
- **AI Simulator Modal**: Interactive mock interview simulator providing multi-dimensional scoring + STAR improvement plan.

### 📅 6. Personal Daily Execution & AI Smart Planner
- **Command Center (`/today`)**: Unified daily hub featuring time-blocked schedule generation, priority task execution, and upcoming interview countdowns.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS, Framer Motion, Lucide Icons, Syne & Plus Jakarta Sans typography.
- **Backend & API**: TypeScript, Next.js Server Actions, Route Handlers, Custom Security Middleware.
- **Database & Storage**: Prisma ORM, SQLite / PostgreSQL, Scoped DB Tenant Access Layer.
- **Security & Cryptography**: AES-256-GCM Envelope Encryption, SHA-256 Tamper-Evident Hash Chains, Pilot Tool Firewall, SSRF Guard.
- **AI Engine**: Gemini 2.5 Flash / OpenAI GPT-4o API, Zod Schema Validation, 15-Category Prompt Injection Benchmark Suite.

---

## 🧪 Automated Testing & Security Verification Suite

Run full automated security verification suite:
```bash
# Execute security test harness
npx ts-node --compiler-options '{"module":"CommonJS"}' src/tests/security/runAllSecurityTests.ts
```

Run Next.js production build:
```bash
cd web
npm run build
```

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
