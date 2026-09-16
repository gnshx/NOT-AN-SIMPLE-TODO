import { requireWorkspaceResource } from '../../../web/src/lib/security/authz';

export async function runCrossTenantUpdateTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // User A in Workspace A attempting to update an Application in Workspace B
  const auth = await requireWorkspaceResource({
    userId: 'user-a-111',
    workspaceId: 'workspace-b-222',
    resourceId: 'app-b-999',
    resource: 'application',
    permission: 'edit_applications'
  });

  results.push({
    name: 'Tenancy: Cross-tenant update isolation',
    passed: !auth.authorized,
    details: 'User A updating application app-b-999 in Workspace B must be DENIED.'
  });

  return results;
}
