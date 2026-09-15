import { requireWorkspaceResource } from '../../../web/src/lib/security/authz';

export async function runBolaTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const bolaAttempt = await requireWorkspaceResource({
    userId: 'attacker-id',
    workspaceId: 'victim-workspace-id',
    resourceId: 'victim-application-id',
    resource: 'application',
    permission: 'view_applications'
  });

  results.push({
    name: 'Broken Object Level Authorization (BOLA) Prevention',
    passed: !bolaAttempt.authorized,
    details: 'Attacker querying victim object ID must be DENIED server-side.'
  });

  return results;
}
