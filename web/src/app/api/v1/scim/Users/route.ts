import { NextRequest, NextResponse } from 'next/server';
import { listScimUsers, createScimUser } from '@/lib/scim/scimService';
import { requireAuthentication } from '@/lib/security/auth';
import { handleApiError } from '@/lib/errors';

/**
 * P6-04: SCIM 2.0 Users Provisioning Endpoint.
 * RFC 7644 Compliant user directory interface for Okta, Azure AD, OneLogin.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthentication(req.headers);
    const orgId = session.organizationId || session.workspaceId;

    const url = new URL(req.url);
    const startIndex = parseInt(url.searchParams.get('startIndex') || '1', 10);
    const count = parseInt(url.searchParams.get('count') || '50', 10);

    const result = await listScimUsers({
      organizationId: orgId,
      startIndex,
      count
    });

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/scim+json'
      }
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthentication(req.headers);
    const orgId = session.organizationId || session.workspaceId;

    if (session.role !== 'OWNER' && session.role !== 'ADMIN') {
      return NextResponse.json(
        { schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'], detail: 'Forbidden', status: '403' },
        { status: 403, headers: { 'Content-Type': 'application/scim+json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const userName = body.userName || body.emails?.[0]?.value;

    if (!userName) {
      return NextResponse.json(
        { schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'], detail: 'Missing required field: userName', status: '400' },
        { status: 400, headers: { 'Content-Type': 'application/scim+json' } }
      );
    }

    const email = body.emails?.[0]?.value || userName;
    const user = await createScimUser({
      organizationId: orgId,
      userName,
      email,
      givenName: body.name?.givenName,
      familyName: body.name?.familyName,
      displayName: body.displayName,
      active: body.active !== false
    });

    return new NextResponse(JSON.stringify(user), {
      status: 201,
      headers: {
        'Content-Type': 'application/scim+json'
      }
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
