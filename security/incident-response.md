# DayNight Pilot — Incident Response & Key Rotation Plan

## 1. Incident Severity Definitions

| Severity | Definition & Impact | Response SLA | Examples |
| :--- | :--- | :---: | :--- |
| **SEV-1 (Critical)** | Active cross-tenant data breach, master encryption key compromise, or unauthorized remote code execution. | Immediate (< 15 mins) | Tenant A reading Tenant B records; leaked `ENCRYPTION_MASTER_KEY`; database dump exposure. |
| **SEV-2 (High)** | High-confidence prompt injection bypass leading to unauthorized email sending, or persistent denial of service. | < 1 hour | AI tool executing high-risk action without approval; edge rate limiter failure under attack. |
| **SEV-3 (Medium)** | Localized audit chain mismatch, non-sensitive credential failure, or transient error spike in background worker. | < 4 hours | Single audit log out-of-order hash; webhook delivery retries failing for specific domain. |

---

## 2. 5-Stage Incident Response Workflow

```
DETECTION ──────► CONTAINMENT ──────► ERADICATION ──────► RECOVERY ──────► POST-MORTEM & TEST
```

### 1. Detection
- Edge rate limiter triggers (`429` spike).
- Prompt injection filter alerts (`[SECURITY ALERT] Prompt Injection detected`).
- Audit log hash verification mismatch (`verifyAuditChain()` failure).
- Automated CI security scan failure.

### 2. Containment
- **Session Revocation**: Call `revokeSession(token)` to instantly invalidate compromised tokens.
- **Tenant Isolation**: Suspend suspect workspace or disable integration sync.
- **Circuit Breaker**: Trip circuit breakers (`web/src/lib/circuit.ts`) to halt failing external integrations.
- **IP Blocking**: Add attacker IP addresses to edge blocking policy.

### 3. Eradication
- Identify root-cause code or configuration defect.
- Revoke and rotate compromised credentials (see Key Rotation Runbook below).
- Deploy hotfix via automated CI pipeline.

### 4. Recovery
- Restore data integrity from verified backups if tampering occurred.
- Re-enable circuit breakers and monitor latency and error metrics in OpenTelemetry.
- Validate system readiness via `/api/health/readiness`.

### 5. Post-Mortem & Mandatory Regression Test
- Conduct blameless root-cause analysis within 48 hours.
- **MANDATORY RULE**: Every discovered vulnerability MUST be converted into a permanent regression test in `tests/security/`.

---

## 3. Key Rotation Runbook

### A. Master Encryption Key (`ENCRYPTION_MASTER_KEY`)
1. Generate new 256-bit symmetric key: `openssl rand -hex 32`.
2. Run database migration script to re-encrypt stored OAuth tokens with `keyVersion: 2`.
3. Update environment secret in deployment runtime and redeploy.
4. Verify token decryption test: `npm run test:security`.

### B. OAuth Integration Secrets (Google / Notion)
1. Navigate to Google Cloud Console / Notion Developer Portal.
2. Generate new Client Secret.
3. Update production environment variables (`GOOGLE_CLIENT_SECRET`, `NOTION_API_KEY`).
4. Invalidate existing cached tokens in Redis.

### C. Stripe Webhook Signing Secret (`STRIPE_WEBHOOK_SECRET`)
1. Access Stripe Dashboard -> Developers -> Webhooks.
2. Add new secret alongside existing secret.
3. Deploy update to `STRIPE_WEBHOOK_SECRET`.
4. Delete old webhook signing secret in Stripe Dashboard.
