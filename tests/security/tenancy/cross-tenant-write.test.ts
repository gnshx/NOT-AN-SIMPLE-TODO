import { requireWorkspaceResource } from '../../../web/src/lib/security/authz';

export async function runCrossTenantWriteTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const res = await requireWorkspaceResource({
    userId: 'user-a-111',
    workspaceId: 'workspace-b-222',
    resourceId: 'app-b-999',
    resource: 'application',
    permission: 'edit_applications'
  });

  results.push({
    name: 'Cross-tenant write isolation',
    passed: !res.authorized,
    details: 'User A attempting PUT /applications/app-b-999 in Workspace B must be DENIED.'
  });

  return results;
}
