import { requireWorkspaceResource } from '../../../web/src/lib/security/authz';

export async function runCrossTenantDownloadTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // User A attempting to download export or resume file belonging to Workspace B
  const auth = await requireWorkspaceResource({
    userId: 'user-a-111',
    workspaceId: 'workspace-b-222',
    resourceId: 'resume-b-555',
    resource: 'resume',
    permission: 'view_applications'
  });

  results.push({
    name: 'Tenancy: Cross-tenant file download isolation',
    passed: !auth.authorized,
    details: 'User A attempting to download a resume file from Workspace B must be DENIED.'
  });

  return results;
}
