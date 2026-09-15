import crypto from 'crypto';
import { validateExternalUrl } from '../security/ssrfGuard';

export interface WebhookEndpoint {
  id: string;
  workspaceId: string;
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

const inMemoryWebhookEndpoints = new Map<string, WebhookEndpoint>();

/**
 * P4-05: Webhook Event Dispatcher.
 * Dispatches cryptographically signed payloads with SSRF prevention and HMAC verification.
 */
export function registerWebhookEndpoint(params: {
  workspaceId: string;
  url: string;
  events: string[];
}): WebhookEndpoint {
  const ssrfCheck = validateExternalUrl(params.url);
  if (!ssrfCheck.safe) {
    throw new Error(`Invalid webhook target URL: ${ssrfCheck.reason}`);
  }

  const endpoint: WebhookEndpoint = {
    id: `wh-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    workspaceId: params.workspaceId,
    url: params.url,
    secret: `whsec_${crypto.randomBytes(24).toString('hex')}`,
    events: params.events,
    active: true,
    createdAt: new Date().toISOString()
  };

  inMemoryWebhookEndpoints.set(endpoint.id, endpoint);
  return endpoint;
}

export function listWebhookEndpoints(workspaceId: string): WebhookEndpoint[] {
  return Array.from(inMemoryWebhookEndpoints.values()).filter(
    (e) => e.workspaceId === workspaceId && e.active
  );
}

/**
 * Generates an HMAC SHA-256 signature for outgoing webhook delivery.
 */
export function signWebhookPayload(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Dispatches an event payload to all subscribed workspace webhook endpoints.
 */
export async function dispatchWebhookEvent(
  workspaceId: string,
  eventType: string,
  data: Record<string, any>
): Promise<{ dispatched: number; failed: number }> {
  const endpoints = listWebhookEndpoints(workspaceId).filter(
    (e) => e.events.includes('*') || e.events.includes(eventType)
  );

  let dispatched = 0;
  let failed = 0;

  const payloadString = JSON.stringify({
    id: `evt-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    event: eventType,
    workspaceId,
    timestamp: new Date().toISOString(),
    data
  });

  await Promise.all(
    endpoints.map(async (endpoint) => {
      try {
        const signature = signWebhookPayload(payloadString, endpoint.secret);
        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-DNP-Event': eventType,
            'X-DNP-Signature': `sha256=${signature}`
          },
          body: payloadString,
          signal: AbortSignal.timeout(5000)
        });

        if (res.ok) dispatched++;
        else failed++;
      } catch (e) {
        failed++;
      }
    })
  );

  return { dispatched, failed };
}
