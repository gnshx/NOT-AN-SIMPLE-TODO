# Antigravity Global Engineering & Design Protocol

This file defines the mandatory engineering, design, and security behaviors enforced across **ALL** projects, directories, and development sessions.

## 1. Security & Zero Key Leaks
- Never commit or hardcode API keys, secrets, or high-entropy tokens into any source file or CI workflow.
- In CI workflows, use dynamic runtime generation: `openssl rand -hex 32` for test keys.
- Always verify `.gitignore` excludes `.env`, `credentials.json`, and `token.json` before pushing.

## 2. Frontend & UI/UX Excellence
- Eliminate AI slop: Build polished, high-contrast interfaces with dark mode depth and micro-interactions.
- Reference installed skills: `ui-ux-pro-max`, `vercel-web-interface-guidelines`, and `shadcn-ui`.
- Always implement loading skeletons, error states, and actionable empty states.

## 3. Resilient Engineering & Architecture
- Enforce Zod validation on all API endpoints.
- Follow systematic root-cause debugging: reproduce before fixing, add regression tests.
- Design for zero-downtime database migrations and graceful process shutdowns.
