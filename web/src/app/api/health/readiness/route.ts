import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRedisClient } from '@/lib/redis';
import { circuitRegistry } from '@/lib/circuit';

/**
 * P5-04: Readiness Probe Endpoint.
 * Validates database connectivity, cache health, and circuit breaker metrics
 * before ingress routes traffic to this pod/instance.
 */
export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: 'up' | 'down' | 'degraded'; latencyMs: number; details?: string }> = {};

  let isHealthy = true;

  // 1. Database Check
  const dbStart = Date.now();
  try {
    // Quick probe query
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      status: 'up',
      latencyMs: Date.now() - dbStart
    };
  } catch (err: any) {
    isHealthy = false;
    checks.database = {
      status: 'down',
      latencyMs: Date.now() - dbStart,
      details: err.message
    };
  }

  // 2. Redis Cache Check
  const redisStart = Date.now();
  try {
    const redis = getRedisClient();
    if (redis) {
      await redis.ping();
      checks.redis = {
        status: 'up',
        latencyMs: Date.now() - redisStart
      };
    } else {
      checks.redis = {
        status: 'degraded',
        latencyMs: 0,
        details: 'Redis disabled; running in memory-fallback mode'
      };
    }
  } catch (err: any) {
    checks.redis = {
      status: 'degraded',
      latencyMs: Date.now() - redisStart,
      details: err.message
    };
  }

  // 3. Circuit Breaker Telemetry
  const circuits = circuitRegistry.map((cb) => cb.getMetrics());
  const anyOpen = circuits.some((c) => c.state === 'OPEN');

  const totalLatencyMs = Date.now() - startTime;
  const overallStatus = !isHealthy ? 'unhealthy' : anyOpen ? 'degraded' : 'healthy';
  const httpStatus = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      latencyMs: totalLatencyMs,
      checks,
      circuitBreakers: circuits
    },
    { status: httpStatus }
  );
}
