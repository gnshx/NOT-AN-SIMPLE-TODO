import { requireWorkspaceResource } from '../../../web/src/lib/security/authz';

export async function runCrossTenantSearchTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // User A querying search results targeting Workspace B
  const auth = await requireWorkspaceResource({
    userId: 'user-a-111',
    workspaceId: 'workspace-b-222',
    resource: 'application',
    permission: 'view_applications'
  });

  results.push({
    name: 'Tenancy: Cross-tenant search query isolation',
    passed: !auth.authorized,
    details: 'User A attempting to query search index of Workspace B must be DENIED.'
  });

  return results;
}
