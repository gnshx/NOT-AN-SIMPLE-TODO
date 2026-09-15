import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthentication } from '@/lib/security/auth';
import { generateApiKey, listWorkspaceApiKeys, revokeApiKey, ApiKeyScope } from '@/lib/security/apiKeyService';
import { handleApiError, AppError } from '@/lib/errors';

const CreateApiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required').max(100),
  scopes: z.array(z.enum(['read_only', 'full_access', 'ai_pilot'])).default(['read_only']),
  expiresInDays: z.number().min(1).max(365).optional()
});

/**
 * GET /api/v1/keys
 * Lists active API keys for workspace (hashes and secrets hidden).
 */
export async function GET(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const keys = await listWorkspaceApiKeys(session.workspaceId);

    return NextResponse.json({
      success: true,
      data: keys,
      meta: {
        total: keys.length,
        workspaceId: session.workspaceId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/keys
 * Generates a new API key. Returns plaintext key once.
 */
export async function POST(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const body = await request.json().catch(() => null);
    const { name, scopes, expiresInDays } = CreateApiKeySchema.parse(body);

    const { plaintextKey, keyRecord } = generateApiKey({
      workspaceId: session.workspaceId,
      name,
      scopes: scopes as ApiKeyScope[],
      expiresInDays
    });

    return NextResponse.json(
      {
        success: true,
        apiKey: plaintextKey,
        keyRecord: {
          id: keyRecord.id,
          name: keyRecord.name,
          keyPrefix: keyRecord.keyPrefix,
          scopes: keyRecord.scopes,
          createdAt: keyRecord.createdAt,
          expiresAt: keyRecord.expiresAt
        },
        warning: 'Store this API key in a secure location. You will not be able to view the plaintext secret again.'
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/v1/keys
 * Revokes an existing API key by keyId.
 */
export async function DELETE(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('id');

    if (!keyId) {
      throw new AppError('Key ID parameter is required for revocation.', 400, 'KEY_ID_REQUIRED');
    }

    const revoked = await revokeApiKey(session.workspaceId, keyId);
    if (!revoked) {
      throw new AppError('API key not found or already revoked.', 404, 'KEY_NOT_FOUND');
    }

    return NextResponse.json({
      success: true,
      message: `API key ${keyId} revoked successfully.`
    });
  } catch (error) {
    return handleApiError(error);
  }
}
