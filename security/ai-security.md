# DayNight Pilot — AI Security Gateway & Pilot Tool Firewall

## 1. AI Trust Boundaries

Untrusted Sources:
- Scraped Webpages
- Candidate Resumes
- Job Descriptions
- Incoming Emails
- RAG Retrieved Documents
- Tool Execution Outputs

## 2. Fundamental Principle

> **AI Models CANNOT Authorize Themselves.**
>
> The AI model proposes tool invocation payloads. The server-side policy engine evaluates user permissions, tool risk levels, and workspace ownership before execution.

## 3. Tool Risk Matrix

| Risk Level | Tool Examples | Behavior / Requirement |
| :--- | :--- | :--- |
| `READ_ONLY` | `searchApplications`, `getResume`, `getInterview` | Auto-allowed for authorized role |
| `LOW` | `createTask`, `updateNotes`, `generateInterviewQuestions` | Auto-allowed with audit record |
| `MEDIUM` | `modifyApplicationStatus`, `modifyResume`, `createFollowupDraft` | Requires confirmation per policy |
| `HIGH` | `sendEmail`, `deleteApplication`, `exportWorkspace` | Requires explicit human approval |
| `CRITICAL` | `changeOwner`, `removeAdmin`, `deleteWorkspace` | Requires step-up authentication |
