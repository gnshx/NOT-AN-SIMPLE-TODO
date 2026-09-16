---
name: database-migrations-mastery
description: "Zero-downtime database migrations: safe column addition/removal, high-cardinality indexing, foreign key constraints, connection pooling, and ScopedDb."
category: database
risk: safe
tags: [database, postgres, prisma, migrations, sql]
---

# Zero-Downtime Database Migrations Mastery

Guidelines for evolving relational database schemas without locking tables or dropping active queries.

## 1. The Expand and Contract Pattern

Never rename or drop a column in a single migration while production traffic is active. Use the 3-step pattern:
1. **Expand**: Add the new column (nullable or with default). Deploy application code that reads from old but writes to both.
2. **Backfill**: Run an async migration script to populate data from old column to new column.
3. **Contract**: Update application to read/write only the new column. Once verified, drop the old column.

## 2. High-Performance Indexing

- **Foreign Keys**: Always add indexes on foreign key columns (`workspaceId`, `userId`, `organizationId`) to prevent full table scans during joins and cascade checks.
- **Compound Tenant Indexes**: For tenant queries, use compound indexes: `@@index([workspaceId, createdAt(sort: Desc)])`.

## 3. Connection Pooling

- In serverless/edge environments (Next.js, Vercel, Cloudflare), use connection poolers (PgBouncer, Prisma Accelerate, Supabase Pooler) to avoid exhausting Postgres connection limits (`max_connections`).
