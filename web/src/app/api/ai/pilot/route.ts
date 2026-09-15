import { NextResponse } from 'next/server';
import { runPilotAgent } from '@/lib/ai/pilot';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const response = await runPilotAgent(query, { workspaceId: 'default-workspace' });
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Pilot error' }, { status: 500 });
  }
}
