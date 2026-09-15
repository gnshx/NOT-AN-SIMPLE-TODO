import { checkRateLimit, clearRateLimitStore } from '../../../web/src/lib/security/rateLimiter';

export function runResourceConsumptionTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  clearRateLimitStore();
  const testIp = '10.0.0.99';
  let rateLimited = false;

  for (let i = 0; i < 25; i++) {
    const res = checkRateLimit('ai', testIp);
    if (res.limited) {
      rateLimited = true;
      break;
    }
  }

  results.push({
    name: 'Unrestricted Resource Consumption (Rate Limiting) prevention',
    passed: rateLimited,
    details: 'AI endpoint must block client exceeding 20 requests/minute threshold with 429.'
  });

  return results;
}
