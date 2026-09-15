import { validateSessionToken, registerTestSession, revokeSession, requireAuthentication } from '../../../web/src/lib/security/auth';

export async function runSessionSecurityTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: Anonymous session rejection
  const anonCheck = await validateSessionToken('');
  results.push({
    name: 'Anonymous request rejection (401)',
    passed: anonCheck === null,
    details: 'Empty or missing token must be rejected.'
  });

  // Test 2: Expired session rejection
  const expiredToken = 'token-expired-123';
  registerTestSession(expiredToken, {
    sessionId: 's1',
    userId: 'u1',
    email: 'test@example.com',
    name: 'Test',
    workspaceId: 'w1',
    organizationId: 'o1',
    expiresAt: new Date(Date.now() - 10000), // Expired 10s ago
    isRevoked: false
  });

  const expiredCheck = await validateSessionToken(expiredToken);
  results.push({
    name: 'Expired session rejection (401)',
    passed: expiredCheck === null,
    details: 'Expired session token must be rejected.'
  });

  // Test 3: Revoked session rejection
  const validToken = 'token-valid-123';
  registerTestSession(validToken, {
    sessionId: 's2',
    userId: 'u1',
    email: 'test@example.com',
    name: 'Test',
    workspaceId: 'w1',
    organizationId: 'o1',
    expiresAt: new Date(Date.now() + 3600000),
    isRevoked: false
  });

  revokeSession(validToken);
  const revokedCheck = await validateSessionToken(validToken);
  results.push({
    name: 'Revoked session rejection (401)',
    passed: revokedCheck === null,
    details: 'Revoked session token must be rejected.'
  });

  return results;
}
