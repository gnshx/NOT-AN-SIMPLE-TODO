import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthentication } from '@/lib/security/auth';
import { registerWebhookEndpoint, listWebhookEndpoints } from '@/lib/webhooks/dispatcher';
import { handleApiError } from '@/lib/errors';

const RegisterWebhookSchema = z.object({
  url: z.string().url('Must be a valid absolute URL'),
  events: z.array(z.string()).min(1, 'At least one event subscription required').default(['*'])
});

/**
 * GET /api/v1/webhooks/endpoints
 * Lists registered webhooks for the workspace.
 */
export async function GET(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const endpoints = listWebhookEndpoints(session.workspaceId);

    return NextResponse.json({
      success: true,
      data: endpoints.map(({ secret, ...safe }) => safe),
      meta: {
        total: endpoints.length,
        workspaceId: session.workspaceId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/webhooks/endpoints
 * Registers a new webhook subscription.
 */
export async function POST(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const body = await request.json().catch(() => null);
    const { url, events } = RegisterWebhookSchema.parse(body);

    const endpoint = registerWebhookEndpoint({
      workspaceId: session.workspaceId,
      url,
      events
    });

    return NextResponse.json(
      {
        success: true,
        endpoint,
        message: 'Webhook registered successfully. Save the signing secret to verify incoming deliveries.'
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
