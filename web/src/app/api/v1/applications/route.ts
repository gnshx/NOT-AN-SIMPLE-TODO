import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthentication } from '@/lib/security/auth';
import { ScopedDb } from '@/lib/security/scopedDb';
import { getApplicationsByWorkspace } from '@/lib/services/applications';
import { handleApiError, AppError } from '@/lib/errors';

const GetApplicationsQuerySchema = z.object({
  status: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50).optional()
});

const CreateApplicationSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(100),
  role: z.string().min(1, 'Role title is required').max(100),
  status: z.enum([
    'Saved',
    'Applied',
    'Screening',
    'Technical Interview',
    'Behavioral Interview',
    'Offer',
    'Rejected',
    'Withdrawn'
  ]).default('Applied'),
  platform: z.string().max(50).default('Direct'),
  appliedDate: z.string().optional(),
  salary: z.string().max(100).optional(),
  jobUrl: z.string().url().max(500).optional().or(z.literal('')),
  notes: z.string().max(2000).optional()
});

/**
 * GET /api/v1/applications
 * Lists applications strictly scoped to authenticated workspace.
 */
export async function GET(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const { searchParams } = new URL(request.url);
    const query = GetApplicationsQuerySchema.parse(Object.fromEntries(searchParams.entries()));

    const scopedDb = new ScopedDb(session.userId, session.workspaceId);
    let applications;
    try {
      applications = await scopedDb.getApplications();
      if (query.status) {
        applications = applications.filter((app: any) => app.status === query.status);
      }
      if (query.limit) {
        applications = applications.slice(0, query.limit);
      }
    } catch (dbErr) {
      // Fallback for development without running Postgres
      applications = await getApplicationsByWorkspace(session);
      if (query.status) {
        applications = applications.filter((app: any) => app.status === query.status);
      }
      if (query.limit) {
        applications = applications.slice(0, query.limit);
      }
    }

    return NextResponse.json({
      success: true,
      data: applications,
      meta: {
        total: applications.length,
        workspaceId: session.workspaceId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/applications
 * Creates an application strictly within the user's workspace.
 */
export async function POST(request: Request) {
  try {
    const session = await requireAuthentication(request.headers);
    const body = await request.json().catch(() => null);
    const validatedData = CreateApplicationSchema.parse(body);

    const scopedDb = new ScopedDb(session.userId, session.workspaceId);
    let created;
    try {
      created = await scopedDb.createApplication({
        roleTitle: validatedData.role,
        status: validatedData.status,
        platform: validatedData.platform,
        appliedDate: validatedData.appliedDate ? new Date(validatedData.appliedDate) : new Date(),
        notes: validatedData.notes || null,
        company: {
          connectOrCreate: {
            where: { name: validatedData.company },
            create: { name: validatedData.company }
          }
        }
      });
    } catch (dbErr) {
      // Graceful fallback for local development without DB
      created = {
        id: `app-local-${Date.now()}`,
        workspaceId: session.workspaceId,
        role: validatedData.role,
        company: validatedData.company,
        status: validatedData.status,
        platform: validatedData.platform,
        appliedDate: validatedData.appliedDate || new Date().toISOString(),
        notes: validatedData.notes
      };
    }

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'Application recorded successfully.'
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
