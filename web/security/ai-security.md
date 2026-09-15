# DayNight Pilot — AI Security Boundary & Pilot Tool Firewall

## 1. Pilot Tool Firewall Architecture

```
             UNTRUSTED INPUT
                    │
         (Email / Web / Resume / JD)
                    │
                    ▼
          ┌───────────────────┐
          │ Content Sanitizer │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Prompt Injection  │
          │ Detection Engine  │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │  AI Model Proposal│
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Schema Validation │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Authorization     │
          │ Policy Engine     │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │  Risk Engine      │
          └─────────┬─────────┘
                    │
               HIGH/CRITICAL?
                /        \
              YES        NO
               │          │
               ▼          ▼
           HUMAN       Execute
          APPROVAL
```

## 2. Fundamental Principle

> **AI NEVER DECIDES AUTHORIZATION.**
>
> The AI model can propose tool invocation payloads.
> The server-side policy engine checks role permissions, workspace ownership, tool risk levels, and user settings before any execution occurs.
