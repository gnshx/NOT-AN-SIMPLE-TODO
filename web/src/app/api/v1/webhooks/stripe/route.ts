import { NextResponse } from 'next/server';
import { verifyStripeWebhookEvent } from '@/lib/billing/stripe';
import { handleApiError, AppError } from '@/lib/errors';
import { prisma } from '@/lib/db';

/**
 * POST /api/v1/webhooks/stripe
 * Secure Stripe webhook receiver with cryptographic signature verification.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      throw new AppError(
        'Server misconfiguration: STRIPE_WEBHOOK_SECRET must be configured.',
        500,
        'MISCONFIGURED_WEBHOOK_SECRET'
      );
    }

    if (!signature) {
      throw new AppError('Missing stripe-signature header.', 400, 'INVALID_WEBHOOK_SIGNATURE');
    }

    let event;
    try {
      event = verifyStripeWebhookEvent(rawBody, signature, secret);
    } catch (err) {
      throw new AppError(`Webhook signature verification failed: ${(err as Error).message}`, 400, 'INVALID_WEBHOOK_SIGNATURE');
    }

    // Process event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const orgId = session.metadata?.organizationId;
        const planTier = session.metadata?.planTier || 'PRO';

        if (orgId && prisma) {
          try {
            await prisma.organization.update({
              where: { id: orgId },
              data: { planTier }
            });
          } catch (e) {}
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const orgId = subscription.metadata?.organizationId;
        if (orgId && prisma) {
          try {
            await prisma.organization.update({
              where: { id: orgId },
              data: { planTier: 'FREE' }
            });
          } catch (e) {}
        }
        break;
      }

      case 'invoice.payment_failed': {
        console.warn('[Stripe Webhook] Invoice payment failed for event:', event.id);
        break;
      }
    }

    return NextResponse.json({ received: true, eventId: event.id });
  } catch (error) {
    return handleApiError(error);
  }
}
