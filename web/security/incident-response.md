# DayNight Pilot — Incident Response Plan

## 1. Severity Levels

- **SEV-1 (Critical)**: Active cross-tenant data leak, compromise of encryption key, unauthorized admin privilege escalation.
- **SEV-2 (High)**: High-risk prompt injection bypass, rate limiter degradation, unverified OAuth token access attempt.
- **SEV-3 (Medium)**: Intermittent audit log hash mismatch, localized API rate limit breach.

## 2. Response Workflow

1. **Detection & Alerting**: Suspicious activity engine triggers `SECURITY_ALERT`.
2. **Containment**: Revoke active session tokens, rotate envelope encryption keys, isolate affected workspace.
3. **Eradication**: Patch vulnerability, rerun security test suite (`runAllSecurityTests.ts`).
4. **Recovery & Retrospective**: Restore verified data backup, verify audit hash chain integrity.
