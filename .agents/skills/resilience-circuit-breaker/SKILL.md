---
name: resilience-circuit-breaker
description: "Resilient external API orchestration: circuit breakers, exponential backoff with full jitter, bulkheads, and timeout budgets for LLMs and payments."
category: backend
risk: safe
tags: [resilience, circuit-breaker, reliability, distributed-systems]
---

# Resilience & Circuit Breaker Architecture

Protect your application from cascading failures when third-party APIs (OpenAI, Stripe, Google, Notion) suffer outages or latency spikes.

## 1. The Circuit Breaker Pattern

State Machine:
- **CLOSED**: Normal operation. All requests pass through.
- **OPEN**: Triggered when error rate exceeds threshold (e.g. 50% failures over 10 requests). Requests fail immediately without hitting the downstream service, preventing thread pool exhaustion.
- **HALF-OPEN**: After cooldown (e.g. 30 seconds), allows a single canary request to test recovery. If successful, resets to CLOSED.

## 2. Exponential Backoff with Full Jitter

Avoid the "thundering herd" problem where 1000 retries hit a recovering service simultaneously:
$$\text{sleep} = \text{random}(0, \min(\text{maxWait}, \text{baseWait} \times 2^{\text{attempt}}))$$

## 3. Strict Timeout Budgets

Never issue an outbound fetch without an `AbortController` timeout budget:
- Fast DB queries: 2 seconds.
- Standard REST APIs: 5 seconds.
- LLM inference calls: 15–30 seconds.
