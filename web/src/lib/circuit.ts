/**
 * DayNight Pilot — Production Circuit Breaker Engine
 * P5-02: Protects external dependencies (AI Gateway, Gmail API, Stripe)
 * from cascading failures through stateful fail-fast and auto-recovery.
 */

import { logger } from './logger';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  name: string;
  failureThreshold?: number; // Number of consecutive failures before opening
  resetTimeoutMs?: number;   // Time to wait before moving from OPEN to HALF_OPEN
  successThreshold?: number; // Number of consecutive successes in HALF_OPEN to close
}

export class CircuitBreakerOpenError extends Error {
  constructor(public circuitName: string, public resetInMs: number) {
    super(`Circuit breaker '${circuitName}' is OPEN. Failing fast to prevent cascading failure. Retry in ${Math.round(resetInMs / 1000)}s.`);
    this.name = 'CircuitBreakerOpenError';
  }
}

export class CircuitBreaker {
  public readonly name: string;
  private state: CircuitState = 'CLOSED';
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;

  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly successThreshold: number;

  constructor(options: CircuitBreakerOptions) {
    this.name = options.name;
    this.failureThreshold = options.failureThreshold ?? 5;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 30000;
    this.successThreshold = options.successThreshold ?? 2;
  }

  public getState(): CircuitState {
    this.checkStateTransition();
    return this.state;
  }

  public getMetrics(): {
    name: string;
    state: CircuitState;
    failureCount: number;
    successCount: number;
    lastFailureTime: number;
  } {
    this.checkStateTransition();
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime
    };
  }

  private checkStateTransition(): void {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
        logger.warn({ circuit: this.name }, `Circuit breaker transitioned from OPEN to HALF_OPEN.`);
      }
    }
  }

  public async execute<T>(
    operation: () => Promise<T>,
    fallback?: (error: Error) => Promise<T>
  ): Promise<T> {
    this.checkStateTransition();

    if (this.state === 'OPEN') {
      const remainingMs = Math.max(0, this.resetTimeoutMs - (Date.now() - this.lastFailureTime));
      const error = new CircuitBreakerOpenError(this.name, remainingMs);
      if (fallback) {
        logger.info({ circuit: this.name }, `Circuit is OPEN — triggering supplied fallback handler.`);
        return fallback(error);
      }
      throw error;
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (err: any) {
      this.onFailure(err);
      if (fallback) {
        logger.info({ circuit: this.name, err: err.message }, `Circuit failure caught — executing fallback.`);
        return fallback(err);
      }
      throw err;
    }
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount += 1;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
        logger.info({ circuit: this.name }, `Circuit breaker recovered and transitioned to CLOSED.`);
      }
    } else if (this.state === 'CLOSED') {
      this.failureCount = 0;
    }
  }

  private onFailure(err: Error): void {
    this.lastFailureTime = Date.now();
    this.failureCount += 1;

    logger.error(
      { circuit: this.name, error: err.message, failureCount: this.failureCount, state: this.state },
      `Circuit breaker recorded operation failure.`
    );

    if (this.state === 'CLOSED' && this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      logger.error(
        { circuit: this.name, failureCount: this.failureCount },
        `Circuit breaker failure threshold exceeded. Transitioning to OPEN.`
      );
    } else if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      logger.error(
        { circuit: this.name },
        `Operation failed during HALF_OPEN trial. Tripping circuit back to OPEN.`
      );
    }
  }

  public reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }
}

// Global Singletons for Critical Services
export const aiCircuitBreaker = new CircuitBreaker({
  name: 'ai-provider-gateway',
  failureThreshold: 4,
  resetTimeoutMs: 20000,
  successThreshold: 2
});

export const gmailCircuitBreaker = new CircuitBreaker({
  name: 'gmail-integration-api',
  failureThreshold: 5,
  resetTimeoutMs: 30000,
  successThreshold: 2
});

export const stripeCircuitBreaker = new CircuitBreaker({
  name: 'stripe-billing-gateway',
  failureThreshold: 3,
  resetTimeoutMs: 15000,
  successThreshold: 2
});

export const circuitRegistry = [
  aiCircuitBreaker,
  gmailCircuitBreaker,
  stripeCircuitBreaker
];
