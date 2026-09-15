import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthentication } from '@/lib/security/auth';
import { registerDomain, checkDomainVerification } from '@/lib/domain-verification';
import { handleApiError } from '@/lib/errors';

const RegisterDomainSchema = z.object({
  domain: z.string().min(3).max(255).regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
  method: z.enum(['DNS_TXT', 'HTML_META']).default('DNS_TXT')
});

/**
 * P6-02: Organization Domain Verification API.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthentication(req.headers);
    if (session.role !== 'OWNER' && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only organization administrators can register domains.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = RegisterDomainSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid domain payload', issues: parsed.error.issues }, { status: 400 });
    }

    const record = await registerDomain({
      organizationId: session.organizationId || session.workspaceId,
      domain: parsed.data.domain,
      method: parsed.data.method
    });

    return NextResponse.json(
      {
        message: 'Domain registered for verification.',
        domain: record,
        instructions: {
          DNS_TXT: {
            host: `_daynight-challenge.${record.domain}`,
            value: record.verificationToken
          },
          HTML_META: {
            tag: `<meta name="daynight-verification" content="${record.verificationToken}">`
          }
        }
      },
      { status: 201 }
    );
  } catch (err: any) {
    return handleApiError(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthentication(req.headers);
    const url = new URL(req.url);
    const domain = url.searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({ error: 'Missing domain parameter' }, { status: 400 });
    }

    const record = await checkDomainVerification(domain);
    return NextResponse.json({
      domain: record.domain,
      status: record.status,
      verified: record.status === 'VERIFIED',
      verifiedAt: record.verifiedAt
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
