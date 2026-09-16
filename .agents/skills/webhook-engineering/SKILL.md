---
name: webhook-engineering
description: "Production webhook engineering: cryptographic HMAC SHA-256 signature verification, replay attack prevention, idempotent delivery, and exponential backoff retry."
category: backend
risk: safe
tags: [webhooks, stripe, security, hmac, reliability]
---

# Production Webhook Engineering

Standards for building secure, fault-tolerant webhook producers and consumers.

## 1. Webhook Signature Verification (Receiver)

Always verify cryptographic signatures before parsing request payloads:
1. Extract timestamp and signature from headers (e.g. `stripe-signature` or `x-hub-signature-256`).
2. Reject requests if timestamp drift exceeds **5 minutes** (prevents replay attacks).
3. Compute HMAC SHA-256 using the **raw, unparsed body buffer** and your shared webhook secret.
4. Compare computed hash using **constant-time equality** (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.

## 2. Fail-Safe Idempotent Processing

1. Store processed event IDs in Redis or database (`processed_webhooks: { eventId, processedAt }`).
2. If an event ID already exists, immediately return HTTP 200 without re-executing side effects (e.g. avoid charging a user twice).
3. Always respond with HTTP `200 OK` quickly (under 2 seconds). Offload heavy business logic to background job queues (BullMQ/Temporal).
