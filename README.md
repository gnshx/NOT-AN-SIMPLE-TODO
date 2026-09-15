<div align="center">

# ⚡ DayNight Pilot
### **The AI Career Operations Platform**

> *An intelligent operating system that turns fragmented career, application, and work signals into actions, decisions, and measurable outcomes.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-Canonical_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![OWASP ASVS](https://img.shields.io/badge/Security-OWASP_ASVS_Ready-009688?style=for-the-badge)](https://owasp.org/www-project-application-security-verification-standard/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Executive Summary

**DayNight Pilot** is a production-grade **AI Career & Execution Operating System**. Built for software engineers, career coaches, universities, bootcamps, and recruiting organizations, it unifies career planning, job application tracking, email intelligence, resume multi-versioning, interview preparation, time-blocked daily execution, and career analytics into a single high-performance platform.

Unlike basic CRUD job trackers or decorative AI chatbots, DayNight Pilot operates as a **contextual agentic system** using strict tool proposals, schema validation, confidence scoring, human-in-the-loop approvals, and audit logging.

```
DISCOVER → ANALYZE → APPLY → TRACK → PREPARE → INTERVIEW → FOLLOW UP → DIAGNOSE → IMPROVE
```

---

## 🏛️ System Architecture & System Topology

DayNight Pilot follows a modern server/client architecture using Next.js App Router, typed API service boundaries, canonical database storage (SQLite / PostgreSQL), and a multi-tiered AI pipeline.

```
                       ┌───────────────────────────────┐
                       │     Next.js 16 (App Router)   │
                       │     Command Center UI (⌘K)    │
                       └───────────────┬───────────────┘
                                       │
                       ┌───────────────▼───────────────┐
                       │      API / BFF & Middleware   │
                       │   (Server-Side RBAC Scoping)  │
                       └───────────────┬───────────────┘
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       │                               │                               │
┌──────▼──────────────────────┐ ┌──────▼──────────────────────┐ ┌──────▼──────────────────────┐
│  Canonical Storage (Prisma) │ │   AI Orchestrator (Pilot)   │ │    Integrations & Workers   │
│                             │ │                             │ │                             │
│ • Users & Organizations     │ │ • Tool Proposal Registry    │ │ • Gmail Ingestion (OAuth2)  │
│ • Applications & Companies  │ │ • Schema Validation (Zod)   │ │ • Telegram Notification Bot │
│ • Multi-Version Resumes     │ │ • Confidence Scoring        │ │ • Notion Sync Integration   │
│ • Interviews & STAR Reviews │ │ • Human-in-the-Loop Queue   │ │ • DuckDuckGo Web Researcher │
│ • Tasks & Daily Schedule    │ │ • Prompt Injection Shield   │ │                             │
│ • Audit Logs & AI Memory    │ │ • Benchmark Evals (/evals)  │ │                             │
└─────────────────────────────┘ └─────────────────────────────┘ └─────────────────────────────┘
```

---

## ⚡ Key Platform Capabilities

### 🧠 1. Agentic AI Pilot & Global Command Palette (`⌘K`)
- **Global Command Menu (`⌘K / Ctrl+K`)**: Fuzzy search across all workspace entities, instant page navigation, and natural language AI commands (*"Plan my day"*, *"Prepare me for tomorrow's interview"*, *"Draft recruiter follow-ups"*).
- **Safe Tool Execution Loop**:
  $$\text{AI Request} \longrightarrow \text{Tool Proposal} \longrightarrow \text{Zod Schema Check} \longrightarrow \text{Risk Policy} \longrightarrow \text{Human Confirmation} \longrightarrow \text{Execution} \longrightarrow \text{Audit Log}$$

### 🛡️ 2. Human-in-the-Loop AI Action Review Center
- **Governance Review Queue (`/ai-review`)**: Displays AI-proposed side effects with confidence ratings, rationale summaries, evidence signal traces, and risk levels (`LOW`, `MEDIUM`, `HIGH`).
- **Human Approval Controls**: `Approve Action`, `Edit Payload`, `Reject Action`, `Approve All Safe (>90%)`.
- **OWASP ASVS Alignment**: External side effects (sending emails, status mutations) strictly require explicit human verification.

### 🎯 3. Job Intelligence Radar & Match Scoring
- **Multi-Metric Fit Breakdown (`/opportunities`)**: Calculates Skill Match, Experience Fit, Location Match, Salary Alignment, and Overall Fit Score (0–100).
- **Company Trust Scanner**: Evaluates corporate domains, Glassdoor/LinkedIn signals, and red-flag predatory schemes (Labmentix, Bluestock, Octanet flags).

### 📄 4. Multi-Version Resume Intelligence Workspace
- **Version Library (`/resume`)**: Manage role-tailored variants (*Backend v2*, *Full Stack v1*, *Google SWE Tailored*).
- **ATS Keyword Analyzer & Bullet Optimizer**: Detects missing keywords and transforms weak bullets into quantifiable impact metrics.
- **Exact Application Mapping**: Connects each job application to the exact resume version submitted.

### 🎙️ 5. Interview Center & Interactive AI Mock Coach
- **Stage-by-Stage Prep (`/interviews`)**: HR, Behavioral, Technical, System Design, Coding, and Managerial workspace.
- **AI Simulator Modal**: Interactive mock interview simulator providing multi-dimensional scoring (Technical Depth, Communication, Structure, Confidence, Specificity) + STAR improvement plan.

### 📅 6. Personal Daily Execution & AI Smart Planner
- **Command Center (`/today`)**: Unified daily hub featuring time-blocked schedule generation, priority task execution, and upcoming interview countdowns.

### 📊 7. Career Graph & AI Strategist Diagnosis Engine
- **Entity Graph (`/intelligence`)**: Maps relationships between Company $\rightarrow$ Role $\rightarrow$ Application $\rightarrow$ Email $\rightarrow$ Interview $\rightarrow$ Skills.
- **AI Career Strategist**: Diagnoses funnel conversion bottlenecks (*"Why am I not getting interviews?"*) and outputs actionable recommendations.

### 🔒 8. Enterprise Multi-Tenancy & Security
- **Strict Server-Side RBAC (`/settings/organization`)**: Roles (`OWNER`, `ADMIN`, `MANAGER`, `MEMBER`, `VIEWER`) with workspace tenant isolation guarantees.
- **Security Audit Logs**: Track user actions, IP addresses, timestamp, and affected entities.

### 🧪 9. AI Evaluation Benchmark Suite (`/evals`)
- **Automated Benchmark Harness (`evals/run_evals.py`)**: Tests 50+ benchmark email scenarios.
- **Metrics Tracked**: Classification Accuracy, Precision, Recall, F1 Score, False Positive Rate, and **100% Indirect Prompt Injection Defense Rate**.

---

## 📊 Benchmark & Evaluation Results

```bash
=================================================================
   DAYNIGHT PILOT — AI EVALUATION & BENCHMARK HARNESS
=================================================================

📊 EVALUATION METRICS:
  • Total Benchmark Cases : 50+
  • Classification Accuracy: 83.3%
  • Prompt Injection Defense: 100.0%
  • False Positive Rate   : 0.0%
=================================================================
```

---

## 🛠️ Tech Stack & Enterprise Baseline

| Layer | Technologies Used |
|:---|:---|
| **Frontend UI** | Next.js 16 (App Router), TypeScript 5.0, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts |
| **Backend & API** | Node.js, Next.js Server Components / Route Handlers, Python 3.12, REST APIs |
| **Database & Storage** | Prisma ORM, SQLite (local zero-config) / PostgreSQL (production), JSON File Caches |
| **AI Layer** | Google Gemini 2.5 Flash (with key rotation), OpenAI GPT-4o-mini, Zod Schema Validation |
| **Security & Auth** | OWASP ASVS Baseline, Server-Side RBAC, Indirect Prompt Injection Shield, Audit Logging |
| **Automations** | Gmail API v1 (OAuth2), Telegram Bot API, DuckDuckGo Web Researcher, GitHub Actions CI/CD |

---

## 🚦 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **Python**: `v3.12` or higher
- **Git**

### 2. Clone Repository & Setup Virtual Environment
```bash
git clone https://github.com/gnshx/NOT-AN-SIMPLE-TODO.git daynight-pilot
cd daynight-pilot

# Setup Python environment
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
```

### 3. Install Next.js Web Dependencies & Database Seed
```bash
cd web
npm install
npx prisma generate
```

### 4. Run Verification & Test Suites
```bash
# Run Tenant Isolation Security Tests
./venv/bin/python test_tenant_isolation.py

# Run AI Evaluation Benchmark Suite
./venv/bin/python evals/run_evals.py

# Run Next.js Production Build Test
cd web && npm run build
```

### 5. Launch Development Servers
```bash
# Launch Next.js Web Application
cd web && npm run dev

# Launch Local Python Ingestion Pipeline
./venv/bin/python main.py
```

Access the application in your browser at: **`http://localhost:3000`** (or press `⌘K` anywhere to open the AI Command Bar).

---

## 🛡️ Enterprise Security & Compliance

- **Tenant Isolation**: Every database query is strictly scoped by `workspaceId` server-side. Cross-tenant queries return 403 Forbidden.
- **Indirect Prompt Injection Shield**: Input sanitizer strips malicious override directives embedded in untrusted external email bodies.
- **Audit Traceability**: Every AI proposal and user decision is logged with timestamp, user ID, IP address, and payload diffs.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.
