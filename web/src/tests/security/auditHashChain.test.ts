import { computeEventHash, verifyAuditChainIntegrity, ChainableAuditEvent } from '../../lib/security/auditLog';

export function runAuditHashChainTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const h1 = computeEventHash('evt-1', '2026-09-16T00:00:00Z', 'w1', 'u1', 'APPLICATION_CREATE', 'ALLOWED', 'GENESIS');
  const h2 = computeEventHash('evt-2', '2026-09-16T00:01:00Z', 'w1', 'u1', 'APPLICATION_DELETE', 'ALLOWED', h1);

  const events: ChainableAuditEvent[] = [
    {
      eventId: 'evt-1',
      timestamp: '2026-09-16T00:00:00Z',
      workspaceId: 'w1',
      actorId: 'u1',
      action: 'APPLICATION_CREATE',
      resourceType: 'APPLICATION',
      result: 'ALLOWED',
      risk: 'LOW',
      ipHash: 'hash1',
      userAgentHash: 'hash1',
      previousEventHash: 'GENESIS',
      eventHash: h1
    },
    {
      eventId: 'evt-2',
      timestamp: '2026-09-16T00:01:00Z',
      workspaceId: 'w1',
      actorId: 'u1',
      action: 'APPLICATION_DELETE',
      resourceType: 'APPLICATION',
      result: 'ALLOWED',
      risk: 'HIGH',
      ipHash: 'hash1',
      userAgentHash: 'hash1',
      previousEventHash: h1,
      eventHash: h2
    }
  ];

  // Test 1: Intact Chain Verification
  const validCheck = verifyAuditChainIntegrity(events);
  results.push({
    name: 'Tamper-evident audit hash chain integrity',
    passed: validCheck.valid,
    details: 'Intact cryptographic hash chain must verify as VALID.'
  });

  // Test 2: Tampered Chain Detection
  const tamperedEvents = JSON.parse(JSON.stringify(events));
  tamperedEvents[1].action = 'APPLICATION_UPDATE'; // Alter event data without updating hash

  const tamperedCheck = verifyAuditChainIntegrity(tamperedEvents);
  results.push({
    name: 'Audit tampering detection',
    passed: !tamperedCheck.valid,
    details: 'Tampered audit record must be detected as INVALID.'
  });

  return results;
}
