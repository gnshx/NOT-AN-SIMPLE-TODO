# DayNight Pilot (Web Dashboard) 🌌

A premium, glassmorphic Next.js web application designed to visualize and manage your productivity command center. Powered by Google Gemini and Notion integrations, it provides day planning, task management, job application tracking, scam detection, and AI-powered Gmail intelligence.

---

## ✨ Features

- **📅 Day Planner**: Time-blocked daily schedule with drag-and-drop task ordering and progress tracking.
- **📝 Task Manager**: Full CRUD for tasks with priorities, categories, due dates, subtasks, and recurring schedules.
- **📊 Job Pipeline**: Visual Kanban board for job applications — Applied → Shortlisted → HR → Technical → Managerial → Offer/Rejected.
- **🔬 Gmail Intelligence**: AI-powered email classification that extracts companies, positions, statuses, and interview dates from your inbox.
- **🎯 Smart Reminders**: Multi-tier notifications (7 days, 24h, 12h, 3h, 1h, 15min) for tasks and interviews.
- **🤖 Telegram Bot**: Rich notifications and command interface (`/today`, `/tasks`, `/jobs`, `/interviews`).
- **🎨 Glassmorphic Interface**: High-fidelity brutalist design featuring smooth hover states, dynamic animations via Framer Motion, and a 3D particle sphere.
- **🔌 Zero-Config Demo Mode**: Automatically falls back to high-fidelity mock data if Notion environment variables are not set.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, Turbopack)
- **Runtime**: React 19 / TypeScript
- **Styling**: TailwindCSS & Custom CSS Globals
- **Animations**: Framer Motion
- **Graphics**: Three.js & React Three Fiber (for interactive 3D particle sphere)
- **Charts**: Recharts & Lucide Icons

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
cd web
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the `web/` directory and populate your Notion API details:
```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
To test the optimized production build locally:
```bash
npm run build
npm run start
```

---

## 📱 Dashboard Pages

| Route | Page | Description |
|:---|:---|:---|
| `/` | Dashboard | Overview with stats, activity chart, funnel, and safety scanner |
| `/planner` | Day Planner | Time-blocked daily schedule with drag-and-drop |
| `/tasks` | Tasks | Full task management with priorities, categories, and reminders |
| `/pipeline` | Job Board | Kanban board by application status with drag-and-drop |
| `/hub` | AI Insights | Gmail intelligence, job opportunity radar, and interview prep |

---

## 🔗 Integration

The web dashboard connects to the DayNight Pilot backend via:
- **Notion API**: Tasks and job applications stored in Notion databases
- **Telegram Bot**: Real-time notifications and command interface
- **Gemini AI**: Email classification, scam detection, and interview prep sheets

---

## 📄 License

MIT License — see [LICENSE](../LICENSE) for details.
