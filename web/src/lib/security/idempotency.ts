import { getRedisClient } from '../redis';

export interface IdempotentResult<T = any> {
  isReplay: boolean;
  statusCode: number;
  body: T;
}

interface StoredIdempotencyData {
  status: 'PENDING' | 'RESOLVED';
  statusCode: number;
  body: any;
  timestamp: number;
}

// In-memory fallback cache for dev / test / serverless environments when Redis is down
const inMemoryIdempotencyCache = new Map<string, StoredIdempotencyData>();
const DEFAULT_IDEMPOTENCY_TTL_SECONDS = 86400; // 24 hours

function buildIdempotencyStorageKey(workspaceId: string, idempotencyKey: string): string {
  return `idempotency:${workspaceId}:${idempotencyKey}`;
}

/**
 * Checks if an Idempotency-Key has already been processed or is currently in-flight.
 */
export async function checkIdempotency(
  workspaceId: string,
  idempotencyKey: string
): Promise<{ state: 'NEW' | 'PENDING' | 'RESOLVED'; cached?: IdempotentResult }> {
  if (!idempotencyKey || !workspaceId) {
    return { state: 'NEW' };
  }

  const storageKey = buildIdempotencyStorageKey(workspaceId, idempotencyKey);
  const redis = getRedisClient();

  if (redis) {
    try {
      const raw = await redis.get(storageKey);
      if (raw) {
        const parsed: StoredIdempotencyData = JSON.parse(raw);
        if (parsed.status === 'RESOLVED') {
          return {
            state: 'RESOLVED',
            cached: {
              isReplay: true,
              statusCode: parsed.statusCode,
              body: parsed.body
            }
          };
        }
        return { state: 'PENDING' };
      }
    } catch (err) {
      console.warn('[Idempotency] Redis lookup failed, using local store:', (err as Error).message);
    }
  }

  // Check local fallback
  const local = inMemoryIdempotencyCache.get(storageKey);
  if (local) {
    if (local.status === 'RESOLVED') {
      return {
        state: 'RESOLVED',
        cached: {
          isReplay: true,
          statusCode: local.statusCode,
          body: local.body
        }
      };
    }
    return { state: 'PENDING' };
  }

  return { state: 'NEW' };
}

/**
 * Acquires a pending execution lock for a new idempotency key.
 */
export async function lockIdempotencyKey(
  workspaceId: string,
  idempotencyKey: string,
  ttlSeconds = DEFAULT_IDEMPOTENCY_TTL_SECONDS
): Promise<boolean> {
  const storageKey = buildIdempotencyStorageKey(workspaceId, idempotencyKey);
  const redis = getRedisClient();

  const pendingPayload: StoredIdempotencyData = {
    status: 'PENDING',
    statusCode: 0,
    body: null,
    timestamp: Date.now()
  };

  if (redis) {
    try {
      // SET key value NX EX ttl
      const result = await redis.set(storageKey, JSON.stringify(pendingPayload), 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch (err) {
      console.warn('[Idempotency] Redis lock failed, falling back to memory:', (err as Error).message);
    }
  }

  if (inMemoryIdempotencyCache.has(storageKey)) {
    return false;
  }
  inMemoryIdempotencyCache.set(storageKey, pendingPayload);
  return true;
}

/**
 * Stores the resolved result of the mutation against the idempotency key.
 */
export async function resolveIdempotency(
  workspaceId: string,
  idempotencyKey: string,
  statusCode: number,
  body: any,
  ttlSeconds = DEFAULT_IDEMPOTENCY_TTL_SECONDS
): Promise<void> {
  const storageKey = buildIdempotencyStorageKey(workspaceId, idempotencyKey);
  const redis = getRedisClient();

  const payload: StoredIdempotencyData = {
    status: 'RESOLVED',
    statusCode,
    body,
    timestamp: Date.now()
  };

  if (redis) {
    try {
      await redis.set(storageKey, JSON.stringify(payload), 'EX', ttlSeconds);
      return;
    } catch (err) {
      console.warn('[Idempotency] Redis resolution save failed:', (err as Error).message);
    }
  }

  inMemoryIdempotencyCache.set(storageKey, payload);
}

/**
 * Wraps an asynchronous mutating operation with full idempotency guarantees.
 * If an Idempotency-Key header was passed:
 * - If already resolved: returns the cached response with isReplay: true.
 * - If currently executing concurrently: throws a 409 conflict error.
 * - If new: executes the operation, saves the response, and returns the fresh result.
 */
export async function withIdempotency<T>(
  workspaceId: string,
  idempotencyKey: string | null | undefined,
  handler: () => Promise<{ statusCode?: number; body: T }>
): Promise<IdempotentResult<T>> {
  if (!idempotencyKey) {
    // Normal non-idempotent execution
    const result = await handler();
    return {
      isReplay: false,
      statusCode: result.statusCode ?? 200,
      body: result.body
    };
  }

  const check = await checkIdempotency(workspaceId, idempotencyKey);
  if (check.state === 'RESOLVED' && check.cached) {
    return check.cached;
  }

  if (check.state === 'PENDING') {
    throw new Error('A mutation request with this Idempotency-Key is currently in progress. Please retry shortly.');
  }

  const locked = await lockIdempotencyKey(workspaceId, idempotencyKey);
  if (!locked) {
    throw new Error('Concurrent mutation conflict with the same Idempotency-Key.');
  }

  try {
    const result = await handler();
    const statusCode = result.statusCode ?? 200;
    await resolveIdempotency(workspaceId, idempotencyKey, statusCode, result.body);
    return {
      isReplay: false,
      statusCode,
      body: result.body
    };
  } catch (err) {
    // Release key on error so caller can safely retry
    const storageKey = buildIdempotencyStorageKey(workspaceId, idempotencyKey);
    const redis = getRedisClient();
    if (redis) {
      await redis.del(storageKey).catch(() => {});
    }
    inMemoryIdempotencyCache.delete(storageKey);
    throw err;
  }
}
