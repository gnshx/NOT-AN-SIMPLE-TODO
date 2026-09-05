<div align="center">

# ⚡ DayNight Pilot

### Your Personal Command Center for Tasks, Schedule, and Job Applications

**Day planner • Kanban task management • Gmail AI intelligence • Smart reminders • Telegram notifications — all in one place.**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Notion](https://img.shields.io/badge/Notion-Database-000000?style=for-the-badge&logo=notion&logoColor=white)](https://notion.so)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://core.telegram.org/bots)
[![Next.js](https://img.shields.io/badge/Dashboard-Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## TL;DR

DayNight Pilot is a **smart productivity and job application tracker**. It combines a day planner, task management, job application Kanban, Gmail AI intelligence, and Telegram notifications into one unified command center. AI monitors your Gmail inbox, classifies job-related emails, extracts application status, and updates your pipeline automatically — with confidence scoring and user confirmation for uncertain actions.

No more scattered spreadsheets. No more manually updating application status. One dashboard for your entire productivity life.

---

## The Problem

You're managing:
- Daily tasks and to-dos across multiple tools
- Job applications spread across LinkedIn, Internshala, email, and company portals
- Interview schedules, follow-ups, and deadlines
- Gmail flooded with confirmations, OAs, rejections, and offers

Switching between apps, updating spreadsheets, and manually tracking status wastes hours every week. By the time you update your tracker, you've already missed prep time for interviews.

**DayNight Pilot solves this by unifying your tasks, schedule, and job applications in one intelligent system.**

---

## Key Features

| Feature | Detail |
|:---|:---|
| **Day Planner** | Time-blocked daily schedule with priorities, drag-and-drop ordering, and progress tracking. |
| **Task Management** | Create, edit, delete tasks with due dates, priorities, categories, subtasks, and recurring schedules. |
| **Job Application Kanban** | Visual pipeline: Applied → Shortlisted → HR Round → Technical → Managerial → Offer/Rejected. Drag-and-drop updates. |
| **Gmail AI Intelligence** | Gemini 2.5 Flash reads your inbox, classifies job emails, extracts company/position/status/interview dates automatically. |
| **Confidence-Based Updates** | AI classification includes confidence scores. High-confidence updates apply automatically; uncertain ones require your confirmation. |
| **Scam Risk Detection** | Web-researches new companies via DuckDuckGo + Gemini analysis. Flags High / Medium / Low risk with explainable notes. |
| **Smart Reminders** | Multi-tier reminders per task: 7 days, 24 hours, 12 hours, 3 hours, 1 hour, 15 minutes before deadlines. |
| **Telegram Bot** | Rich HTML notifications for task reminders, interview alerts, application updates, and daily summaries. |
| **Telegram Commands** | `/today`, `/tasks`, `/jobs`, `/interviews`, `/done`, `/remind` — control your command center from your phone. |
| **Next.js Dashboard** | Cinematic dark-mode UI with day planner, Kanban board, task list, funnel chart, activity timeline, and real-time stats. |
| **Notion Sync** | Auto-creates and upserts rows with deduplication. Tasks and job applications synced bidirectionally. |
| **Fully Cloud Automated** | GitHub Actions runs the pipeline every 3 hours — no local machine, no VPS, no cost. |
| **Local Scheduler** | `python scheduler.py` for local/offline runs with the same pipeline. |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DayNight Pilot Pipeline                     │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│  Gmail Inbox │  Gemini AI   │  Web Research│  Notion Database  │
│  (OAuth2)    │  (2.5 Flash) │  (DuckDuckGo)│  (Tasks + Jobs)   │
│   ▼          │   ▼          │   ▼          │   ▼               │
│ gmail_reader │ email_       │ company_     │ notion_updater    │
│              │ classifier   │ researcher   │                   │
└──────┬───────┴──────┬──────┴──────┬──────┴────────┬──────────┘
       │              │             │               │
       └──────────────┴─────────────┴───────────────┘
                          ▼
                 telegram_notifier (HTML alerts)
                          ▼
                 email_history (processed cache)
                          ▼
              ┌─────────────────────────┐
              │  GitHub Actions / Local │
              │  Scheduler (3 hours)    │
              └─────────────────────────┘
                          ▼
              ┌─────────────────────────┐
              │  Next.js Dashboard      │
              │  (Planner, Kanban, Funnel)│
              └─────────────────────────┘
```

### Data Flow

1. **Ingest** — `gmail_reader.py` fetches latest inbox messages via Gmail API v1 (OAuth2).
2. **Classify** — `status_classifier.py` sends email text to Gemini 2.5 Flash with structured system prompts. Falls back to keyword rules if rate-limited.
3. **Research** — `company_researcher.py` runs DuckDuckGo searches for scam signals and interview prep. Gemini synthesizes results into structured JSON.
4. **Confirm** — High-confidence updates apply automatically. Uncertain emails surface as suggestions with [Confirm] [Edit] [Ignore] actions.
5. **Persist** — `notion_updater.py` upserts tasks and job applications with deduplication via email IDs and Company+Role matching.
6. **Notify** — `telegram_notifier.py` sends formatted HTML alerts for new applications, status changes, reminders, and daily summaries.
7. **Mark Done** — `email_history.py` persists processed Gmail IDs to prevent re-processing.

---

## Core Modules

### Day Planner & Tasks
- Time-blocked daily schedule
- Drag-and-drop task ordering
- Priorities, categories, tags, subtasks
- Recurring tasks with customizable reminder schedules
- Progress tracking with visual bars

### Job Application Tracker
- Visual Kanban pipeline with 8 stages
- Company, position, application date, job URL, recruiter contact
- Interview dates, follow-up dates, notes
- Activity timeline per application
- Drag-and-drop status updates synced to Notion

### Gmail Intelligence
- Google OAuth2 secure authentication
- AI email classification into: JOB_APPLICATION, APPLICATION_RECEIVED, REJECTED, SHORTLISTED, INTERVIEW_INVITATION, OFFER, RECRUITER_CONTACT, FOLLOW_UP, OTHER
- Structured extraction: company, position, status, interview date, location, source
- Confidence scoring with automatic or manual confirmation
- Activity timeline auto-generated from email history

### Smart Reminders
- Multi-tier notification system per task
- Presets: Normal, Important, Critical, Custom
- Telegram delivery with rich formatting
- Interview prep alerts with company research

### Telegram Bot
- Rich HTML notifications with emoji and formatting
- Commands: `/today`, `/tasks`, `/jobs`, `/interviews`, `/done`, `/remind`
- Daily summary reports
- Run summaries with metrics

---

## Quick Start

### Prerequisites

- **Python 3.12+**
- **Git**
- **Google Account** (Gmail to monitor)
- **Notion account** ([notion.so](https://notion.so))
- **Telegram account**

### 1. Clone

```bash
git clone https://github.com/chaitanyakumarAI/AI-Internship-Tracker.git
cd AI-Internship-Tracker
```

### 2. Install

```bash
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. API Keys

| Service | How |
|:---|:---|
| **Gemini AI** (free) | [aistudio.google.com](https://aistudio.google.com) → Get API Key |
| **Notion** | [notion.so/my-integrations](https://www.notion.so/my-integrations) → New Integration → copy token |
| **Telegram Bot** | @BotFather → `/newbot` → copy token. Chat ID from @userinfobot |
| **Gmail OAuth** | Google Cloud Console → enable Gmail API → OAuth Desktop Client → download `credentials.json` |

### 4. Environment

```bash
cp .env.example .env
```

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSy...
TELEGRAM_BOT_TOKEN=123456789:AAxxxxxx
TELEGRAM_CHAT_ID=123456789
```

### 5. Notion Database

```bash
python setup_notion_db.py
```

Then open Notion → your new database → **•••** → **Connect to** → select your integration.

**Or create manually** with these properties:

**Tasks Table:**
| Property | Type | Notes |
|:---|:---|:---|
| Title | Title | Task name |
| Status | Select | Todo, In Progress, Done, Blocked |
| Priority | Select | Low, Medium, High, Critical |
| Due Date | Date | |
| Category | Select | Work, Study, Personal, Job Search |
| Subtasks | Text | |
| Notes | Text | |
| Last Updated | Date | |

**Job Applications Table:**
| Property | Type | Notes |
|:---|:---|:---|
| Company | Title | Primary field |
| Role | Text | |
| Status | Select | Applied, Shortlisted, HR Round, Technical Round, Managerial Round, Offer, Rejected |
| Email ID | Text | Deduplication key |
| Sender | Text | |
| Subject | Text | |
| Date Received | Date | |
| OA Link | URL | |
| Interview Date | Date | |
| Follow-up Date | Date | |
| Notes | Text | AI reasoning + `[eid:xxxx]` prefix |
| Last Updated | Date | |
| Scam Risk | Select | High, Medium, Low |
| Risk Notes | Text | AI scam analysis |
| Prep Sheet | Text | Interview prep content |

### 6. First Run (Gmail Auth)

```bash
python main.py
```

First run opens a browser for Google OAuth consent. After approval, `token.json` is cached automatically.

### 7. Verify

```bash
python test_setup.py
```

---

## Usage

### Local Scheduler

```bash
# Run every 3 hours indefinitely
python scheduler.py

# One-shot run
python scheduler.py --once
```

### CLI Dashboard

```bash
python dashboard.py            # Full dashboard
python dashboard.py --compact  # One-line summary
python dashboard.py --json     # JSON output
```

---

## Web Dashboard

A cinematic dark-mode Next.js 15 dashboard lives in `/web`.

```bash
cd web
npm install
npm run dev
# → http://localhost:3000
```

Create `web/.env.local` for Notion credentials:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Pages

| Route | Page | Description |
|:---|:---|:---|
| `/` | Dashboard | Today's tasks, job pipeline, stats, notifications |
| `/planner` | Day Planner | Time-blocked daily schedule with drag-and-drop |
| `/tasks` | Task Manager | Full task CRUD with priorities, categories, reminders |
| `/pipeline` | Job Board | Kanban board by status with drag-and-drop |
| `/hub` | AI Insights | Gmail intelligence, job opportunities, prep sheets |

### Dashboard Features

- **Day Planner** — Time-blocked schedule with task ordering and progress tracking
- **Task Manager** — Create, edit, delete, prioritize, categorize, set reminders
- **Kanban Board** — Drag-and-drop job application pipeline synced to Notion
- **Activity Timeline** — Monthly application volume and task completion chart
- **Funnel View** — Applied → Shortlisted → HR → Technical → Managerial → Offer pipeline
- **Safety Scanner** — 3D particle visualization + scam risk flags + trust score
- **Filter Pills** — Quick-filter by status with animated counters

---

## CI/CD — GitHub Actions (Recommended)

Runs automatically in the cloud every 3 hours for free.

### Setup

1. Fork / push to GitHub
2. Repo → **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

| Secret | Source |
|:---|:---|
| `NOTION_API_KEY` | Notion integration token |
| `NOTION_DATABASE_ID` | From Notion DB URL |
| `GEMINI_API_KEY` | Google AI Studio |
| `TELEGRAM_BOT_TOKEN` | @BotFather |
| `TELEGRAM_CHAT_ID` | @userinfobot |
| `GMAIL_CREDENTIALS_JSON` | Full contents of `credentials.json` |
| `GMAIL_TOKEN_JSON` | Full contents of `token.json` (from first run) |

4. Done. The workflow in `.github/workflows/tracker.yml` runs every 3 hours.

**Manual trigger:** Actions tab → **DayNight Pilot** → **Run workflow**

---

## Project Structure

```
AI-Internship-Tracker/
├── main.py                 # Pipeline orchestrator (Gmail → AI → Notion → Telegram)
├── scheduler.py            # Recurring 3-hour local scheduler
├── gmail_reader.py         # Gmail OAuth2 + email fetching & parsing
├── email_classifier.py     # Gemini AI + keyword fallback + multi-key rotation
├── company_researcher.py   # DuckDuckGo + Gemini scam analysis + interview prep
├── notion_updater.py       # Notion DB upsert with deduplication
├── telegram_notifier.py    # Rich HTML Telegram message builder & sender
├── email_history.py        # Processed email cache (prevents re-processing)
├── dashboard.py            # CLI dashboard (full / compact / JSON)
├── config.py               # Env vars, logging, constants, validation
├── utils.py                # Retry, HTML parsing, hashing, truncation
│
├── setup_notion_db.py      # Auto-creates Notion database schema
├── test_setup.py           # Smoke test for environment setup
├── test_integration.py     # Full integration test suite
│
├── web/                    # Next.js 15 dashboard
│   ├── src/app/
│   │   ├── page.tsx        # Dashboard (stats, activity, funnel, scanner)
│   │   ├── planner/page.tsx # Day planner with time blocks
│   │   ├── tasks/page.tsx  # Task manager with CRUD
│   │   ├── pipeline/page.tsx # Kanban board (drag-and-drop)
│   │   ├── hub/page.tsx    # AI Insights / job opportunity radar
│   │   └── api/            # Next.js API routes (Notion proxy)
│   ├── src/components/     # Sidebar, JobCard, StatCard, ActivityChart, ParticleSphere
│   └── package.json
│
├── .github/workflows/
│   └── tracker.yml          # GitHub Actions (every 3 hours)
│
├── data/
│   └── processed_emails.json # Dedup cache
│
├── logs/
│   └── tracker.log           # Structured JSON logs
│
├── requirements.txt
├── .env.example
├── .gitignore
└── LICENSE
```

---

## Engineering Highlights

### Resilience

- **Multi-key Gemini rotation** — rotates across comma-separated API keys on 429 / quota errors.
- **Keyword fallback classifier** — 50+ regex patterns for rejection, offer, interview, OA, applied, under-review detection. Activate when Gemini is unavailable.
- **Retry with exponential backoff** — decorator-based retry on all I/O (Gmail, Notion, Telegram, web search).
- **Graceful degradation** — if Notion is unconfigured, classification still runs and logs to stdout.

### Correctness

- **Deduplication at two levels** — exact email-ID match in Notes, then Company+Role fuzzy match.
- **Validation layer** — Unknown company / role / status blocks Notion insertion.
- **Confidence scoring** — Gemini returns 0-100 confidence; <70 auto-flags "Needs Review".
- **Structured logging** — JSON-line logs to `logs/tracker.log` with timestamps, levels, and module names.

### Security

- **OAuth2 only** — never stores Gmail password; token cached in `token.json` (gitignored).
- **Secrets via env** — all API keys in `.env` or GitHub Secrets; never hardcoded.
- **Read-only Gmail scope** — `https://www.googleapis.com/auth/gmail.readonly`.
- **No external data exfil** — company research sends only search queries, not email content.

---

## Testing

```bash
# Environment smoke test
python test_setup.py

# Full integration test suite
python test_integration.py

# Reprocess last 100 emails (wipe cache first)
python reprocess.py
```

---

## Troubleshooting

| Problem | Solution |
|:---|:---|
| **Browser doesn't open on first run** | Run from a local terminal (not SSH). Gmail OAuth requires a visible browser. |
| **`invalid_grant` Gmail error** | Token expired — re-run `python main.py` to re-authenticate, then update `GMAIL_TOKEN_JSON` in GitHub Secrets. |
| **Notion 404 / unauthorized** | Verify `NOTION_DATABASE_ID`. In Notion, open DB → **•••** → **Connect to** → select your integration. |
| **No Telegram messages** | Test: `python -c "import telegram_notifier; telegram_notifier.send_message('test')"` |
| **Gemini 429 rate limit** | Normal — keyword fallback activates automatically. Add more keys (comma-separated) to `GEMINI_API_KEY`. |
| **All emails show `Unknown`** | Gemini may be down — check [status.cloud.google.com](https://status.cloud.google.com). Keyword fallback runs automatically. |
| **GitHub Action fails** | Verify all 7 secrets are set. Check **Actions → failed run → logs** for the exact error. |

---

## Contributing

Pull requests are welcome.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## Roadmap

- [ ] Day planner with time-blocking and drag-and-drop
- [ ] Full task management with subtasks, recurring tasks, and categories
- [ ] Job application Kanban with 8-stage pipeline
- [ ] Gmail AI classification with confidence-based confirmation flow
- [ ] Smart multi-tier reminder system
- [ ] Telegram command interface (`/today`, `/tasks`, `/jobs`, `/interviews`)
- [ ] Activity timeline per application
- [ ] AI assistant for daily planning and interview prep
- [ ] Support for more job platforms (Naukri, Wellfound, Lever, Greenhouse)
- [ ] Resume version tracking per application
- [ ] Follow-up reminder scheduler
- [ ] Email template suggestions for outreach
- [ ] Multi-user support (team / club tracking)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built to automate the most tedious parts of productivity and job hunting.**

If DayNight Pilot helped you land an internship or boosted your productivity, please ⭐ **star the repo** — it helps others find it.

[⭐ Star on GitHub](https://github.com/chaitanyakumarAI/AI-Internship-Tracker) &nbsp;·&nbsp; [🐛 Report a Bug](https://github.com/chaitanyakumarAI/AI-Internship-Tracker/issues) &nbsp;·&nbsp; [💡 Request a Feature](https://github.com/chaitanyakumarAI/AI-Internship-Tracker/issues)

</div>
