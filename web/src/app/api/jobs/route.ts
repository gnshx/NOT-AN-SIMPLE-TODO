import { NextResponse } from 'next/server';
import { getApplicationsByWorkspace } from '@/lib/services/applications';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws-default-1';

    const applications = await getApplicationsByWorkspace(workspaceId);

    return NextResponse.json({
      jobs: applications,
      total: applications.length,
      isMock: false,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch job applications' }, { status: 500 });
  }
}
