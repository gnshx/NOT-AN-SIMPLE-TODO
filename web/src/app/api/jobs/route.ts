import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getApplicationsByWorkspace } from '@/lib/services/applications';
import { requireAuthentication } from '@/lib/security/auth';
import { handleApiError } from '@/lib/errors';

const GetJobsQuerySchema = z.object({
  status: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50).optional()
});

export async function GET(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const { searchParams } = new URL(request.url);
    GetJobsQuerySchema.parse(Object.fromEntries(searchParams.entries()));

    const applications = await getApplicationsByWorkspace(session);

    return NextResponse.json({
      success: true,
      jobs: applications,
      total: applications.length,
      isMock: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return handleApiError(error);
  }
}
