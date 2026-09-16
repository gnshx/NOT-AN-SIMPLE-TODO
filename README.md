<div align="center">

# ⚡ DayNight Pilot
### **The Autonomous Career Intelligence & Operational Execution Platform**

*Transforming fragmented job search signals, candidate pipelines, and career milestones into safe autonomous actions, verified decisions, and measurable outcomes.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6_Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL_16-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Redis](https://img.shields.io/badge/Redis-Distributed_Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![BullMQ](https://img.shields.io/badge/BullMQ-Background_Queues-FF4500?style=for-the-badge)](https://bullmq.io)
[![OWASP ASVS](https://img.shields.io/badge/Security-OWASP_ASVS_5.0-009688?style=for-the-badge)](security/asvs-mapping.md)
[![Security Harness](https://img.shields.io/badge/Security_Tests-69%2F69_Passing_(100%25)-success?style=for-the-badge)](tests/security/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

[Platform Architecture](#-system-architecture) • [Core Capabilities](#-platform-capabilities) • [Zero-Trust Security](#-zero-trust-security--ai-firewall) • [Quickstart](#-quickstart--local-development) • [Verification Suite](#-verification-scorecard) • [Documentation](#-security--architecture-specifications)

</div>

---

## 🌐 The Paradigm Shift

Modern job hunting is plagued by asymmetric information: opaque Applicant Tracking Systems (ATS), rampant ghost job postings, predatory recruitment scams, and fragmented application tracking across disjointed spreadsheets.

**DayNight Pilot** is an open-source, enterprise-grade operational copilot engineered to reverse this asymmetry. It continuously ingests email signals, analyzes company domain trustworthiness, extracts semantic ATS alignment gaps, conducts stage-specific AI mock interviews, and structures daily focus blocks.

Crucially, DayNight Pilot operates under a **Zero-Trust AI Execution Model**: model outputs and external signals are treated as untrusted inputs. High-risk operations (such as sending emails or modifying applications) require explicit human authorization, backed by cryptographic audit ledgers.

```
INGEST ──────► DETECT ──────► ALIGN ──────► TRACK ──────► PREPARE ──────► EXECUTE
  │              │              │             │             │               │
Gmail Webhooks   Domain Trust   ATS Keyword   Kanban / DB   AI Simulator    Daily Time
& Inbound Email  & Fraud Radar  Optimization  Sync Engine   & Mock Coach    Block Engine
  │              │              │             │             │               │
  └──────────────┴──────────────┴──────┬──────┴─────────────┴───────────────┘
                                       ▼
                     HUMAN-IN-THE-LOOP TOOL FIREWALL
```

---

## 🏗️ System Architecture

DayNight Pilot enforces defense-in-depth across client, edge middleware, identity, data isolation, and AI runtime boundaries:

```
                            INTERNET / UNTRUSTED CLIENTS
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │       Next.js Edge Middleware         │
                     │  - Distributed Token Bucket (Redis)   │
                     │  - Strict CSP (frame-ancestors 'none')│
                     │  - HSTS (2-Year Preload) + Nosniff    │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │  Server-Side Authentication Guard     │
                     │     requireAuthentication()           │
                     │  - HttpOnly, Secure, SameSite Cookies │
                     │  - Server-Side Session Revocation     │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │   Centralized Authorization Layer     │
                     │     requireWorkspaceResource()        │
                     │  - 5-Tier RBAC (OWNER → VIEWER)       │
                     │  - Strict BOLA & BFLA Isolation       │
                     └───────────────────┬───────────────────┘
                                         │
                  ┌──────────────────────┴──────────────────────┐
                  ▼                                             ▼
   ┌─────────────────────────────┐               ┌─────────────────────────────┐
   │ Multi-Tenant Scoped DB      │               │ Pilot AI Gateway            │
   │ (ScopedDb Wrapper)          │               │ - Automated PII Redaction   │
   │ - workspaceId Auto-Injected │               │ - Adversarial Filter (97%)  │
   │ - Soft-Deletes Filtered     │               │ - Multi-Model Router        │
   │ - PostgreSQL 16 + PgBouncer │               │   (Gemini 2.5 & GPT-4o)     │
   └──────────────┬──────────────┘               └──────────────┬──────────────┘
                  │                                             │
                  ▼                                             ▼
   ┌─────────────────────────────┐               ┌─────────────────────────────┐
   │ Tamper-Evident Audit Chain  │               │ Pilot Tool Firewall         │
   │ - SHA-256 Hash Chaining     │               │ - Strict Zod Schemas        │
   │ - Non-Repudiation Logging   │               │ - 5-Tier Risk Classification│
   │ - Verifiable DB Ledger      │               │ - Human-in-the-Loop Signoff │
   └─────────────────────────────┘               └─────────────────────────────┘
```

---

## ⚡ Platform Capabilities

### 📬 1. Event-Driven Application Pipeline (`/pipeline`)
- **Zero-Touch Ingestion**: Ingests and parses recruiter communications, interview invites, and status updates directly from connected inboxes.
- **Bi-Directional Views**: Seamlessly switch between a high-density Kanban board and an analytical data table with instant status filters.
- **Company Identity Synthesis**: Automatic company avatar generation and domain resolution.

### 🛡️ 2. Opportunity Radar & Fraud Detection (`/opportunities`)
- **Domain Trust Scanner**: Evaluates hiring companies against DNS MX records, known phishing signatures, and posting velocity to identify suspicious listings.
- **Multi-Vector Fit Breakdown**: Computes granular alignment scores across Skill Match, Experience Level, Geographic/Remote Fit, and Target Salary.

### 📄 3. Multi-Target Resume Intelligence (`/resume`)
- **Role-Specialized Variants**: Manage multiple tailored resumes (e.g., *Staff Backend*, *Distributed Systems Architect*, *Full-Stack Lead*).
- **ATS Semantic Gap Extractor**: Compares resume copy against job descriptions to pinpoint missing competencies and recommend quantifiable metric enhancements.

### 🎙️ 4. Stage-Aware AI Mock Coach (`/interviews`)
- **Full Interview Lifecycle**: Dedicated preparation workflows for Behavioral (STAR method), Technical Coding, System Architecture, and Executive rounds.
- **Real-Time Evaluation**: Objective scoring across Communication Clarity, Technical Rigor, Analytical Structure, and Confidence.

### 📅 5. Day & Night Focus Planner (`/today`)
- **Algorithmic Schedule Generation**: Constructs balanced, time-blocked daily routines dividing focus hours between high-leverage applications, interview prep, and rest.

### 🔒 6. Human-in-the-Loop Action Firewall (`/ai-review`)
- **Action Approval Queue**: Proactive AI suggestions (e.g., status mutations, follow-up drafts) are staged in a queue.
- **One-Click Governance**: Users can approve, modify parameters, or reject proposals. Models possess zero direct execution authority.

---

## 🛡️ Zero-Trust Security & AI Firewall

Every tool executable by the AI engine is registered in `TOOL_FIREWALL_REGISTRY` (`web/src/lib/security/aiFirewall.ts`) and subject to strict governance:

| Risk Tier | Registered Tools | Execution Policy & Verification |
| :---: | :--- | :--- |
| **`READ_ONLY`** | `searchApplications`, `getResume`, `getInterview`, `getCompany` | Auto-executed for authenticated sessions with `view_applications`. |
| **`LOW`** | `createTask`, `updateNotes`, `generateInterviewQuestions` | Auto-executed with audit log recording for `edit_applications`. |
| **`MEDIUM`** | `modifyApplicationStatus`, `modifyResume`, `createFollowupDraft` | Requires workspace policy evaluation and user notification. |
| **`HIGH`** | `sendEmail`, `deleteApplication`, `exportWorkspace` | **Requires explicit human approval** in `/ai-review` before execution. |
| **`CRITICAL`** | `changeOwner`, `removeAdmin`, `deleteWorkspace`, `rotateCredentials` | **Requires explicit human approval AND step-up re-authentication.** |

---

## 📊 Verification Scorecard

Every security claim, architectural boundary, and data control is backed by automated regression tests:

```
================================================================
🛡️ DAYNIGHT PILOT — AUTOMATED REGRESSION SUITE (14/14 DOMAINS)
================================================================
SUMMARY: 69 Passed, 0 Failed out of 69 Security Control Tests.
SECURITY VERIFICATION SCORE: 100% Verified Alignment.
================================================================
```

| Security Dimension | Technical Controls | Test Suite Path | Status |
| :--- | :--- | :--- | :---: |
| **Authentication** | Server guard `requireAuthentication()`, token revocation, secure cookie flags | `tests/security/auth/` | **100% PASS** |
| **Multi-Tenancy** | `ScopedDb` forcing `workspaceId` and soft-delete filters on all queries | `tests/security/tenancy/` (11 Scenarios) | **100% PASS** |
| **RBAC Authorization** | 5 roles (`OWNER` to `VIEWER`), vertical/horizontal privilege escalation blocks | `tests/security/authorization/` | **100% PASS** |
| **BOLA & BFLA Defense** | Server-side resource ownership validation across all entity IDs | `tests/security/api/` | **100% PASS** |
| **AI Tool Firewall** | `TOOL_FIREWALL_REGISTRY`, 14 tools, strict Zod validation, human approval gates | `tests/security/ai/tool-firewall.test.ts` | **100% PASS** |
| **Prompt Injection** | 100-case adversarial benchmark (Direct override, delimiters, exfiltration) | `tests/security/ai/prompt-injection.test.ts` | **97.1% Recall / 0% FP** |
| **SSRF Defense** | Outbound fetch validator blocking Loopback, RFC 1918, Cloud Metadata | `tests/security/ssrf/ssrf-guard.test.ts` | **100% PASS** |
| **Envelope Encryption**| AES-256-GCM encryption at rest, automatic token scrubbing in logs & prompts | `tests/security/oauth/token-protection.test.ts` | **100% PASS** |
| **File Upload Security** | 10MB limit, MIME whitelist, magic bytes verification, path sanitization | `tests/security/uploads/upload-security.test.ts` | **100% PASS** |
| **Rate Limiting & DoS** | Redis distributed token bucket, HTTP 429 + `Retry-After` headers across 6 rules | `tests/security/rate-limit/rate-limiter.test.ts` | **100% PASS** |
| **Security Headers** | CSP (`frame-ancestors 'none'`, no `unsafe-eval`), HSTS 2-year preload, nosniff | `tests/security/headers/security-headers.test.ts` | **100% PASS** |
| **PII Redaction** | Automated scrubbing of emails, phones, and API keys before LLM context injection | `tests/security/privacy/pii-redaction.test.ts` | **100% PASS** |
| **Audit Ledger** | Tamper-evident SHA-256 hash chaining (`previousEventHash` → `eventHash`) | `tests/security/audit/hash-chain.test.ts` | **100% PASS** |
| **Billing & Quotas** | Centralized feature entitlement gating, 14-day grace period, immutable metering | `tests/security/billing/entitlements.test.ts` | **100% PASS** |

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **PostgreSQL**: v16+ (or local SQLite fallback)
- **Redis**: v7.x (for distributed rate limiting & background queues)

### 1. Clone & Install
```bash
git clone https://github.com/gnshx/NOT-AN-SIMPLE-TODO.git
cd NOT-AN-SIMPLE-TODO/web
npm install
```

### 2. Configure Environment
Copy `.env.example` to create your local `.env`:
```bash
cp ../.env.example .env
```

Set the required local development variables (all placeholders are safe dummy values):
```env
# Database (PostgreSQL or local SQLite)
DATABASE_URL="postgresql://user:password@localhost:5432/daynight_pilot?schema=public"

# Cryptographic Keys (Generate with: openssl rand -hex 32)
AUTH_SECRET="<generate-using-openssl-rand-hex-32>"
ENCRYPTION_MASTER_KEY="<generate-using-openssl-rand-hex-32>"
NEXTAUTH_URL="http://localhost:3000"

# Redis Cache & Queues
REDIS_URL="redis://localhost:6379"

# AI Gateway (Add at least one key for AI features)
GEMINI_API_KEY="<your-google-gemini-api-key>"
OPENAI_API_KEY="<your-openai-api-key>"

# Stripe SaaS Billing (Optional in local dev)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

> **Security Guarantee**: All example variables above and in `.env.example` are strictly dummy placeholders. Neither `.env` nor credentials are ever committed to source control.

### 3. Run Automated Verifications
```bash
# Execute the complete 14-domain security regression suite (69 tests)
npm run test:security

# Execute the AI adversarial prompt injection benchmark
npm run test:evals

# Run the production build check (compiles all 36 routes)
npm run build
```

### 4. Launch Local Development Server
```bash
npm run dev
```
Navigate to **[http://localhost:3000](http://localhost:3000)** to view the live dashboard.

---

## 📚 Security & Architecture Specifications

Complete architectural specifications, threat models, and operational runbooks are version-controlled in the [`/security`](security/) directory:

- 📊 [**Repository Audit**](security/repository-audit.md): Comprehensive inventory of all 28 stack dimensions and endpoint security statuses.
- 🛡️ [**Threat Model**](security/threat-model.md): Detailed STRIDE matrix, trust boundaries, and mitigation controls.
- ⚙️ [**Security Controls Inventory**](security/security-controls.md): Traceability matrix mapping technical controls directly to code and tests.
- 🔑 [**Authentication Specification**](security/auth-model.md): Session lifecycle, secure cookie flags, and token revocation mechanisms.
- 🔒 [**Authorization & Tenancy**](security/authorization-model.md): 5-role RBAC capability matrix, BOLA/BFLA defenses, and `ScopedDb`.
- 🧠 [**AI Security Architecture**](security/ai-security.md): Pilot Tool Firewall, 5-tier risk taxonomy, and prompt injection defense benchmarks.
- 🏷️ [**Data Classification & Retention**](security/data-classification.md): 5-tier data classification standard, PII redaction rules, and retention lifecycles.
- 🚨 [**Incident Response Runbook**](security/incident-response.md): Severity definitions (SEV-1 to SEV-3), containment workflows, and key rotation procedures.
- 🔍 [**Vulnerability Management**](security/vulnerability-management.md): Continuous SAST, DAST, dependency scanning, and remediation SLA targets.
- 📋 [**OWASP ASVS 5.0 Mapping**](security/asvs-mapping.md): Requirement-by-requirement ASVS 5.0.0 coverage matrix.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org) | Hybrid SSR/SSG runtime with Turbopack compilation |
| **Frontend UI** | [React 19](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com) | Modern reactive interfaces with glassmorphic tokens |
| **3D & Animation** | [Three.js](https://threejs.org) + [Framer Motion](https://www.framer.com/motion/) | Interactive spatial WebGL visuals and micro-interactions |
| **Database & ORM** | [PostgreSQL 16](https://www.postgresql.org) + [Prisma 6.4](https://prisma.io) | Relational multi-tenant persistence with connection pooling |
| **State & Queues** | [Redis 7.0](https://redis.io) + [BullMQ](https://bullmq.io) | Distributed rate limiting, session cache, and background workers |
| **AI Gateway** | [Google Gemini 2.5](https://aistudio.google.com) / [OpenAI GPT-4o](https://openai.com) | Multi-model routing with automated PII scrubbing |
| **Monetization** | [Stripe API](https://stripe.com) | Subscription state machine, 14-day grace period, usage metering |
| **Observability** | [OpenTelemetry](https://opentelemetry.io) + [Pino](https://github.com/pinojs/pino) | Structured logging and distributed tracing |

---

## 👥 Contributing & Community

We welcome contributions from engineers across distributed systems, security, frontend design, and AI alignment.

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Ensure all test suites pass**:
   ```bash
   cd web && npm run test:security && npm run test:evals && npm run build
   ```
3. **Submit a Pull Request** using conventional commit formatting (`feat:`, `fix:`, `docs:`, `perf:`).

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for full legal text.
