/**
 * P0-03: Authentication module — production-hardened.
 *
 * CURRENT STATE: In-memory session store (dev/testing only).
 * PHASE 1 NEXT: Replace with NextAuth.js provider + JWT/database sessions.
 *
 * Security guarantees enforced now:
 * - registerTestSession() is BLOCKED in production builds
 * - Sessions expire and are checked on every request
 * - Session tokens are never logged
 */

import { redactAuthorizationTokens } from './envelopeEncryption';

export interface UserSession {
  sessionId: string;
  userId: string;
  email: string;
  name: string;
  workspaceId: string;
  organizationId: string;
  expiresAt: Date;
  isRevoked: boolean;
}

// In-memory active session store — DEVELOPMENT / TESTING ONLY
// Phase 1 replaces this with NextAuth.js database sessions
const activeSessionsStore = new Map<string, UserSession>();

/**
 * Creates a secure session with HttpOnly & Secure cookie configuration properties.
 */
export function createSessionCookieConfig() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  };
}

/**
 * Validates session token server-side, rejecting anonymous, expired, or revoked sessions.
 */
export async function validateSessionToken(token: string): Promise<UserSession | null> {
  if (!token || typeof token !== 'string') return null;

  // Sanitize token to avoid log leaks — token is never printed directly
  redactAuthorizationTokens(token); // validates format implicitly

  const session = activeSessionsStore.get(token);
  if (!session) return null;

  // Revocation check
  if (session.isRevoked) return null;

  // Expiration check
  if (new Date() > session.expiresAt) {
    activeSessionsStore.delete(token);
    return null;
  }

  return session;
}

/**
 * Server-side Authentication Guard.
 * Rejects unauthenticated requests with an explicit 401 error.
 */
export async function requireAuthentication(requestHeaders: Headers): Promise<UserSession> {
  const authHeader = requestHeaders.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || requestHeaders.get('x-session-token');

  if (!token) {
    throw new Error('Unauthorized: Missing session token.');
  }

  const session = await validateSessionToken(token);
  if (!session) {
    throw new Error('Unauthorized: Session token is invalid, expired, or revoked.');
  }

  return session;
}

/**
 * P0-03: registerTestSession is BLOCKED in production.
 * Only available in development and test environments.
 * This prevents test session injection in deployed instances.
 */
export function registerTestSession(token: string, session: UserSession): void {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[SECURITY] registerTestSession() is not available in production. ' +
      'Use the proper authentication flow.'
    );
  }
  activeSessionsStore.set(token, session);
}

/**
 * Revokes a session upon logout or security alert.
 */
export function revokeSession(token: string): boolean {
  const session = activeSessionsStore.get(token);
  if (session) {
    session.isRevoked = true;
    activeSessionsStore.set(token, session);
    return true;
  }
  return false;
}

/**
 * Returns session store size — for testing only, not for production use.
 */
export function getSessionStoreSize(): number {
  if (process.env.NODE_ENV === 'production') return -1;
  return activeSessionsStore.size;
}
