import { NextResponse } from 'next/server';

/**
 * P5-04: Liveness Probe Endpoint.
 * Used by Kubernetes / container orchestrators to detect process responsiveness.
 */
export async function GET() {
  const memory = process.memoryUsage();
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    memory: {
      rssMb: Math.round(memory.rss / (1024 * 1024)),
      heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
      heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024))
    }
  });
}
