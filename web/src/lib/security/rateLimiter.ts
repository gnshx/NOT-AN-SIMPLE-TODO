export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  limited: boolean;
  currentRequests: number;
  maxRequests: number;
  resetTimeMs: number;
  retryAfterSeconds: number;
}

// In-memory token bucket rate limit store (production would connect to Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const RATE_LIMIT_RULES: Record<string, RateLimitConfig> = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },       // 5 per 15 min
  api: { windowMs: 60 * 1000, maxRequests: 100 },           // 100 per min
  ai: { windowMs: 60 * 1000, maxRequests: 20 },             // 20 per min
  emailIngestion: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 per min
  search: { windowMs: 60 * 1000, maxRequests: 30 },         // 30 per min
  export: { windowMs: 60 * 1000, maxRequests: 5 }           // 5 per min
};

/**
 * Checks rate limits for a given endpoint rule and client key (IP or UserId).
 */
export function checkRateLimit(ruleName: string, identifier: string): RateLimitResult {
  const rule = RATE_LIMIT_RULES[ruleName] || RATE_LIMIT_RULES.api;
  const now = Date.now();
  const key = `${ruleName}:${identifier}`;

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + rule.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      limited: false,
      currentRequests: 1,
      maxRequests: rule.maxRequests,
      resetTimeMs: resetTime,
      retryAfterSeconds: 0
    };
  }

  entry.count++;

  if (entry.count > rule.maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return {
      limited: true,
      currentRequests: entry.count,
      maxRequests: rule.maxRequests,
      resetTimeMs: entry.resetTime,
      retryAfterSeconds
    };
  }

  return {
    limited: false,
    currentRequests: entry.count,
    maxRequests: rule.maxRequests,
    resetTimeMs: entry.resetTime,
    retryAfterSeconds: 0
  };
}

/**
 * Reset rate limit counter for testing.
 */
export function clearRateLimitStore() {
  rateLimitStore.clear();
}
