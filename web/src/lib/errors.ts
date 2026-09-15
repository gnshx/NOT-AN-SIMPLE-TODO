/**
 * P1-06: Structured, sanitized error response handling for DayNight Pilot.
 * Prevents information disclosure (ASVS V5.5 / CWE-209).
 * Never leaks database connection strings, stack traces, SQL errors, or file paths to clients.
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import crypto from 'crypto';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized: Authentication required.') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden: You do not have permission to perform this action.') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found.`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed.', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfterSeconds: number) {
    super(
      `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
      429,
      'RATE_LIMIT_EXCEEDED',
      { retryAfterSeconds }
    );
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict.') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Maps any caught error to a safe, structured API response.
 * Sanitizes unexpected exceptions so raw database errors or stack traces are never sent to the client.
 */
export function handleApiError(error: unknown) {
  const requestId = crypto.randomUUID();

  // 1. Zod schema validation errors
  if (error instanceof ZodError) {
    const formattedIssues = (error as any).issues?.map((issue: any) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code
    })) || [{ message: error.message }];

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload or parameters.',
          details: formattedIssues,
          requestId
        }
      },
      { status: 400 }
    );
  }

  // 2. Known application business errors
  if (error instanceof AppError) {
    const headers: Record<string, string> = {};
    if (error instanceof RateLimitError && error.details?.retryAfterSeconds) {
      headers['Retry-After'] = String(error.details.retryAfterSeconds);
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          requestId
        }
      },
      { status: error.statusCode, headers }
    );
  }

  // 3. String-based Unauthorized / Forbidden matching (for legacy helpers)
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (errorMessage.toLowerCase().includes('unauthorized')) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: errorMessage,
          requestId
        }
      },
      { status: 401 }
    );
  }

  if (errorMessage.toLowerCase().includes('forbidden')) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: errorMessage,
          requestId
        }
      },
      { status: 403 }
    );
  }

  // 4. Unexpected server error — log internally with requestId, send safe generic message
  try {
    const { createRequestLogger } = require('./logger');
    createRequestLogger({ requestId }).error({ err: error }, 'Unexpected internal API error');
  } catch (e) {
    console.error(`[ApiError:${requestId}] Unexpected internal error:`, error);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: isProduction
          ? 'An unexpected error occurred. Please try again later.'
          : errorMessage,
        requestId
      }
    },
    { status: 500 }
  );
}
