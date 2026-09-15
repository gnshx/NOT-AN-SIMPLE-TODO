/**
 * Redis client abstraction for DayNight Pilot.
 * Provides distributed state management for:
 *   - Distributed rate limiting (Phase 1)
 *   - BullMQ background job queues (Phase 2)
 *   - Idempotency keys (Phase 2)
 *
 * Graceful fallback: If REDIS_URL is not set or Redis is unreachable,
 * degrades gracefully to in-memory fallback without crashing the process.
 */

import Redis from 'ioredis';

let redisClient: Redis | null = null;
let isConnected = false;

export function getRedisClient(): Redis | null {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      connectTimeout: 3000,
      retryStrategy(times) {
        if (times > 3) {
          return null; // Stop retrying after 3 failures to prevent connection thrashing
        }
        return Math.min(times * 100, 1000);
      },
      lazyConnect: true
    });

    redisClient.on('connect', () => {
      isConnected = true;
    });

    redisClient.on('error', (err) => {
      isConnected = false;
      // Suppress spammy log in dev if local Redis is down
      if (process.env.NODE_ENV !== 'test') {
        console.warn('[Redis] Connection warning (falling back to memory):', err.message);
      }
    });

    redisClient.connect().catch(() => {
      isConnected = false;
    });

    return redisClient;
  } catch (err) {
    isConnected = false;
    return null;
  }
}

export function isRedisConnected(): boolean {
  return isConnected && redisClient !== null && redisClient.status === 'ready';
}
