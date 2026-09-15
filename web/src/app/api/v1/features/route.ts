import { NextResponse } from 'next/server';
import { requireAuthentication } from '@/lib/security/auth';
import { getEvaluatedFeatureFlags } from '@/lib/services/featureFlags';
import { handleApiError } from '@/lib/errors';

/**
 * GET /api/v1/features
 * Returns all evaluated feature flags for the authenticated user and workspace.
 */
export async function GET(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const flags = await getEvaluatedFeatureFlags({
      workspaceId: session.workspaceId
    });

    return NextResponse.json({
      success: true,
      flags,
      meta: {
        workspaceId: session.workspaceId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
