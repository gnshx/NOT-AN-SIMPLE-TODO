import { evaluateToolCallFirewall } from '../../../web/src/lib/security/aiFirewall';

export async function runMassAssignmentTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Attacker adding 'role: OWNER' in payload to createTask tool
  const res = await evaluateToolCallFirewall(
    {
      toolName: 'createTask',
      payload: { title: 'New Task', priority: 'HIGH', role: 'OWNER', isSystemAdmin: true }
    },
    { userId: 'u1', workspaceId: 'w1', userRole: 'MEMBER' }
  );

  const hasInjectedField = res.sanitizedPayload && ('role' in res.sanitizedPayload || 'isSystemAdmin' in res.sanitizedPayload);

  results.push({
    name: 'Mass Assignment protection via strict tool schema whitelist',
    passed: !hasInjectedField,
    details: 'Extra injected role/privilege parameters must be stripped by Firewall schema.'
  });

  return results;
}
