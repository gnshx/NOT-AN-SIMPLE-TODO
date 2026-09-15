# DayNight Pilot — SOC 2 Type II Compliance & Evidence Collection Architecture

## 1. Scope & Trust Services Criteria (TSC)
This document outlines the operational security controls and automated evidence extraction procedures for DayNight Pilot across the AICPA Trust Services Criteria:
- **Security (Common Criteria)**
- **Confidentiality**
- **Availability**

---

## 2. Control Matrix & Evidence Mapping

| Control ID | Trust Criteria | Control Description | Verification Mechanism |
|---|---|---|---|
| **CTL-01** | **CC6.1 / CC6.2** (Access Control) | Tenant isolation & RBAC enforcement across all REST endpoints | `tests/security/runAllSecurityTests.ts` (Tests ST-01 through ST-03, ST-11) |
| **CTL-02** | **CC6.6 / CC6.7** (Encryption at Rest) | Sensitive tokens (OAuth refresh/access) encrypted via AES-256-GCM | `web/src/lib/security/envelopeEncryption.ts` & ST-23 |
| **CTL-03** | **CC6.6** (Encryption in Transit) | All external communication enforced over TLS 1.3 with HSTS | Next.js security headers in `middleware.ts` & CSP policy |
| **CTL-04** | **CC7.1 / CC7.2** (Vulnerability Mgmt) | Automated dependency audit & secret leak detection in CI | GitHub Actions CI (`gitleaks`, `npm audit --audit-level=critical`) |
| **CTL-05** | **CC8.1** (Change Management) | Peer-reviewed commits, CI test enforcement before production merge | Protected branches on `origin/main` with mandatory CI gates |
| **CTL-06** | **A1.2** (Disaster Recovery) | Automated encrypted database backups with quarterly recovery drills | `scripts/db-backup-restore.sh` & `docs/operations/backup.md` |
| **CTL-07** | **C1.1 / C1.2** (Audit Integrity) | Tamper-evident cryptographic hash chain on all administrative actions | `web/src/app/api/v1/audit/export/route.ts` & ST-10 |

---

## 3. Automated Evidence Collection
The SRE and Compliance teams run the automated evidence collection script to generate an audit-ready package for external auditors:

```bash
./scripts/soc2-evidence-collector.sh
```

The script outputs a signed JSON bundle containing git commit history, security test results, dependency audit reports, and encryption verification checks.
