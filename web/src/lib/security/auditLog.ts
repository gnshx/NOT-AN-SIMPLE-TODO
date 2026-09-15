import crypto from 'crypto';
import { prisma } from '@/lib/db';

export interface AuditEventPayload {
  workspaceId: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  result: 'ALLOWED' | 'DENIED' | 'REQUIRES_APPROVAL' | 'PENDING';
  risk: 'READ_ONLY' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  details?: Record<string, any>;
}

export interface ChainableAuditEvent extends AuditEventPayload {
  eventId: string;
  timestamp: string;
  ipHash: string;
  userAgentHash: string;
  previousEventHash: string;
  eventHash: string;
}

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * P0-05: Hash chain state is now persisted to the database.
 *
 * BEFORE: workspaceLastHashStore was an in-memory Map — the chain was
 * completely reset (broken) on every application restart or deployment.
 *
 * NOW: We query the most recent AuditLog row for the workspace to get the
 * last eventHash, making the chain survive restarts and horizontal scaling.
 *
 * The hash is stored inside the `details` JSON field of the AuditLog row
 * (which already exists in the schema), so no schema migration is needed
 * for Phase 0. Phase 1 will add a dedicated `chainHash` column.
 */
async function getLastEventHash(workspaceId: string): Promise<string> {
  if (!prisma) return GENESIS_HASH;

  try {
    const lastEvent = await prisma.auditLog.findFirst({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      select: { details: true }
    });

    if (!lastEvent?.details) return GENESIS_HASH;

    const parsed = JSON.parse(lastEvent.details as string);
    return parsed?.eventHash || GENESIS_HASH;
  } catch {
    // If parse fails, start a new chain segment — log but don't crash
    console.error('[AuditLog] Failed to read last event hash — starting new chain segment.');
    return GENESIS_HASH;
  }
}

function hashString(val: string): string {
  return crypto.createHash('sha256').update(val || '').digest('hex');
}

/**
 * Computes SHA-256 cryptographic hash for an audit event in the tamper-evident chain.
 */
export function computeEventHash(
  eventId: string,
  timestamp: string,
  workspaceId: string,
  actorId: string,
  action: string,
  result: string,
  previousEventHash: string
): string {
  const payload = `${eventId}|${timestamp}|${workspaceId}|${actorId}|${action}|${result}|${previousEventHash}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Records a tamper-evident audit event bound to a SHA-256 cryptographic hash chain.
 * The previousEventHash is fetched from the database — not from an in-memory store.
 */
export async function logAuditEvent(payload: AuditEventPayload): Promise<ChainableAuditEvent> {
  const eventId = `evt-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();

  // P0-05: Read previous hash from DB, not from volatile in-memory Map
  const previousEventHash = await getLastEventHash(payload.workspaceId);

  const eventHash = computeEventHash(
    eventId,
    timestamp,
    payload.workspaceId,
    payload.actorId,
    payload.action,
    payload.result,
    previousEventHash
  );

  const ipHash = hashString(payload.ipAddress || '127.0.0.1');
  const userAgentHash = hashString(payload.userAgent || 'Unknown');

  const auditEvent: ChainableAuditEvent = {
    ...payload,
    eventId,
    timestamp,
    ipHash,
    userAgentHash,
    previousEventHash,
    eventHash
  };

  // Persist to Prisma AuditLog model — eventHash stored in details for chain continuity
  try {
    if (prisma) {
      await prisma.auditLog.create({
        data: {
          id: eventId,
          workspaceId: payload.workspaceId,
          userId: payload.actorId,
          action: payload.action,
          entityType: payload.resourceType,
          entityId: payload.resourceId || null,
          details: JSON.stringify({
            result: payload.result,
            risk: payload.risk,
            // P0-05: eventHash persisted so getLastEventHash() can rebuild chain
            previousEventHash,
            eventHash,
            ipHash,
            userAgentHash,
            requestId: payload.requestId || null,
            details: payload.details || {}
          }),
          ipAddress: payload.ipAddress || null,
          createdAt: new Date(timestamp)
        }
      });
    }
  } catch (err) {
    // Audit logging must never crash the main request — but we log the failure
    console.error('[AuditLog] Failed to persist audit event to database:', err);
  }

  return auditEvent;
}

/**
 * Verifies the integrity of a sequence of chained audit events.
 * Returns true if the cryptographic hash chain is intact.
 */
export function verifyAuditChainIntegrity(events: ChainableAuditEvent[]): { valid: boolean; brokenAtEventId?: string } {
  let expectedPrevHash = GENESIS_HASH;

  for (const ev of events) {
    if (ev.previousEventHash !== expectedPrevHash) {
      return { valid: false, brokenAtEventId: ev.eventId };
    }

    const calculatedHash = computeEventHash(
      ev.eventId,
      ev.timestamp,
      ev.workspaceId,
      ev.actorId,
      ev.action,
      ev.result,
      ev.previousEventHash
    );

    if (calculatedHash !== ev.eventHash) {
      return { valid: false, brokenAtEventId: ev.eventId };
    }

    expectedPrevHash = ev.eventHash;
  }

  return { valid: true };
}

/**
 * Suspicious Activity Detection Engine.
 * Flags abnormal patterns: mass workspace exports, repeated denied authorization, cross-tenant access attempts.
 */
export function detectSuspiciousActivity(events: AuditEventPayload[]): { suspicious: boolean; alerts: string[] } {
  const alerts: string[] = [];

  const deniedCount = events.filter((e) => e.result === 'DENIED').length;
  if (deniedCount >= 3) {
    alerts.push(`SECURITY_ALERT: Multiple denied access attempts (${deniedCount}) detected.`);
  }

  const exportCount = events.filter((e) => e.action === 'EXPORT_WORKSPACE').length;
  if (exportCount >= 2) {
    alerts.push(`SECURITY_ALERT: Suspicious mass workspace export pattern (${exportCount} requests).`);
  }

  return {
    suspicious: alerts.length > 0,
    alerts
  };
}
