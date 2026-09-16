import { requireWorkspaceResource } from '../../../web/src/lib/security/authz';

export async function runCrossTenantCreateTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // User A in Workspace A attempting to create an Application inside Workspace B
  const auth = await requireWorkspaceResource({
    userId: 'user-a-111',
    workspaceId: 'workspace-b-222',
    resource: 'application',
    permission: 'edit_applications'
  });

  results.push({
    name: 'Tenancy: Cross-tenant resource creation isolation',
    passed: !auth.authorized,
    details: 'User A creating an application in Workspace B must be DENIED server-side.'
  });

  return results;
}
