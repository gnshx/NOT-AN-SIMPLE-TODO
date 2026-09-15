import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom SRE Metrics
export const failureRate = new Rate('failed_requests');
export const apiLatency = new Trend('api_p95_latency');

export const options = {
  stages: [
    { duration: '30s', target: 25 },  // Ramp up to 25 VUs
    { duration: '1m', target: 100 },  // Sustained peak load at 100 VUs
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    // Stage B SaaS performance targets:
    http_req_duration: ['p(95)<200', 'p(99)<500'], // 95% of requests must complete within 200ms
    failed_requests: ['rate<0.01'],                 // Error rate must stay below 1%
    http_req_failed: ['rate<0.01']
  }
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TEST_TOKEN = __ENV.TEST_TOKEN || 'test-session-token-stage-b';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
  };

  // 1. Dashboard Application List Load
  const appsRes = http.get(`${BASE_URL}/api/v1/applications`, { headers });
  const appCheck = check(appsRes, {
    'applications status is 200': (r) => r.status === 200,
    'response has applications array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.applications);
      } catch (e) {
        return false;
      }
    }
  });
  failureRate.add(!appCheck);
  apiLatency.add(appsRes.timings.duration);

  sleep(1);

  // 2. Health & Readiness Probe Check
  const healthRes = http.get(`${BASE_URL}/api/health`, { headers });
  check(healthRes, {
    'health probe is 200': (r) => r.status === 200
  });

  sleep(1);

  // 3. AI Pilot Ingestion / Status Query
  const aiPayload = JSON.stringify({
    query: 'What is the current status of my Google interview application?',
    modelTier: 'FLASH'
  });
  const aiRes = http.post(`${BASE_URL}/api/ai/pilot`, aiPayload, { headers });
  check(aiRes, {
    'ai response status is 200 or 429': (r) => r.status === 200 || r.status === 429
  });

  sleep(2);
}
