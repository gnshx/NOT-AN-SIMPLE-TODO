/**
 * @file redis.ts
 * @description Distributed Redis client abstraction with zero-crash in-memory degradation.
 * Powers distributed token bucket rate limiting, BullMQ background queues, and idempotency locks.
 * 
 * @module lib/redis
 */

import type Redis from 'ioredis';

let redisClient: Redis | null = null;
let isConnected = false;

/**
 * Retrieves the shared ioredis client singleton or establishes a new lazy connection.
 * Returns null if REDIS_URL is unconfigured or if connection fails.
 * 
 * @returns {Redis | null} Connected or connecting Redis client, or null
 */
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

/**
 * Verifies whether the Redis client is initialized, connected, and ready to accept commands.
 * 
 * @returns {boolean} True if ready, false if disconnected or in fallback mode
 */
export function isRedisConnected(): boolean {
  return isConnected && redisClient !== null && redisClient.status === 'ready';
}

/**
 * Returns connection configuration tailored for BullMQ workers and queues.
 * Configures maxRetriesPerRequest to null as strictly mandated by BullMQ engine specifications.
 * 
 * @returns {object} BullMQ connection parameters
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
