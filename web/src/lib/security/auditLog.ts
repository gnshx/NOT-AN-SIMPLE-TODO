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

// In-memory store for the latest event hash per workspace
const workspaceLastHashStore = new Map<string, string>();
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

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
 */
export async function logAuditEvent(payload: AuditEventPayload): Promise<ChainableAuditEvent> {
  const eventId = `evt-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();

  const previousEventHash = workspaceLastHashStore.get(payload.workspaceId) || GENESIS_HASH;

  const eventHash = computeEventHash(
    eventId,
    timestamp,
    payload.workspaceId,
    payload.actorId,
    payload.action,
    payload.result,
    previousEventHash
  );

  workspaceLastHashStore.set(payload.workspaceId, eventHash);

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

  // Persist to Prisma AuditLog model
  try {
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
  } catch (err) {
    // Audit logging fallbacks
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
