import { checkRateLimit, RATE_LIMIT_RULES } from '../../../web/src/lib/security/rateLimiter';

export async function runRateLimiterTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: AI endpoint rate limiting (20 req / min)
  const aiClientIp = 'test-client-ai-flood-1';
  let blockedAt21 = false;
  let retryAfterValid = false;

  for (let i = 1; i <= 21; i++) {
    const check = checkRateLimit('ai', aiClientIp);
    if (i <= 20 && check.limited) {
      // Should not be limited before threshold
      blockedAt21 = false;
      break;
    }
    if (i === 21) {
      blockedAt21 = check.limited;
      retryAfterValid = check.retryAfterSeconds > 0 && check.retryAfterSeconds <= 60;
    }
  }

  results.push({
    name: 'Rate Limiting: AI endpoint burst threshold enforcement (20 req/min)',
    passed: blockedAt21 && retryAfterValid,
    details: 'AI endpoint must limit on 21st request and provide valid retryAfterSeconds.'
  });

  // Test 2: Auth endpoint strict rate limiting (5 req / 15 min)
  const authIp = 'test-auth-bruteforce-ip';
  let authBlockedAt6 = false;

  for (let i = 1; i <= 6; i++) {
    const check = checkRateLimit('auth', authIp);
    if (i === 6) {
      authBlockedAt6 = check.limited;
    }
  }

  results.push({
    name: 'Rate Limiting: Auth endpoint brute-force protection (5 req/15 min)',
    passed: authBlockedAt6,
    details: 'Auth endpoint must enforce strict 5 request limit per 15-minute window.'
  });

  // Test 3: Export endpoint rate limiting (5 req / min)
  const exportIp = 'test-export-flood-ip';
  let exportBlockedAt6 = false;

  for (let i = 1; i <= 6; i++) {
    const check = checkRateLimit('export', exportIp);
    if (i === 6) {
      exportBlockedAt6 = check.limited;
    }
  }

  results.push({
    name: 'Rate Limiting: Workspace export exhaustion protection (5 req/min)',
    passed: exportBlockedAt6,
    details: 'Export endpoint must limit clients to 5 bulk export jobs per minute.'
  });

  return results;
}
