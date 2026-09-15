import { trace, context, SpanStatusCode, Span, Tracer } from '@opentelemetry/api';

const TRACER_NAME = 'daynight-pilot';
const TRACER_VERSION = '0.1.0';

export const tracer: Tracer = trace.getTracer(TRACER_NAME, TRACER_VERSION);

export interface SpanAttributes {
  workspaceId?: string;
  userId?: string;
  requestId?: string;
  route?: string;
  method?: string;
  [key: string]: any;
}

/**
 * Executes an asynchronous function within an OpenTelemetry active span.
 * Automatically injects contextual attributes and records errors.
 */
export async function withSpan<T>(
  spanName: string,
  attributes: SpanAttributes,
  operation: (span: Span) => Promise<T>
): Promise<T> {
  const span = tracer.startSpan(spanName, {
    attributes: {
      'service.name': 'daynight-pilot',
      ...attributes
    }
  });

  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await operation(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Extracts or generates standard W3C traceparent header for distributed propagation.
 * Format: 00-{trace_id}-{parent_id}-{trace_flags}
 */
export function getOrCreateTraceparent(headers?: Headers | null): string {
  const existing = headers?.get('traceparent');
  if (existing && /^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/i.test(existing)) {
    return existing;
  }

  const activeSpan = trace.getSpan(context.active());
  if (activeSpan) {
    const spanContext = activeSpan.spanContext();
    if (spanContext.traceId && spanContext.spanId) {
      return `00-${spanContext.traceId}-${spanContext.spanId}-01`;
    }
  }

  // Generate synthetic W3C traceparent
  const crypto = require('crypto');
  const traceId = crypto.randomBytes(16).toString('hex');
  const spanId = crypto.randomBytes(8).toString('hex');
  return `00-${traceId}-${spanId}-01`;
}
