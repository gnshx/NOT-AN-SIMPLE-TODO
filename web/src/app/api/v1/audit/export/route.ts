import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAuthentication } from '@/lib/security/auth';
import { getAuditLogsForWorkspace, verifyAuditChainIntegrity } from '@/lib/security/auditLog';
import { handleApiError } from '@/lib/errors';

/**
 * P6-05: Tamper-Evident Audit Log Export API.
 * Emits cryptographically verifiable audit trails with SHA-256 integrity proofs.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthentication(req.headers);

    if (session.role !== 'OWNER' && session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only workspace Administrators can export audit logs.' },
        { status: 403 }
      );
    }

    // Retrieve full workspace audit log history
    const logs = await getAuditLogsForWorkspace(session.workspaceId);

    // Verify cryptographic chain
    const chainVerification = verifyAuditChainIntegrity(logs);
    const lastHash = logs.length > 0 ? logs[logs.length - 1].eventHash : '0000000000000000000000000000000000000000000000000000000000000000';

    const payload = {
      exportMetadata: {
        workspaceId: session.workspaceId,
        exportedBy: session.userId,
        exportedAt: new Date().toISOString(),
        totalRecords: logs.length
      },
      cryptographicProof: {
        chainIntegrityVerified: chainVerification.valid,
        brokenAtEventId: chainVerification.brokenAtEventId,
        genesisHash: logs[0]?.previousEventHash || '0000000000000000000000000000000000000000000000000000000000000000',
        headHash: lastHash,
        exportSignature: crypto
          .createHmac('sha256', process.env.AUTH_SECRET || 'daynight-audit-signing-secret')
          .update(`${session.workspaceId}:${logs.length}:${lastHash}`)
          .digest('hex')
      },
      logs
    };

    const download = new URL(req.url).searchParams.get('download') === 'true';
    if (download) {
      return new NextResponse(JSON.stringify(payload, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="audit-export-${session.workspaceId}-${Date.now()}.json"`,
          'X-Audit-Chain-Valid': String(chainVerification.valid)
        }
      });
    }

    return NextResponse.json(payload);
  } catch (err: any) {
    return handleApiError(err);
  }
}
