import { evaluateToolCallFirewall } from '../../../web/src/lib/security/aiFirewall';

export async function runAiPrivilegeEscalationTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const res = await evaluateToolCallFirewall(
    {
      toolName: 'changeOwner',
      payload: { newOwnerUserId: 'attacker-id' }
    },
    { userId: 'u1', workspaceId: 'w1', userRole: 'MEMBER' }
  );

  results.push({
    name: 'AI Tool Privilege Escalation Prevention',
    passed: !res.allowed && res.action === 'REJECT',
    details: 'MEMBER invoking CRITICAL tool changeOwner MUST be rejected.'
  });

  return results;
}
