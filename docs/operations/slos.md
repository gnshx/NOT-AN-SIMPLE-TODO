# DayNight Pilot — Reliability, Service Level Objectives (SLOs) & Alerting Architecture

## 1. Executive Summary & Philosophy
DayNight Pilot measures availability, latency, and AI safety using Google SRE Multi-Window Multi-Burn-Rate alerting. Rather than firing noise on single-spike alerts, alerts fire proportionally to the consumption of the 30-day rolling Error Budget.

---

## 2. Core Service Level Objectives (SLOs) & SLIs

| Service Component | Metric / SLI | Target SLO (30-day Rolling) | Monthly Error Budget |
|---|---|---|---|
| **Core API Gateway** | Successful HTTP 2xx/3xx/4xx requests (excluding 5xx server faults) | **99.9% Availability** | 43.2 minutes downtime (0.1%) |
| **API Response Latency** | REST API endpoints `/api/v1/*` response duration | **p95 < 200ms, p99 < 500ms** | 1% of requests > 500ms |
| **AI Pilot Pipeline** | End-to-end AI reasoning, tool calls, and output streaming | **p95 < 3.0s, p99 < 5.0s** | 1% of queries > 5s |
| **Background Job Processing** | BullMQ job queue completion from ingestion to DB commit | **99.5% within 15s** | 0.5% delayed > 15s |
| **AI Safety & Defense** | Prompt injection block rate on hostile inbound vectors | **> 95.0% Detection Rate** | < 5% missed attacks |

---

## 3. Error Budget & Burn Rate Alerting Rules

We utilize Google SRE multi-window burn rate alerts:

```
Burn Rate = (% Error Budget Consumed / Time Elapsed)
```

- **Severity 1 (Page on-call engineer immediately)**:
  - **14.4x Burn Rate** over 1 hour (consumes 2% of budget in 1 hour)
  - **6.0x Burn Rate** over 6 hours (consumes 5% of budget in 6 hours)
- **Severity 2 (Ticket / Slack notification to team channel)**:
  - **3.0x Burn Rate** over 24 hours (consumes 10% of budget in 1 day)
  - **1.0x Burn Rate** over 3 days (consumes 10% of budget in 3 days)

---

## 4. Prometheus Alerting Rules Definition

```yaml
groups:
  - name: daynight-pilot-slo-alerts
    rules:
      # Critical: API High Error Rate (14.4x burn rate over 1h)
      - alert: ApiHighErrorRate1h
        expr: (
            sum(rate(http_requests_total{status=~"5.."}[1h])) 
            / sum(rate(http_requests_total[1h]))
          ) > (1 - 0.999) * 14.4
        for: 2m
        labels:
          severity: critical
          team: sre
        annotations:
          summary: "DayNight Pilot 1-hour error budget burn rate exceeded 14.4x"
          description: "API is serving > 1.44% 5xx errors over the last hour."

      # Critical: Database Connection Pool Starvation
      - alert: PgBouncerPoolSaturation
        expr: pgbouncer_pools_cl_waiting > 50
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "PgBouncer client waiting queue is saturated (> 50 queued clients)"

      # Warning: AI Provider Circuit Breaker Open
      - alert: AiCircuitBreakerTripped
        expr: daynight_circuit_breaker_state{circuit="ai-provider-gateway"} == 1
        for: 30s
        labels:
          severity: warning
        annotations:
          summary: "AI Gateway Circuit Breaker is OPEN. Traffic failing fast or falling back."

      # Warning: BullMQ Worker Queue Delay
      - alert: EmailWorkerLagHigh
        expr: bullmq_queue_delayed{queue="email-ingestion"} > 500
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Email ingestion worker queue lag exceeds 500 jobs."
```

---

## 5. Grafana Operations Dashboard Layout

1. **Top Row — Executive Health**:
   - Availability Gauges (Current vs 99.9% Target)
   - Remaining Error Budget (Minutes & Percentage)
   - Active Incident Banner & Pod Count
2. **Middle Row — Latency & Throughput**:
   - API Request Rate (RPS by status code)
   - API Latency Heatmap (p50, p90, p95, p99)
   - AI Reasoning Latency Breakdown (Tokens/sec, Gateway round-trip)
3. **Bottom Row — Saturation & Dependencies**:
   - PostgreSQL Connections & Buffer Cache Hit Ratio (> 99%)
   - Redis Memory & Command Latency
   - Circuit Breaker Status Matrix (AI, Gmail, Stripe)
   - BullMQ Ingestion Queue Depths
