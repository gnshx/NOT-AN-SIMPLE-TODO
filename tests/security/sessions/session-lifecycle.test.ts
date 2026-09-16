import { validateSessionToken, registerTestSession, revokeSession, createSessionCookieConfig } from '../../../web/src/lib/security/auth';

export async function runSessionLifecycleTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: Anonymous session token rejection
  const anonCheck = await validateSessionToken('');
  results.push({
    name: 'Session Lifecycle: Anonymous request rejection (401)',
    passed: anonCheck === null,
    details: 'Empty or missing token must be rejected.'
  });

  // Test 2: Expired session token rejection
  const expiredToken = 'test-session-expired-token';
  registerTestSession(expiredToken, {
    sessionId: 'sess-exp',
    userId: 'usr-1',
    email: 'user1@example.com',
    name: 'User One',
    workspaceId: 'ws-1',
    organizationId: 'org-1',
    expiresAt: new Date(Date.now() - 5000), // Expired 5 seconds ago
    isRevoked: false
  });
  const expiredCheck = await validateSessionToken(expiredToken);
  results.push({
    name: 'Session Lifecycle: Expired session rejection (401)',
    passed: expiredCheck === null,
    details: 'Expired session tokens must be immediately purged and rejected.'
  });

  // Test 3: Revoked session token rejection
  const validToken = 'test-session-revoked-token';
  registerTestSession(validToken, {
    sessionId: 'sess-rev',
    userId: 'usr-2',
    email: 'user2@example.com',
    name: 'User Two',
    workspaceId: 'ws-1',
    organizationId: 'org-1',
    expiresAt: new Date(Date.now() + 3600000),
    isRevoked: false
  });
  revokeSession(validToken);
  const revokedCheck = await validateSessionToken(validToken);
  results.push({
    name: 'Session Lifecycle: Revoked session rejection (401)',
    passed: revokedCheck === null,
    details: 'Revoked session tokens must be immediately rejected on subsequent requests.'
  });

  // Test 4: Valid active session authentication
  const activeToken = 'test-session-active-token';
  registerTestSession(activeToken, {
    sessionId: 'sess-act',
    userId: 'usr-3',
    email: 'user3@example.com',
    name: 'User Three',
    workspaceId: 'ws-3',
    organizationId: 'org-3',
    role: 'ADMIN',
    expiresAt: new Date(Date.now() + 3600000),
    isRevoked: false
  });
  const activeCheck = await validateSessionToken(activeToken);
  results.push({
    name: 'Session Lifecycle: Valid session authentication success',
    passed: activeCheck !== null && activeCheck.userId === 'usr-3' && activeCheck.role === 'ADMIN',
    details: 'Valid unexpired session must resolve correct user, workspace, and role.'
  });

  // Test 5: Secure Cookie Configuration Attributes
  const cookieConfig = createSessionCookieConfig();
  const isCookieSecure =
    cookieConfig.httpOnly === true &&
    cookieConfig.sameSite === 'lax' &&
    cookieConfig.maxAge === 86400 &&
    cookieConfig.path === '/';
  results.push({
    name: 'Session Lifecycle: Secure cookie attribute enforcement',
    passed: isCookieSecure,
    details: 'Cookie config must enforce HttpOnly=true, SameSite=lax, and 24h maxAge.'
  });

  return results;
}
