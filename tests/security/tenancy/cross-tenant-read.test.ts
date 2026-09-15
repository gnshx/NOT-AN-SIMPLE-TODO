import { requireWorkspaceResource } from '../../../web/src/lib/security/authz';

export async function runCrossTenantReadTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // User A in Workspace A attempting to read Workspace B Application B
  const res = await requireWorkspaceResource({
    userId: 'user-a-111',
    workspaceId: 'workspace-b-222',
    resourceId: 'app-b-999',
    resource: 'application',
    permission: 'view_applications'
  });

  results.push({
    name: 'Cross-tenant read isolation',
    passed: !res.authorized,
    details: 'User A attempting GET /applications/app-b-999 in Workspace B must be DENIED.'
  });

  return results;
}
