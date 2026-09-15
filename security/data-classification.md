# DayNight Pilot — Data Classification & Privacy Lifecycle

## 1. Data Classification Levels

- **PUBLIC**: Public job listings, company trust scores.
- **INTERNAL**: Workspace tags, aggregate funnel stats.
- **CONFIDENTIAL**: Candidate resumes, job applications, interview preparation sheets.
- **HIGHLY_CONFIDENTIAL**: Raw email contents, recruiter communications.
- **SECRET**: AES-256-GCM encrypted OAuth tokens, secret encryption keys.

## 2. PII Redaction & Data Minimization

Emails (`[EMAIL_REDACTED]`), phone numbers (`[PHONE_REDACTED]`), and API keys (`[SECRET_REDACTED]`) are masked before data payloads are passed to LLM prompts.
