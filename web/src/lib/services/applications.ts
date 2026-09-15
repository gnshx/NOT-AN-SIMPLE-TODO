/**
 * P0-02: Applications service — BOLA hardened.
 * Every query is bound to session.workspaceId resolved server-side from an authenticated session.
 * Callers MUST provide a UserSession, never a raw workspaceId from client input.
 */

import { prisma } from '../db';
import type { UserSession } from '../security/auth';

export interface ApplicationRecord {
  id: string;
  workspaceId: string;
  company: string;
  role: string;
  status: string;
  platform: string;
  appliedDate: string;
  oaLink?: string | null;
  interviewDate?: string | null;
  recruiterName?: string | null;
  scamRisk?: string | null;
  riskNotes?: string | null;
  prepSheet?: string | null;
  matchScore: number;
}

/**
 * Returns applications strictly scoped to the authenticated user's workspace.
 * workspaceId is resolved from the server-validated session — NEVER from client input.
 */
export async function getApplicationsByWorkspace(
  session: UserSession
): Promise<ApplicationRecord[]> {
  if (!session || !session.workspaceId || !session.userId) {
    throw new Error('Unauthorized: Valid authenticated session required.');
  }

  const { workspaceId } = session;

  if (!prisma) {
    // Return structured default data if database is initializing (dev only)
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database client unavailable in production.');
    }
    return [
      {
        id: 'app-google-1',
        workspaceId,
        company: 'Google',
        role: 'Software Engineer (Backend)',
        status: 'Interview Scheduled',
        platform: 'Company Portal',
        appliedDate: '2026-05-02',
        interviewDate: '2026-05-15',
        recruiterName: 'Alex Rivera',
        scamRisk: 'Low',
        riskNotes: 'Established tier-1 tech enterprise.',
        prepSheet: 'Focus area: Concurrency & System Design.',
        matchScore: 94.0
      },
      {
        id: 'app-stripe-1',
        workspaceId,
        company: 'Stripe',
        role: 'Backend Engineer',
        status: 'Under Review',
        platform: 'Direct Email',
        appliedDate: '2026-05-05',
        recruiterName: 'Sarah Jenkins',
        scamRisk: 'Low',
        riskNotes: 'Verified global payments infrastructure platform.',
        prepSheet: 'Focus area: API design & distributed idempotency.',
        matchScore: 90.0
      },
      {
        id: 'app-acme-1',
        workspaceId,
        company: 'Acme Corp',
        role: 'Full Stack Engineer',
        status: 'Applied',
        platform: 'LinkedIn',
        appliedDate: '2026-05-08',
        scamRisk: 'Low',
        matchScore: 84.0
      }
    ];
  }

  try {
    const records = await prisma.application.findMany({
      // workspaceId comes from session — never from client-provided input
      where: { workspaceId },
      include: { company: true },
      orderBy: { appliedDate: 'desc' }
    });

    return records.map((r: any) => ({
      id: r.id,
      workspaceId: r.workspaceId,
      company: r.company?.name || 'Unknown',
      role: r.role,
      status: mapStatusLabel(r.status),
      platform: r.platform,
      appliedDate: r.appliedDate ? r.appliedDate.toISOString().split('T')[0] : '',
      oaLink: r.oaLink,
      interviewDate: r.interviewDate ? r.interviewDate.toISOString().split('T')[0] : null,
      recruiterName: r.recruiterName,
      scamRisk: r.company?.scamRisk || 'Low',
      riskNotes: r.company?.riskNotes || '',
      prepSheet: r.notes || '',
      matchScore: r.matchScore || 85.0
    }));
  } catch (err) {
    console.error('Failed to query applications from database:', err);
    return [];
  }
}

function mapStatusLabel(statusEnum: string): string {
  const map: Record<string, string> = {
    SAVED: 'Saved',
    APPLIED: 'Applied',
    UNDER_REVIEW: 'Under Review',
    OA_SENT: 'OA Sent',
    INTERVIEW_SCHEDULED: 'Interview Scheduled',
    OFFER: 'Offer',
    REJECTED: 'Rejected',
    GHOSTED: 'Ghosted'
  };
  return map[statusEnum] || statusEnum;
}
