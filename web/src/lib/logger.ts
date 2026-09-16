/**
 * @file logger.ts
 * @description Enterprise structured telemetry logger built on Pino.
 * Enforces automatic credential redaction (tokens, cookies, auth headers, passwords),
 * ISO-8601 timestamps, and correlation context binding (requestId, userId, workspaceId).
 * 
 * @module lib/logger
 */

import pino from 'pino';
import { redactAuthorizationTokens } from './security/envelopeEncryption';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

/** Sensitive dictionary paths intercepted and replaced with [REDACTED] */
const REDACT_PATHS = [
  'authorization',
  'headers.authorization',
  'headers.cookie',
  'cookie',
  'token',
  'accessToken',
  'refreshToken',
  'password',
  'secret',
  'key',
  '*.password',
  '*.token',
  '*.secret',
  '*.accessToken',
  '*.refreshToken'
];

/**
 * Base structured logger configured for security, high-throughput JSON serialization,
 * and automatic redaction of sensitive credentials.
 */
export const rootLogger = pino({
  level: isTest ? 'silent' : isProduction ? 'info' : 'debug',
  redact: {
    paths: REDACT_PATHS,
    censor: '[REDACTED]'
  },
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      hostname: bindings.hostname,
      service: 'daynight-pilot'
    })
  },
  timestamp: pino.stdTimeFunctions.isoTime
});

export interface LoggerContext {
  requestId?: string;
  userId?: string;
  workspaceId?: string;
  route?: string;
  [key: string]: any;
}

/**
 * Creates a child logger bound to the current request's correlation context.
 */
export function createRequestLogger(context: LoggerContext) {
  // Sanitize any potential raw strings passed in context
  const sanitizedContext: LoggerContext = { ...context };
  if (sanitizedContext.requestId) {
    sanitizedContext.requestId = redactAuthorizationTokens(sanitizedContext.requestId);
  }
  return rootLogger.child(sanitizedContext);
}

export const logger = rootLogger;
