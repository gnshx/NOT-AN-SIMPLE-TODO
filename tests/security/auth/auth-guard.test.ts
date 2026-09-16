import { requireAuthentication, registerTestSession, validateSessionToken } from '../../../web/src/lib/security/auth';

export async function runAuthGuardTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: Missing Authorization header throws Unauthorized 401
  const emptyHeaders = new Headers();
  let caughtMissing = false;
  try {
    await requireAuthentication(emptyHeaders);
  } catch (err: any) {
    if (err.message.includes('Missing session token')) {
      caughtMissing = true;
    }
  }
  results.push({
    name: 'Auth Guard: Missing authorization header rejection (401)',
    passed: caughtMissing,
    details: 'Requests lacking authorization header must be rejected with 401 error.'
  });

  // Test 2: Malformed Bearer token rejection
  const badHeaders = new Headers();
  badHeaders.set('authorization', 'Bearer fake-invalid-token-xyz');
  let caughtInvalid = false;
  try {
    await requireAuthentication(badHeaders);
  } catch (err: any) {
    if (err.message.includes('invalid, expired, or revoked')) {
      caughtInvalid = true;
    }
  }
  results.push({
    name: 'Auth Guard: Invalid token rejection (401)',
    passed: caughtInvalid,
    details: 'Tampered or unrecorded tokens must be rejected with 401 error.'
  });

  // Test 3: Production block on registerTestSession
  const originalEnv = process.env.NODE_ENV;
  let productionBlocked = false;
  try {
    (process.env as any).NODE_ENV = 'production';
    registerTestSession('hacked-token', {
      sessionId: 's-hack',
      userId: 'u-hack',
      email: 'hacker@evil.com',
      name: 'Hacker',
      workspaceId: 'w-hack',
      organizationId: 'o-hack',
      expiresAt: new Date(Date.now() + 100000),
      isRevoked: false
    });
  } catch (err: any) {
    if (err.message.includes('[SECURITY] registerTestSession() is not available in production')) {
      productionBlocked = true;
    }
  } finally {
    (process.env as any).NODE_ENV = originalEnv;
  }
  results.push({
    name: 'Auth Guard: Production test session injection protection',
    passed: productionBlocked,
    details: 'registerTestSession must throw fatal error in production mode.'
  });

  return results;
}
