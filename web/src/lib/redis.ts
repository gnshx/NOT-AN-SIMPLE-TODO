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

import type Redis from 'ioredis';

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
    // Dynamically require to avoid pulling Node builtins into Edge bundles
    const RedisClass = require('ioredis');
    const client = new RedisClass(redisUrl, {
      maxRetriesPerRequest: 2,
      connectTimeout: 3000,
      retryStrategy(times: number) {
        if (times > 3) {
          return null; // Stop retrying after 3 failures to prevent connection thrashing
        }
        return Math.min(times * 100, 1000);
      },
      lazyConnect: true
    });

    client.on('connect', () => {
      isConnected = true;
    });

    client.on('error', (err: any) => {
      isConnected = false;
      // Suppress spammy log in dev if local Redis is down
      if (process.env.NODE_ENV !== 'test') {
        console.warn('[Redis] Connection warning (falling back to memory):', err.message);
      }
    });

    client.connect().catch(() => {
      isConnected = false;
    });

    redisClient = client;
    return redisClient;
  } catch (err) {
    isConnected = false;
    return null;
  }
}

export function isRedisConnected(): boolean {
  return isConnected && redisClient !== null && redisClient.status === 'ready';
}

/**
 * Returns connection configuration tailored for BullMQ workers and queues.
 * BullMQ requires maxRetriesPerRequest: null.
 */
export function getBullMQConnectionOptions() {
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  try {
    const parsed = new URL(redisUrl);
    return {
      host: parsed.hostname || '127.0.0.1',
      port: Number(parsed.port) || 6379,
      password: parsed.password || undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    };
  } catch (e) {
    return {
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    };
  }
}
