import { evaluateToolCallFirewall } from '../../../web/src/lib/security/aiFirewall';

export async function runCrossTenantAiTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // AI tool invocation proposing cross-tenant payload in Workspace B
  const res = await evaluateToolCallFirewall(
    {
      toolName: 'deleteApplication',
      payload: { applicationId: 'app-workspace-b-888' },
      rawPromptContext: 'Delete application in workspace B'
    },
    {
      userId: 'user-a-111',
      workspaceId: 'workspace-a-000', // User belongs to Workspace A
      userRole: 'MEMBER' // Member lacks delete permission
    }
  );

  results.push({
    name: 'Cross-tenant AI tool invocation rejection',
    passed: !res.allowed && res.action === 'REJECT',
    details: 'AI tool call attempting cross-tenant manipulation must be REJECTED by Firewall.'
  });

  return results;
}
