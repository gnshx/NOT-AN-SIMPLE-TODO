export const PRODUCTION_SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; '),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'X-XSS-Protection': '1; mode=block',
  'X-DNS-Prefetch-Control': 'off'
};

export function applySecurityHeaders(headers: Headers): void {
  const isDev = process.env.NODE_ENV === 'development';
  for (const [key, value] of Object.entries(PRODUCTION_SECURITY_HEADERS)) {
    if (key === 'Content-Security-Policy' && isDev) {
      // In development mode, React and Next.js Turbopack require 'unsafe-eval' to reconstruct callstacks
      headers.set(key, value.replace("script-src 'self' 'unsafe-inline'", "script-src 'self' 'unsafe-inline' 'unsafe-eval'"));
    } else {
      headers.set(key, value);
    }
  }
}
