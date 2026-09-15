import { NextResponse } from 'next/server';
import { getApplicationsByWorkspace } from '@/lib/services/applications';
import { requireAuthentication } from '@/lib/security/auth';

export async function GET(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const applications = await getApplicationsByWorkspace(session);

    return NextResponse.json({
      jobs: applications,
      total: applications.length,
      isMock: false,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: error.message || 'Failed to fetch job applications' }, { status });
  }
}
