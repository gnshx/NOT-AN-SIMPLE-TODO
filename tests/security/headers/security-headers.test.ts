import { applySecurityHeaders, PRODUCTION_SECURITY_HEADERS } from '../../../web/src/lib/security/headers';

export async function runSecurityHeadersTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const headers = new Headers();
  applySecurityHeaders(headers);

  // Test 1: Content-Security-Policy
  const csp = headers.get('content-security-policy') || '';
  const cspValid =
    csp.includes("frame-ancestors 'none'") &&
    csp.includes("object-src 'none'") &&
    csp.includes("base-uri 'self'") &&
    !csp.includes("'unsafe-eval'"); // unsafe-eval must be removed
  results.push({
    name: 'Security Headers: CSP hardening (frame-ancestors none, no unsafe-eval)',
    passed: cspValid,
    details: 'CSP must forbid clickjacking, Flash/plugins, and prohibit unsafe-eval.'
  });

  // Test 2: Strict-Transport-Security (HSTS)
  const hsts = headers.get('strict-transport-security') || '';
  const hstsValid = hsts.includes('max-age=63072000') && hsts.includes('includeSubDomains') && hsts.includes('preload');
  results.push({
    name: 'Security Headers: HSTS with 2-year duration, subdomains and preload',
    passed: hstsValid,
    details: 'HSTS header must enforce TLS across all subdomains with preload.'
  });

  // Test 3: X-Content-Type-Options: nosniff
  const nosniff = headers.get('x-content-type-options');
  results.push({
    name: 'Security Headers: X-Content-Type-Options nosniff',
    passed: nosniff === 'nosniff',
    details: 'X-Content-Type-Options must be set to nosniff to prevent MIME confusion attacks.'
  });

  // Test 4: X-Frame-Options: DENY
  const xfo = headers.get('x-frame-options');
  results.push({
    name: 'Security Headers: X-Frame-Options DENY',
    passed: xfo === 'DENY',
    details: 'X-Frame-Options must be set to DENY to prevent iframe framing.'
  });

  // Test 5: Referrer-Policy
  const refPolicy = headers.get('referrer-policy');
  results.push({
    name: 'Security Headers: Referrer-Policy strict-origin-when-cross-origin',
    passed: refPolicy === 'strict-origin-when-cross-origin',
    details: 'Referrer header must protect path privacy on cross-origin requests.'
  });

  // Test 6: Permissions-Policy
  const permPolicy = headers.get('permissions-policy') || '';
  const permValid =
    permPolicy.includes('camera=()') &&
    permPolicy.includes('microphone=()') &&
    permPolicy.includes('geolocation=()');
  results.push({
    name: 'Security Headers: Permissions-Policy restriction of sensitive APIs',
    passed: permValid,
    details: 'Camera, microphone, and geolocation APIs must be locked down.'
  });

  return results;
}
