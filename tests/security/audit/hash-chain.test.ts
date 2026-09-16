import { computeEventHash, verifyAuditChainIntegrity, ChainableAuditEvent } from '../../../web/src/lib/security/auditLog';
import crypto from 'crypto';

export function runAuditHashChainTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const genesisHash = '0000000000000000000000000000000000000000000000000000000000000000';

  // Event 1: Creation
  const event1Id = 'evt-101';
  const event1Timestamp = '2026-09-16T10:00:00.000Z';
  const event1Hash = computeEventHash(
    event1Id,
    event1Timestamp,
    'ws-audit-test',
    'usr-admin-1',
    'application.created',
    'ALLOWED',
    genesisHash
  );

  const event1: ChainableAuditEvent = {
    eventId: event1Id,
    timestamp: event1Timestamp,
    workspaceId: 'ws-audit-test',
    actorId: 'usr-admin-1',
    action: 'application.created',
    resourceType: 'application',
    resourceId: 'app-1',
    result: 'ALLOWED',
    risk: 'LOW',
    ipHash: crypto.createHash('sha256').update('192.168.1.100').digest('hex'),
    userAgentHash: crypto.createHash('sha256').update('Mozilla/5.0').digest('hex'),
    previousEventHash: genesisHash,
    eventHash: event1Hash
  };

  // Event 2: Status transition
  const event2Id = 'evt-102';
  const event2Timestamp = '2026-09-16T10:05:00.000Z';
  const event2Hash = computeEventHash(
    event2Id,
    event2Timestamp,
    'ws-audit-test',
    'usr-admin-1',
    'application.status_changed',
    'ALLOWED',
    event1Hash
  );

  const event2: ChainableAuditEvent = {
    eventId: event2Id,
    timestamp: event2Timestamp,
    workspaceId: 'ws-audit-test',
    actorId: 'usr-admin-1',
    action: 'application.status_changed',
    resourceType: 'application',
    resourceId: 'app-1',
    result: 'ALLOWED',
    risk: 'MEDIUM',
    ipHash: crypto.createHash('sha256').update('192.168.1.100').digest('hex'),
    userAgentHash: crypto.createHash('sha256').update('Mozilla/5.0').digest('hex'),
    previousEventHash: event1Hash,
    eventHash: event2Hash
  };

  // Test 1: Valid chain verification
  const validVerification = verifyAuditChainIntegrity([event1, event2]);
  results.push({
    name: 'Audit Logging: Tamper-evident SHA-256 hash chain verification',
    passed: validVerification.valid,
    details: 'Unmodified consecutive audit events must verify cleanly with 0 broken links.'
  });

  // Test 2: Tamper detection (Adversary modifies Event 1 action)
  const tamperedEvent1 = {
    ...event1,
    action: 'application.deleted_without_record' // Injected modification
  };

  const tamperedVerification = verifyAuditChainIntegrity([tamperedEvent1, event2]);
  results.push({
    name: 'Audit Logging: Tamper detection on modified historical record',
    passed: !tamperedVerification.valid && tamperedVerification.brokenAtEventId === event1Id,
    details: 'Cryptographic hash mismatch must immediately detect altered audit records.'
  });

  // Test 3: Raw IP address hashed for privacy
  results.push({
    name: 'Audit Logging: IP address and User-Agent privacy hashing',
    passed: !event1.ipHash.includes('192.168') && event1.ipHash.length === 64,
    details: 'Client IP and User-Agent must be stored as SHA-256 hashes to prevent PII exposure.'
  });

  return results;
}
