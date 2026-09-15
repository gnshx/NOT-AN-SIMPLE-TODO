# DayNight Pilot — Security Engineering Architecture & Verification Index

Welcome to the Security Architecture Index for **DayNight Pilot**.

DayNight Pilot treats all external content, AI outputs, integration payloads, and client identifiers as **untrusted**. This repository contains the complete specification, threat models, security controls, and verification evidence mapping to **OWASP ASVS v5.0.0**.

---

## Security Documentation Structure

| Document | Purpose & Scope |
| :--- | :--- |
| 🛡️ [Threat Model](threat-model.md) | STRIDE threat matrix, attack boundaries, and mitigation controls. |
| ⚙️ [Security Controls](security-controls.md) | Mapping of application security controls to implementation code & tests. |
| 🔑 [Authentication Model](auth-model.md) | Session lifecycle, cookie security, token rotation, and logout invalidation. |
| 🔒 [Authorization Model](authorization-model.md) | Multi-tenant scoping, RBAC capability matrix, and BOLA/BFLA prevention. |
| 🧠 [AI Security Boundary](ai-security.md) | Pilot Tool Firewall, 5-level tool risk classification, and prompt injection defense. |
| 🏷️ [Data Classification](data-classification.md) | Sensitivity classification, PII redaction, and data retention lifecycle. |
| 🚨 [Incident Response Plan](incident-response.md) | Severity levels, containment procedures, key rotation, and breach protocols. |
| 🔍 [Vulnerability Management](vulnerability-management.md) | SAST, DAST, dependency scanning, secret detection, and CI/CD security gate. |
| 📋 [OWASP ASVS 5.0 Mapping](asvs-mapping.md) | Comprehensive requirement-by-requirement ASVS 5.0.0 coverage matrix. |

---

## Automated Security Test Suite

To run the automated security verification harness locally:

```bash
# Run complete automated security test suite
npx ts-node --compiler-options '{"module":"CommonJS"}' tests/security/runAllSecurityTests.ts
```
