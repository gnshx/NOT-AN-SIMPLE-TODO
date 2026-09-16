# ⚡ DayNight Pilot

> **Your AI career copilot.** Track applications automatically, scan job postings for red flags, tailor your resume in seconds, and prep for interviews with an interactive AI coach.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-teal?logo=tailwind-css)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-indigo?logo=prisma)](https://prisma.io)
[![Redis](https://img.shields.io/badge/Redis-Rate_Limits-red?logo=redis)](https://redis.io)
[![Security Tests](https://img.shields.io/badge/Security_Tests-69%2F69_Passing-brightgreen)](tests/security/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Why DayNight Pilot?

Job hunting is messy. You apply to dozens of places, recruiters ghost you, scam postings waste your time, and tracking everything across spreadsheets quickly gets overwhelming.

**DayNight Pilot brings order to the job hunt.** It connects with your inbox to track updates automatically, compares your resume against real job requirements, flags shady companies, and lets you practice realistic mock interviews before the real call.

Best of all: **the AI never takes destructive actions on its own.** It can suggest draft emails or status changes, but you always have the final say before anything is sent or updated.

---

## What It Does

### 📬 Automatic Pipeline Tracking (`/applications`)
- Automatically parses recruiter emails, interview invites, and status updates directly from your inbox.
- Clean Kanban and table views so you always know where you stand with every company.

### 🛡️ Scam & Ghost Post Detection (`/opportunities`)
- Checks company domains, hiring patterns, and job post signals to flag suspicious recruiters or ghost listings.
- Breaks down your match score (skills, experience, and salary alignment) so you know if a role is worth your time.

### 📄 Resume Versioning & ATS Matcher (`/resume`)
- Keep tailored versions of your resume for different roles (e.g., Backend vs. Full-Stack).
- Scans job descriptions to surface missing keywords and suggested bullet improvements.

### 🎙️ Interactive AI Mock Interviews (`/interviews`)
- Practice behavioral, technical coding, and system design questions with an AI coach.
- Get instant, actionable feedback on your clarity, technical depth, structure, and communication.

### 📅 Day & Night Focus Planner (`/today`)
- Builds a realistic daily schedule that balances applications, interview prep, and follow-ups so you stay consistent without burning out.

### 🔒 Human-in-the-Loop Action Queue (`/ai-review`)
- When the AI proposes an action (like sending an email or updating an application status), it queues the task for your review.
- You can approve it with one click, tweak the details, or reject it entirely.

---

## Quickstart (Get Running in 3 Minutes)

### 1. Clone the repository
```bash
git clone https://github.com/gnshx/NOT-AN-SIMPLE-TODO.git
cd NOT-AN-SIMPLE-TODO
```

### 2. Install dependencies
```bash
cd web
npm install
```

### 3. Set up your environment
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

Open `.env` and fill in your values. For local development, here is what the variables look like:

```env
# Database (PostgreSQL or SQLite)
DATABASE_URL="postgresql://user:password@localhost:5432/daynight_pilot?schema=public"

# Application Secrets (Generate with: openssl rand -hex 32)
AUTH_SECRET="<generate-using-openssl-rand-hex-32>"
ENCRYPTION_MASTER_KEY="<generate-using-openssl-rand-hex-32>"
NEXTAUTH_URL="http://localhost:3000"

# Redis (for rate limiting and job queues)
REDIS_URL="redis://localhost:6379"

# AI Gateway (Add at least one key for AI features)
GEMINI_API_KEY="<your-google-gemini-api-key>"
OPENAI_API_KEY="<your-openai-api-key>"

# Stripe (Optional, for billing)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

> **Note on security:** All values shown above and in `.env.example` are dummy placeholders. Never commit your real `.env` file. Both `.gitignore` files are configured to ensure your secrets are never pushed to GitHub.

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Security

DayNight Pilot includes an automated test harness covering security controls, multi-tenant isolation, rate limiting, and prompt injection defense.

```bash
# Run all 69 automated security control tests
npm run test:security

# Run the prompt injection defense benchmark (100 test cases)
npm run test:evals

# Run the production build check
npm run build
```

### Verification Highlights
- **Security Control Tests**: 69 / 69 passing (100%)
- **Prompt Injection Defense**: 97.1% recall against adversarial prompt attacks
- **Multi-Tenant Isolation**: Tested across 11 cross-tenant data leak scenarios

Detailed threat models, runbooks, and audit matrices are available in the [`/security`](security/) directory:
- [Threat Model & Trust Boundaries](security/threat-model.md)
- [Security Controls Inventory](security/security-controls.md)
- [AI Firewall & Governance Rules](security/ai-security.md)
- [Multi-Tenancy & Authorization Model](security/authorization-model.md)
- [Incident Response & Key Rotation](security/incident-response.md)

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, Tailwind CSS v4, Three.js
- **Backend**: Next.js Route Handlers, Prisma ORM
- **Database**: PostgreSQL (with SQLite support for local dev)
- **Queues & Caching**: Redis, BullMQ
- **AI Models**: Google Gemini 2.5 (primary) with OpenAI GPT-4o fallback
- **Payments**: Stripe Subscriptions with grace periods and usage metering

---

## Project Structure

```
├── web/
│   ├── src/
│   │   ├── app/                 # Next.js pages and API routes
│   │   ├── components/          # Reusable UI components
│   │   ├── lib/                 # Core logic (auth, database, security, AI)
│   │   └── types/               # TypeScript interfaces
│   └── package.json
├── security/                    # Threat models, runbooks, and audit docs
├── tests/                       # Security regression and unit test harness
├── evals/                       # AI prompt injection & safety test suite
├── .env.example                 # Example environment template
└── README.md
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.
