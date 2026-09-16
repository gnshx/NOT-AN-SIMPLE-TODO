import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { applySecurityHeaders } from '@/lib/security/headers';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || '127.0.0.1';

  // 1. Rate Limiting Check on API Routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const rateLimit = checkRateLimit('api', ip);
    if (rateLimit.limited) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${rateLimit.retryAfterSeconds} seconds.`
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfterSeconds),
            'X-RateLimit-Limit': String(rateLimit.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetTimeMs)
          }
        }
      );
    }
  }

  // 2. Production Security Headers Enforcement
  applySecurityHeaders(response.headers);

  return response;
}


export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
