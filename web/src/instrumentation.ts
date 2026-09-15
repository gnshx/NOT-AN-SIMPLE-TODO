/**
 * Next.js Instrumentation Hook (Phase 2 - P2-06).
 * Automatically executed when Next.js server runtime boots.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize server telemetry tracer
    const { tracer } = await import('./lib/telemetry');
    if (process.env.NODE_ENV !== 'test') {
      console.log('[Telemetry] OpenTelemetry instrumentation initialized for Node.js runtime.');
    }
  }
}
