# DayNight Pilot — Data Classification & Lifecycle Policy

## 1. Data Classification Tiers

DayNight Pilot establishes a 5-tier data classification standard. Every data element stored or processed by the platform is assigned to a tier, dictating its encryption, access control, retention, and AI processing constraints.

```
┌─────────────────────────────────────────────────────────┐
│ Level 5: SECRET (OAuth Tokens, Master Keys, Secrets)    │
├─────────────────────────────────────────────────────────┤
│ Level 4: HIGHLY_CONFIDENTIAL (Raw Emails, Messages)     │
├─────────────────────────────────────────────────────────┤
│ Level 3: CONFIDENTIAL (Resumes, Applications, Notes)    │
├─────────────────────────────────────────────────────────┤
│ Level 2: INTERNAL (Funnels, Analytics, Workspace Tags)  │
├─────────────────────────────────────────────────────────┤
│ Level 1: PUBLIC (Company Profiles, Job Descriptions)    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Comprehensive Data Asset Classification Matrix

| Data Asset | Classification | Storage Location | Encryption at Rest | Access Policy | AI Processing Rules | Retention Period |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **OAuth Credentials** | `SECRET` | PostgreSQL | AES-256-GCM Envelope | System backend only | **NEVER** sent to AI models | Until integration disconnect |
| **API Keys & Hashes** | `SECRET` | PostgreSQL | SHA-256 Hash | System backend only | **NEVER** sent to AI models | Until key revocation |
| **Raw Incoming Emails** | `HIGHLY_CONFIDENTIAL`| Redis / Queue | Encrypted at rest | Ingestion worker only | Filtered; PII redacted | 30 days buffer |
| **Candidate Resumes** | `CONFIDENTIAL` | PostgreSQL / S3 | Standard at rest | Workspace members only | PII redacted before prompt | Duration of workspace |
| **Job Applications** | `CONFIDENTIAL` | PostgreSQL | Standard at rest | Workspace members only | Analyzed for matching | Duration of workspace |
| **Audit Logs** | `CONFIDENTIAL` | PostgreSQL | SHA-256 Hash Chain | Admins & Owners only | Never sent to AI | 7 years compliance |
| **AI Memory Items** | `CONFIDENTIAL` | PostgreSQL | Standard at rest | Workspace members only | Scoped to workspace | User managed |
| **Workspace Analytics**| `INTERNAL` | PostgreSQL / Redis | Standard at rest | Workspace members only | Aggregated metrics only | 2 years |
| **Public Job Listings**| `PUBLIC` | PostgreSQL | Standard at rest | Unrestricted read | Full AI parsing | Indefinite / Cache TTL |

---

## 3. AI Data Minimization Policy

Before any payload is submitted to an LLM provider:
1. **PII Masking**: Regular expressions mask email addresses (`[EMAIL_REDACTED]`), phone numbers (`[PHONE_REDACTED]`), and bearer tokens (`[SECRET_REDACTED]`).
2. **Context Pruning**: Only the specific fields necessary for the prompt are included (e.g. only matching skills and bullet points, never applicant physical address or full contact details).
3. **Zero Secret Leakage**: OAuth refresh tokens, API keys, and session cookies are strictly blacklisted from prompt construction templates.

---

## 4. End-to-End Data Lifecycle

```
COLLECT ────────► CLASSIFY ────────► STORE ────────► PROCESS ────────► RETAIN ────────► ARCHIVE ────────► DELETE
(Webhook/Upload)   (Assign Tier)     (Scoped DB)      (AI / Worker)    (Soft Delete)   (Audit Export)    (Hard Purge)
```

1. **Collect**: Validated via strict Zod input schemas; file sizes and MIME types checked.
2. **Classify**: Tagged with classification tier to enforce routing restrictions.
3. **Store**: Persisted with `workspaceId` foreign key and composite index.
4. **Process**: Handled by tenant-aware background workers with execution timeouts.
5. **Retain**: Standard operations use soft deletion (`deletedAt: new Date()`) to enable recovery and audit trails.
6. **Archive**: Cryptographically signed export files (`exportService.ts`) generated on request.
7. **Delete**: Hard delete cascade purges data across database, Redis cache, and audit references upon organization termination.
