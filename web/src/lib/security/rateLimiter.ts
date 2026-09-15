import { getRedisClient } from '../redis';

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

// In-memory token bucket rate limit store (dev fallback & local tests)
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
 * Distributed rate limiter using Redis atomic counter with PEXPIRE.
 * Falls back to in-memory store if Redis is unavailable.
 */
export async function checkDistributedRateLimit(
  ruleName: string,
  identifier: string
): Promise<RateLimitResult> {
  const rule = RATE_LIMIT_RULES[ruleName] || RATE_LIMIT_RULES.api;
  const redis = getRedisClient();

  if (!redis) {
    return checkRateLimit(ruleName, identifier);
  }

  try {
    const key = `ratelimit:${ruleName}:${identifier}`;
    const now = Date.now();

    // Atomic INCR and PEXPIRE via Redis pipeline
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.pttl(key);
    const results = await pipeline.exec();

    if (!results || results[0][0] || results[1][0]) {
      return checkRateLimit(ruleName, identifier);
    }

    const currentRequests = results[0][1] as number;
    let ttl = results[1][1] as number;

    // First request: set expiry window
    if (ttl === -1 || ttl === -2) {
      await redis.pexpire(key, rule.windowMs);
      ttl = rule.windowMs;
    }

    const resetTimeMs = now + (ttl > 0 ? ttl : rule.windowMs);
    const limited = currentRequests > rule.maxRequests;
    const retryAfterSeconds = limited ? Math.max(1, Math.ceil(ttl / 1000)) : 0;

    return {
      limited,
      currentRequests,
      maxRequests: rule.maxRequests,
      resetTimeMs,
      retryAfterSeconds
    };
  } catch (err) {
    // If Redis call fails at runtime, degrade gracefully to in-memory check
    return checkRateLimit(ruleName, identifier);
  }
}

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
