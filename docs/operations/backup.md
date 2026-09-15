# DayNight Pilot — Production Database Backup & Disaster Recovery Runbook

## 1. Objectives & Metrics
- **RPO (Recovery Point Objective)**: 
  - Free & Pro Tiers: 24 hours
  - Team & Enterprise Tiers: 1 hour (via WAL archiving / Point-In-Time-Recovery)
- **RTO (Recovery Time Objective)**: 
  - Standard Recovery: < 4 hours
  - High-Availability Failover (Stage C+): < 30 minutes
- **Retention Policy**:
  - Daily full backups: retained for 30 days
  - Weekly snapshots: retained for 12 weeks
  - Monthly archives: retained for 7 years (compliance & audit requirements)

---

## 2. Backup Architecture
All database backups are automated via scheduled cron/Kubernetes CronJob using `pg_dump` with AES-256 encryption before offsite storage in multi-region object storage (e.g., AWS S3 with Glacier Lifecycle / Cloudflare R2).

```
PostgreSQL 16 Primary (Port 5432)
       │
       ├── [Hourly] Continuous WAL Archiving (pg_receivewal → Encrypted S3)
       │
       └── [Daily 02:00 UTC] Full Logical Dump (pg_dump)
                 │
                 ▼
         gzip compression (Level 9)
                 │
                 ▼
         AES-256-CBC Encryption (using rotating BACKUP_ENCRYPTION_KEY)
                 │
                 ▼
         SHA-256 Checksum generation
                 │
                 ▼
     Multi-Region Cloud Storage (Object Lock / WORM enabled)
```

---

## 3. Automated Backup Script

Location: `scripts/db-backup-restore.sh`

### Executing a Manual Backup
```bash
# Set required environment variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/daynight"
export BACKUP_ENCRYPTION_KEY="<32-byte-hex-secret>"
export BACKUP_DIR="./backups"

# Run backup
./scripts/db-backup-restore.sh backup
```

### Backup Output Structure
```
backups/
├── 2026-09-16_020000_daynight.sql.gz.enc
├── 2026-09-16_020000_daynight.sql.gz.enc.sha256
└── backup.log
```

---

## 4. Disaster Recovery & Restore Procedure

### Step 1: Verification
Verify the backup file integrity and SHA-256 signature before touching any database:
```bash
sha256sum -c backups/2026-09-16_020000_daynight.sql.gz.enc.sha256
```

### Step 2: Decrypt and Decompress
```bash
openssl enc -d -aes-256-cbc -pbkdf2 \
  -in backups/2026-09-16_020000_daynight.sql.gz.enc \
  -out /tmp/restore_daynight.sql.gz \
  -pass pass:"$BACKUP_ENCRYPTION_KEY"

gunzip /tmp/restore_daynight.sql.gz
```

### Step 3: Target Database Provisioning
Ensure a clean target schema or fresh staging instance:
```bash
dropdb -h $DB_HOST -U postgres --if-exists daynight_staging
createdb -h $DB_HOST -U postgres daynight_staging
```

### Step 4: Execute Restoration
```bash
psql -h $DB_HOST -U postgres -d daynight_staging -f /tmp/restore_daynight.sql
```

### Step 5: Verification of Restored Data
Run the verification check script to ensure zero record loss:
```bash
psql -h $DB_HOST -U postgres -d daynight_staging -c "
  SELECT 'Users' as table_name, count(*) from \"User\"
  UNION ALL
  SELECT 'Applications', count(*) from \"Application\"
  UNION ALL
  SELECT 'AuditLogs', count(*) from \"AuditLog\"
  UNION ALL
  SELECT 'UsageEvents', count(*) from \"UsageEvent\";
"
```

---

## 5. Automated Quarterly Drill Schedule
Every 90 days, the SRE team automatically spins up an isolated sandbox PostgreSQL cluster, executes the restore script with the latest snapshot, executes the automated security test suite (`npm run test:security`) and data consistency checks, and logs results in SOC 2 evidence records.
