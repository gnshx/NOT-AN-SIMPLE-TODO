/**
 * @file db.ts
 * @description Canonical database client wrapper for DayNight Pilot with PgBouncer pooling optimization.
 * Manages Prisma client singleton lifecycle across Next.js hot reloads and injects production connection limits.
 * 
 * @module lib/db
 */

let PrismaClientClass: any = null;

try {
  // Dynamically require @prisma/client to prevent build-time type errors
  const prismaModule = require('@prisma/client');
  PrismaClientClass = prismaModule.PrismaClient;
} catch (e) {
  // Prisma client not yet generated
}

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

/**
 * Normalizes connection URL to ensure connection limits and pool timeouts
 * are configured for transaction-mode PgBouncer pooling in production.
 * 
 * @returns {string | undefined} Normalized connection string with pooling query parameters
 */
function getDatasourceUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // Append connection_limit and pool_timeout if missing for robust connection pooling
  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
    const hasParams = url.includes('?');
    const separator = hasParams ? '&' : '?';
    const additions: string[] = [];

    if (!url.includes('connection_limit=')) {
      additions.push('connection_limit=10');
    }
    if (!url.includes('pool_timeout=')) {
      additions.push('pool_timeout=20');
    }

    if (additions.length > 0) {
      return `${url}${separator}${additions.join('&')}`;
    }
  }

  return url;
}

const datasourceUrl = getDatasourceUrl();

export const prisma =
  globalForPrisma.prisma ??
  (PrismaClientClass
    ? new PrismaClientClass({
        datasourceUrl,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    : null);

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma;

/**
 * Inspects the current database connection configuration for PgBouncer heuristics and pooling metrics.
 * 
 * @returns {{ isConfigured: boolean; isPgBouncer: boolean; poolSize: number; poolTimeoutSeconds: number }}
 */
export function getConnectionPoolInfo() {
  const url = process.env.DATABASE_URL;
  const isPgBouncer = !!url && (url.includes(':6432') || url.includes('pgbouncer=true'));
  return {
    isConfigured: !!prisma,
    isPgBouncer,
    poolSize: 10,
    poolTimeoutSeconds: 20
  };
}
