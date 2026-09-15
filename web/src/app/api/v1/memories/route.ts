import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthentication } from '@/lib/security/auth';
import { AiMemoryService, MemoryCategory } from '@/lib/services/aiMemoryService';
import { handleApiError } from '@/lib/errors';

const GetMemoriesSchema = z.object({
  category: z.enum(['PREFERENCE', 'SKILL', 'TARGET_COMPANY', 'INTERVIEW_STORY', 'FEEDBACK']).optional()
});

const SaveMemorySchema = z.object({
  category: z.enum(['PREFERENCE', 'SKILL', 'TARGET_COMPANY', 'INTERVIEW_STORY', 'FEEDBACK']),
  key: z.string().min(1, 'Memory key is required').max(100),
  value: z.string().min(1, 'Memory value is required').max(2000),
  confidence: z.number().min(0).max(100).optional(),
  source: z.string().max(100).optional()
});

/**
 * GET /api/v1/memories
 * Lists long-term AI memories scoped to the authenticated workspace.
 */
export async function GET(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const { searchParams } = new URL(request.url);
    const { category } = GetMemoriesSchema.parse(Object.fromEntries(searchParams.entries()));

    const service = new AiMemoryService(session.userId, session.workspaceId);
    const memories = await service.listMemories(category as MemoryCategory);

    return NextResponse.json({
      success: true,
      data: memories,
      meta: {
        total: memories.length,
        workspaceId: session.workspaceId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/memories
 * Saves or updates an AI memory item scoped to the workspace.
 */
export async function POST(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const body = await request.json().catch(() => null);
    const validatedData = SaveMemorySchema.parse(body);

    const service = new AiMemoryService(session.userId, session.workspaceId);
    const saved = await service.saveMemory(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: saved,
        message: 'AI memory recorded successfully.'
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
