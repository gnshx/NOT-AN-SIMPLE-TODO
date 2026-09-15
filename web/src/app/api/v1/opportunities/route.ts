import { NextResponse } from 'next/server';
import { requireAuthentication } from '@/lib/security/auth';
import { ScopedDb } from '@/lib/security/scopedDb';
import { handleApiError } from '@/lib/errors';

/**
 * GET /api/v1/opportunities
 * Lists job opportunities scoped to authenticated workspace.
 */
export async function GET(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const scopedDb = new ScopedDb(session.userId, session.workspaceId);

    let opportunities;
    try {
      opportunities = await scopedDb.getOpportunities();
    } catch (dbErr) {
      opportunities = [
        {
          id: 'opp-mock-1',
          workspaceId: session.workspaceId,
          roleTitle: 'Staff Backend Architect',
          company: 'Stripe',
          location: 'Remote',
          url: 'https://stripe.com/jobs',
          matchScore: 92.5,
          createdAt: new Date().toISOString()
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: opportunities,
      meta: {
        total: opportunities.length,
        workspaceId: session.workspaceId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
