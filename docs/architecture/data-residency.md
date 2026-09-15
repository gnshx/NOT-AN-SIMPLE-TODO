# DayNight Pilot — Multi-Region Data Residency & Sovereignty Architecture

## 1. Compliance & Legal Framework
DayNight Pilot is engineered to support global enterprise compliance requirements, ensuring that career intelligence, resume PII, and audit trails remain strictly within the customer's chosen geopolitical boundary.

- **European Union**: GDPR (Regulation EU 2016/679) Article 44–49 (Chapter V cross-border transfer prevention) & Schrems II compliance.
- **United States**: California Consumer Privacy Act (CCPA/CPRA) and HIPAA security rule standards for career/workplace health data.
- **Asia-Pacific**: Australian Privacy Principles (APP 8), Singapore PDPA, and Japanese APPI.

---

## 2. Regional Topology Architecture

```
                                [ Enterprise Tenant DNS ]
                                            │
                                  Cloudflare Global Anycast
                                  (Geo-routing by Workspace)
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
               ▼                            ▼                            ▼
      [ EU Jurisdiction ]          [ US Jurisdiction ]          [ APAC Jurisdiction ]
       Region: eu-central-1         Region: us-east-1            Region: ap-southeast-1
       (Frankfurt, Germany)         (N. Virginia, USA)           (Singapore)
      ────────────────────         ───────────────────          ─────────────────────
       • Next.js Pods               • Next.js Pods               • Next.js Pods
       • PostgreSQL 16 (EU)         • PostgreSQL 16 (US)         • PostgreSQL 16 (APAC)
       • Redis Cluster (EU)         • Redis Cluster (US)         • Redis Cluster (APAC)
       • Encrypted R2 (EU-only)     • Encrypted S3 (US-only)     • Encrypted R2 (APAC)
       • Gemini EU Model Endpoint   • Gemini US Model Endpoint   • Gemini APAC Endpoint
```

---

## 3. Data Tier Isolation Rules

### 3.1 Relational Data (PostgreSQL 16)
- Each organization is assigned a `dataResidencyRegion` at provisioning (`EU` | `US` | `APAC`).
- Database instances are hosted physically within the respective geographic region.
- Cross-region replication is strictly prohibited; backup archives (`scripts/db-backup-restore.sh`) are stored exclusively in region-local WORM object storage.

### 3.2 Unstructured Files & Resumes
- Resumes and generated PDFs are stored in regional S3/R2 buckets.
- Bucket encryption: AES-256 server-side encryption with customer-managed or regional AWS KMS keys.

### 3.3 AI Gateway Regional Routing
- When `workspace.dataResidencyRegion === 'EU'`, the AI Gateway routes inference exclusively to EU-hosted endpoints (e.g. `europe-west4-aiplatform.googleapis.com` or OpenAI EU data processing agreement endpoints).
- Prompts, conversation memories, and tool inputs are marked `no-train` and never cross jurisdiction boundaries.

---

## 4. Tenant Data Migration & Verification
Enterprise customers can request cryptographic data residency certificates. When a tenant requests migration between regions:
1. An async export job is executed (`web/src/lib/exports/exportService.ts`) with SHA-256 tamper-evident integrity proof.
2. The export payload is verified in the target region.
3. The source region records are soft-deleted and subsequently purged via cryptographic erasure after 30 days.
