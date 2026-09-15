import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createExportJob, getExportJob, ExportFormat } from '@/lib/exports/exportService';
import { requireAuthentication } from '@/lib/security/auth';
import { handleApiError } from '@/lib/errors';

const ExportRequestSchema = z.object({
  format: z.enum(['JSON', 'CSV']).default('JSON')
});

/**
 * P5-07: Async Data Export API.
 * POST: Initiates export job for the authenticated workspace.
 * GET: Retrieves export status or downloads completed dataset.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthentication(req.headers);
    const body = await req.json().catch(() => ({}));
    const parsed = ExportRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid export request payload.', issues: parsed.error.issues }, { status: 400 });
    }

    const job = await createExportJob({
      workspaceId: session.workspaceId,
      userId: session.userId,
      format: parsed.data.format as ExportFormat
    });

    return NextResponse.json(
      {
        message: 'Data export job created successfully.',
        job: {
          id: job.id,
          status: job.status,
          format: job.format,
          createdAt: job.createdAt,
          downloadUrl: job.downloadUrl
        }
      },
      { status: 202 }
    );
  } catch (err: any) {
    return handleApiError(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthentication(req.headers);
    const url = new URL(req.url);
    const exportId = url.searchParams.get('exportId');

    if (!exportId) {
      return NextResponse.json({ error: 'Missing exportId parameter.' }, { status: 400 });
    }

    const job = await getExportJob(exportId, session.workspaceId);
    if (!job) {
      return NextResponse.json({ error: 'Export job not found or belongs to another workspace.' }, { status: 404 });
    }

    // If completed and download parameter requested, stream file
    const download = url.searchParams.get('download') === 'true';
    if (job.status === 'COMPLETED' && download && job.dataPayload) {
      const contentType = job.format === 'JSON' ? 'application/json' : 'text/csv';
      const filename = `daynight-export-${job.workspaceId}-${job.id}.${job.format.toLowerCase()}`;

      return new NextResponse(job.dataPayload, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'X-Export-Checksum': job.checksumSha256 || ''
        }
      });
    }

    return NextResponse.json({
      exportId: job.id,
      status: job.status,
      format: job.format,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      checksumSha256: job.checksumSha256,
      downloadUrl: job.downloadUrl
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
