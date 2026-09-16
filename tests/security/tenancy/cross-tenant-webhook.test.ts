import { registerWebhookEndpoint, listWebhookEndpoints, dispatchWebhookEvent } from '../../../web/src/lib/webhooks/dispatcher';

export async function runCrossTenantWebhookTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Register an endpoint strictly in Workspace A
  registerWebhookEndpoint({
    workspaceId: 'ws-tenant-a',
    url: 'https://tenant-a.com/webhook',
    events: ['application.created']
  });

  // Check endpoints for Workspace B
  const endpointsB = listWebhookEndpoints('ws-tenant-b');

  // Trigger event for Workspace B
  const outcome = await dispatchWebhookEvent('ws-tenant-b', 'application.created', {
    applicationId: 'app-b-123'
  });

  results.push({
    name: 'Tenancy: Cross-tenant webhook routing isolation',
    passed: endpointsB.length === 0 && outcome.dispatched === 0,
    details: 'Events in Workspace B must never dispatch to webhook endpoints registered in Workspace A.'
  });

  return results;
}
