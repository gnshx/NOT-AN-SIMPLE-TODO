import { validateExternalUrl } from '../../lib/security/ssrfGuard';
import { checkRateLimit, clearRateLimitStore } from '../../lib/security/rateLimiter';

export function runApiSecurityTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: SSRF Loopback Protection
  const ssrfLocalhost = validateExternalUrl('http://127.0.0.1:8080/internal-status');
  results.push({
    name: 'SSRF Loopback (127.0.0.1) blocking',
    passed: !ssrfLocalhost.safe,
    details: 'Requests to 127.0.0.1 must be blocked.'
  });

  // Test 2: SSRF Cloud Metadata Endpoint Protection
  const ssrfMetadata = validateExternalUrl('http://169.254.169.254/latest/meta-data/');
  results.push({
    name: 'SSRF Cloud Metadata (169.254.169.254) blocking',
    passed: !ssrfMetadata.safe,
    details: 'Requests to AWS/Cloud metadata IPs must be blocked.'
  });

  // Test 3: Rate Limiter 429 Enforcement
  clearRateLimitStore();
  const clientIp = '192.168.1.50';
  let limitTriggered = false;

  for (let i = 0; i < 10; i++) {
    const res = checkRateLimit('auth', clientIp);
    if (res.limited) {
      limitTriggered = true;
      break;
    }
  }

  results.push({
    name: 'Rate Limiting 429 enforcement',
    passed: limitTriggered,
    details: 'Auth endpoint must enforce 429 after 5 failed attempts.'
  });

  return results;
}
