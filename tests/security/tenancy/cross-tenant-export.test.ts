import { requireWorkspaceResource } from '../../../web/src/lib/security/authz';

export async function runCrossTenantExportTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const res = await requireWorkspaceResource({
    userId: 'user-a-111',
    workspaceId: 'workspace-b-222',
    resource: 'organization',
    permission: 'export_workspace'
  });

  results.push({
    name: 'Cross-tenant export isolation',
    passed: !res.authorized,
    details: 'User A attempting to export Workspace B archive must be DENIED.'
  });

  return results;
}
