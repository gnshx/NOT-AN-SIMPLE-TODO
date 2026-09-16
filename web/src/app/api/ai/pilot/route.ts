import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthentication } from '@/lib/security/auth';
import { checkDistributedRateLimit } from '@/lib/security/rateLimiter';
import { detectPromptInjection } from '@/lib/security/promptInjection';
import { handleApiError, RateLimitError, AppError } from '@/lib/errors';

const PilotRequestSchema = z.object({
  query: z.string().min(1, 'Query parameter is required').max(4000, 'Query exceeds maximum length of 4000 characters'),
  workspaceId: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    // 1. Rate limiting on AI endpoint (20 requests/minute)
    const rateLimit = await checkDistributedRateLimit('ai', ip);
    if (rateLimit.limited) {
      throw new RateLimitError(rateLimit.retryAfterSeconds);
    }

    // 2. Input validation
    const body = await request.json().catch(() => null);
    const { query, workspaceId } = PilotRequestSchema.parse(body);

    const targetWorkspaceId = workspaceId || session.workspaceId;
    if (workspaceId && workspaceId !== session.workspaceId) {
      throw new AppError('Forbidden: Cannot invoke AI pilot across workspaces.', 403, 'FORBIDDEN');
    }

    // 3. Prompt Injection Defense
    const scan = detectPromptInjection(query);
    if (scan.detected) {
      throw new AppError(
        `Request blocked by AI Security Firewall: ${scan.reason || 'Malicious prompt injection detected.'}`,
        400,
        'PROMPT_INJECTION_DETECTED',
        { category: scan.category, confidence: scan.confidence }
      );
    }

    // 4. Gateway Execution with Budget, Routing, and Safeguards
    const { executeAiGateway } = await import('@/lib/ai/gateway');
    const response = await executeAiGateway({
      query,
      userId: session.userId,
      workspaceId: targetWorkspaceId,
      role: (session.role as any) || 'MEMBER',
      tier: 'PRO'
    });
    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

