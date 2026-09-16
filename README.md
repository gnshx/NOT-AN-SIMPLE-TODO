<div align="center">

# ⚡ DayNight Pilot
### **The Zero-Trust, High-Scale AI Career & Operational Intelligence Platform**

> *An enterprise-grade, evidence-driven SaaS operating system that transforms fragmented job signals, career milestones, and application workflows into safe autonomous actions, verified decisions, and measurable outcomes.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6_Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1_PostgreSQL-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Redis](https://img.shields.io/badge/Redis-7.0_Distributed-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![BullMQ](https://img.shields.io/badge/BullMQ-6.3.6_Queues-FF4500?style=for-the-badge)](https://bullmq.io)
[![Stripe](https://img.shields.io/badge/Stripe-SaaS_Billing-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![OWASP ASVS](https://img.shields.io/badge/Security-OWASP_ASVS_5.0_Aligned-009688?style=for-the-badge)](security/asvs-mapping.md)
[![Security Harness](https://img.shields.io/badge/Security_Tests-69%2F69_PASSING_(100%25)-success?style=for-the-badge)](tests/security/)
[![AI Injection Defense](https://img.shields.io/badge/AI_Firewall-100_Case_Benchmark_Active-purple?style=for-the-badge)](evals/)

[Architecture](#-system-architecture--zero-trust-topology) • [Core Capabilities](#-platform-capabilities) • [Security Controls](#-security-engineering--verification-scorecard) • [AI Firewall](#-pilot-tool-firewall--risk-engine) • [Documentation](#-security-documentation-index) • [Quickstart](#-quickstart--local-development)

</div>

---

## 🌟 Executive Overview

**DayNight Pilot** is a security-engineered, multi-tenant career intelligence operating system built for software engineers, career coaches, universities, accelerators, and talent platforms. It unifies career planning, job pipeline tracking, email ingestion, resume multi-versioning, interactive AI mock coaching, daily time-blocked execution, and career analytics into a single high-performance platform.

Unlike decorative chatbots or basic CRUD application trackers, **DayNight Pilot treats all external content, incoming emails, uploaded resumes, model outputs, and client identifiers as untrusted**. Every action runs through cryptographic isolation, schema validation, server-side RBAC, and human-in-the-loop governance.

```
DISCOVER ──► ANALYZE ──► APPLY ──► TRACK ──► PREPARE ──► INTERVIEW ──► FOLLOW UP ──► DIAGNOSE ──► GROW
   │             │          │        │           │           │             │            │         │
   └─────────────┴──────────┴────────┴─────┬─────┴───────────┴─────────────┴────────────┴─────────┘
                                           │
                        AI AGENTIC ORCHESTRATION WITH GOVERNANCE
```

---

## 🏗️ System Architecture & Zero-Trust Topology

DayNight Pilot implements defense-in-depth across the entire network, identity, database, and model execution boundary:

```
                            INTERNET / UNTRUSTED CLIENTS
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │       Next.js Edge Middleware         │
                     │  - Distributed Rate Limiter (Redis)   │
                     │  - Strict CSP (frame-ancestors 'none')│
                     │  - HSTS (2-Year Preload) + Nosniff    │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │  Server-Side Authentication Guard     │
                     │     requireAuthentication()           │
                     │  - HttpOnly, Secure, SameSite Cookies │
                     │  - Immediate Revocation / Expiry      │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │   Centralized Authorization Layer     │
                     │     requireWorkspaceResource()        │
                     │  - 5-Role RBAC (OWNER → VIEWER)       │
                     │  - Compound Org Membership Resolution │
                     └───────────────────┬───────────────────┘
                                         │
                  ┌──────────────────────┴──────────────────────┐
                  ▼                                             ▼
   ┌─────────────────────────────┐               ┌─────────────────────────────┐
   │ Scoped Database Layer       │               │ AI Pilot Security Gateway   │
   │ (ScopedDb)                  │               │                             │
   │ - workspaceId Injected      │               │   1. PII Redaction          │
   │ - Soft-Deletes Filtered     │               │   2. Prompt Injection Filter│
   │ - Composite Indexes         │               │   3. Multi-Model Router     │
   │   PostgreSQL 16 + PgBouncer │               │      (Gemini 2.5 / GPT-4o)  │
   └──────────────┬──────────────┘               └──────────────┬──────────────┘
                  │                                             │
                  ▼                                             ▼
   ┌─────────────────────────────┐               ┌─────────────────────────────┐
   │ Tamper-Evident Audit Chain  │               │ Pilot Tool Firewall         │
   │ - SHA-256 Chaining          │               │ - Strict Zod Schema Whitelist│
   │ - Non-Repudiation Logs      │               │ - 5-Tier Risk Evaluation    │
   │ - DB Persisted & Verifiable │               │ - Human Approval & Step-Up  │
   └─────────────────────────────┘               └─────────────────────────────┘
```

---

## ⚡ Platform Capabilities

### 🧠 1. Agentic AI Pilot & Command Palette (`⌘K`)
- **Global Holographic Menu**: Seamless fuzzy search across applications, opportunities, resumes, and tasks with instantaneous natural language tool actions.
- **Pilot Tool Firewall**: AI proposes tool operations; the server evaluates user session roles, argument schemas, and risk tiers before executing. **AI models can never authorize themselves.**

### 🛡️ 2. Human-in-the-Loop Action Governance (`/ai-review`)
- **Confidence & Evidence Traces**: Displays AI-proposed pipeline changes, status updates, or draft emails alongside extracted confidence scores and raw source signals.
- **Granular Approval States**: `Approve Action`, `Edit Parameters`, `Reject Action`, or policy-based auto-approval for safe `READ_ONLY` or `LOW` risk tasks.

### 🎯 3. Opportunity Radar & Fraud Detection (`/opportunities`)
- **Multi-Vector Fit Breakdown**: Calculates Skill Match, Experience Alignment, Location Fit, Salary Match, and an aggregate Match Score (0–100).
- **Domain Trust Scanner**: Scans company websites, DNS MX records, and hiring patterns to flag scam recruiters and high-risk job posts.

### 📄 4. Multi-Version Resume Intelligence (`/resume`)
- **Targeted Variants**: Maintain role-specialized resumes (*Staff Backend Engineer*, *Full Stack Architect*, *Google SWE Tailored*).
- **ATS Keyword Gap Extraction**: Analyzes uploaded resume text against target job descriptions, surfacing missing skills and quantifiable bullet optimizations.

### 🎙️ 5. Stage-by-Stage Interview Simulator (`/interviews`)
- **Comprehensive Stage Prep**: Behavioral, Technical Coding, Architecture/System Design, and Hiring Manager prep sheets.
- **Interactive AI Mock Coach**: Live interview modal providing real-time evaluation across Communication, Technical Rigor, Structure, Specificity, and Confidence.

### 📅 6. Unified Daily Command Center (`/today`)
- **AI Smart Planner**: Generates realistic time-blocked schedules balancing focus coding, outreach follow-ups, interview practice, and pipeline maintenance.

### 💳 7. Enterprise SaaS Billing & Entitlements
- **State Machine with 14-Day Grace**: Built-in state machine (`BillingStateMachine`) managing `ACTIVE`, `PAST_DUE`, `TRIALING`, and `CANCELED` states with automatic grace periods.
- **Centralized Entitlements**: Capabilities (`canUseFeature`) gated by subscription tier (`FREE`, `PRO`, `TEAM`, `ENTERPRISE`), completely avoiding scattered conditional plan checks.
- **Immutable Metering**: Every token, parse, and mock interview writes an immutable `MeterEvent` record for billing auditing.

---

## 🛡️ Pilot Tool Firewall & Risk Engine

Every tool registered in `TOOL_FIREWALL_REGISTRY` (`web/src/lib/security/aiFirewall.ts`) defines its input schema, required permission, and execution risk level:

| Risk Tier | Registered Tools | Execution Behavior & Policy |
| :---: | :--- | :--- |
| **`READ_ONLY`** | `searchApplications`, `getResume`, `getInterview`, `getCompany` | Auto-executed for authenticated sessions with `view_applications`. |
| **`LOW`** | `createTask`, `updateNotes`, `generateInterviewQuestions` | Auto-executed with audit log recording for `edit_applications`. |
| **`MEDIUM`** | `modifyApplicationStatus`, `modifyResume`, `createFollowupDraft` | Requires confirmation per organization policy. |
| **`HIGH`** | `sendEmail`, `deleteApplication`, `exportWorkspace` | **Requires explicit human confirmation** before execution. |
| **`CRITICAL`** | `changeOwner`, `removeAdmin`, `deleteWorkspace`, `rotateCredentials` | **Requires explicit human confirmation AND step-up authentication.** |

---

## 📊 Security Engineering & Verification Scorecard

> **Evidence-Driven Standard**: Every metric and control below is permanently verified by the automated security test suite.

```
================================================================
🛡️ DAYNIGHT PILOT — COMPREHENSIVE SECURITY REGRESSION SUITE (14/14)
================================================================
SUMMARY: 69 Passed, 0 Failed out of 69 Security Control Tests.
SECURITY VERIFICATION SCORE: 100% Verified Alignment.
================================================================
```

| Security Dimension | Implementation & Technical Controls | Test Suite Path | Verification Status |
| :--- | :--- | :--- | :---: |
| **1. Authentication** | Server guard `requireAuthentication()`, token revocation, secure cookie flags | `tests/security/auth/`, `tests/security/sessions/` | **100% PASS** |
| **2. Multi-Tenant Isolation** | `ScopedDb` forcing `workspaceId` and soft-delete filters on all queries | `tests/security/tenancy/` (11 Scenarios) | **100% PASS** |
| **3. RBAC Authorization** | 5 roles (`OWNER` to `VIEWER`), vertical/horizontal privilege escalation blocks | `tests/security/authorization/` | **100% PASS** |
| **4. BOLA & BFLA Prevention** | Server-side resource ownership validation across all entity IDs | `tests/security/api/bola.test.ts`, `bfla.test.ts` | **100% PASS** |
| **5. AI Tool Firewall** | `TOOL_FIREWALL_REGISTRY`, 14 tools, strict Zod validation, human approval gates | `tests/security/ai/tool-firewall.test.ts` | **100% PASS** |
| **6. Prompt Injection Defense** | 100-case adversarial benchmark (Direct override, delimiters, exfiltration) | `tests/security/ai/prompt-injection.test.ts` | **97.1% Recall / 0% FP** |
| **7. AI Self-Authorization** | AI claims of superuser or owner authorization unconditionally rejected | `tests/security/authorization/ai-self-grant.test.ts` | **100% PASS** |
| **8. SSRF Defense Guard** | Outbound fetch validator blocking Loopback, RFC 1918, Cloud Metadata (`169.254.169.254`) | `tests/security/ssrf/ssrf-guard.test.ts` | **100% PASS** |
| **9. Secrets & Envelope Encryption**| AES-256-GCM encryption at rest, automatic token scrubbing in logs & prompts | `tests/security/oauth/token-protection.test.ts` | **100% PASS** |
| **10. File Upload Security** | 10MB limit, MIME whitelist, magic bytes validation, path traversal sanitization | `tests/security/uploads/upload-security.test.ts` | **100% PASS** |
| **11. Rate Limiting & DoS** | Redis distributed token bucket, HTTP 429 + `Retry-After` headers across 6 rules | `tests/security/rate-limit/rate-limiter.test.ts` | **100% PASS** |
| **12. Security Headers** | CSP (`frame-ancestors 'none'`, no `unsafe-eval`), HSTS 2-year preload, nosniff, DENY | `tests/security/headers/security-headers.test.ts` | **100% PASS** |
| **13. Privacy & PII Redaction** | Automated scrubbing of emails, phones, and API keys before LLM context injection | `tests/security/privacy/pii-redaction.test.ts` | **100% PASS** |
| **14. Cryptographic Audit Chain** | Tamper-evident SHA-256 hash chaining (`previousEventHash` → `eventHash`) with DB sync | `tests/security/audit/hash-chain.test.ts` | **100% PASS** |
| **15. Billing & Entitlements** | Centralized feature gates, 14-day past-due grace period, immutable `MeterEvent` | `tests/security/billing/entitlements.test.ts` | **100% PASS** |

---

## 📚 Security Documentation Index

All architectural specifications, threat models, and operational runbooks are version-controlled in the [`/security`](security/) directory:

- 📊 [**Repository Audit**](security/repository-audit.md): Complete audit of all 28 stack dimensions, Prisma queries, and endpoint auth status.
- 🛡️ [**Threat Model**](security/threat-model.md): Comprehensive STRIDE analysis, trust boundaries, and mitigation matrices.
- ⚙️ [**Security Controls Inventory**](security/security-controls.md): Traceability matrix mapping technical controls to code files and regression tests.
- 🔑 [**Authentication Specification**](security/auth-model.md): Session lifecycle, HttpOnly/Secure/SameSite cookie configuration, and revocation.
- 🔒 [**Authorization & Tenancy Specification**](security/authorization-model.md): 5-role RBAC capability matrix, BOLA/BFLA defenses, and `ScopedDb`.
- 🧠 [**AI Security Architecture**](security/ai-security.md): Pilot Tool Firewall, 5-tier risk matrix, and prompt injection defense benchmarks.
- 🏷️ [**Data Classification & Lifecycle**](security/data-classification.md): 5-tier data classification standard, PII redaction rules, and retention policies.
- 🚨 [**Incident Response & Key Rotation**](security/incident-response.md): Severity definitions (SEV-1 to SEV-3), containment workflows, and runbooks.
- 🔍 [**Vulnerability Management**](security/vulnerability-management.md): Continuous SAST, DAST, dependency scanning, secret detection, and SLA targets.
- 📋 [**OWASP ASVS 5.0 Mapping**](security/asvs-mapping.md): Requirement-by-requirement ASVS 5.0.0 coverage matrix.

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **Python**: v3.12+ (for background tracker scripts)
- **PostgreSQL**: v16+ (or local SQLite fallback)
- **Redis**: v7.x (for distributed rate limiting & BullMQ queues)

### 1. Installation

```bash
# Clone the repository
git clone git@github.com:gnshx/NOT-AN-SIMPLE-TODO.git
cd NOT-AN-SIMPLE-TODO

# Install web dependencies
cd web
npm install

# Setup Python virtual environment
cd ..
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Environment Configuration

Create `web/.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/daynight_pilot?schema=public"

# Master Encryption Key (32-byte hex for AES-256-GCM envelope encryption)
ENCRYPTION_MASTER_KEY="dummy_ephemeral_test_secret_purged"

# Authentication & Sessions
AUTH_SECRET="your-high-entropy-auth-secret-string-here"
NEXTAUTH_URL="http://localhost:3000"

# Redis (Distributed Rate Limiting, Queues & Cache)
REDIS_URL="redis://localhost:6379"

# AI Gateway
GEMINI_API_KEY="your-google-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"

# Stripe Billing
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Run Automated Verification Suites

```bash
# Execute the complete 14-category security regression test suite (69 tests)
cd web
npm run test:security

# Execute the AI Prompt Injection & Evaluation Benchmark
npm run test:evals

# Run Python tenant isolation and eval tests
cd ..
./venv/bin/python test_tenant_isolation.py
./venv/bin/python evals/run_evals.py

# Verify production compilation
cd web
npm run build
```

### 4. Start Development Server

```bash
cd web
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to access the DayNight Pilot dashboard.

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for full legal text.
