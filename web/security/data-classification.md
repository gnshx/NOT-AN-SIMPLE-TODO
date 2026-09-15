# DayNight Pilot — Data Classification & Privacy Lifecycle

## 1. Classification Matrix

- **PUBLIC**: Job listings, company trust scores.
- **INTERNAL**: Workspace tags, aggregated conversion statistics.
- **CONFIDENTIAL**: Candidate resumes, application timelines, interview prep notes.
- **HIGHLY_CONFIDENTIAL**: Raw email contents, recruiter messages.
- **SECRET**: AES-256-GCM encrypted OAuth access & refresh tokens.

## 2. Privacy Lifecycle

`COLLECT -> CLASSIFY -> ENCRYPT/REDACT -> PROCESS -> RETENTION -> CASCADE WIPE`
