import { evaluateToolCallFirewall } from '../../lib/security/aiFirewall';

export async function runAiFirewallTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: READ_ONLY tool auto-execute for MEMBER
  const readRes = await evaluateToolCallFirewall(
    { toolName: 'searchApplications', payload: { query: 'Google' } },
    { userId: 'u1', workspaceId: 'w1', userRole: 'MEMBER' }
  );
  results.push({
    name: 'READ_ONLY tool execution',
    passed: readRes.allowed && readRes.action === 'EXECUTE',
    details: 'READ_ONLY tool should execute automatically for MEMBER role.'
  });

  // Test 2: HIGH risk tool requires Human Approval
  const highRes = await evaluateToolCallFirewall(
    { toolName: 'deleteApplication', payload: { applicationId: 'app-123' } },
    { userId: 'u1', workspaceId: 'w1', userRole: 'ADMIN' }
  );
  results.push({
    name: 'HIGH risk tool human approval requirement',
    passed: highRes.allowed && highRes.action === 'REQUIRE_HUMAN_APPROVAL',
    details: 'HIGH risk tool (deleteApplication) must require explicit human approval.'
  });

  // Test 3: Unauthorized tool call rejection (VIEWER trying to delete)
  const forbiddenRes = await evaluateToolCallFirewall(
    { toolName: 'deleteApplication', payload: { applicationId: 'app-123' } },
    { userId: 'u1', workspaceId: 'w1', userRole: 'VIEWER' }
  );
  results.push({
    name: 'Unauthorized AI tool invocation rejection',
    passed: !forbiddenRes.allowed && forbiddenRes.action === 'REJECT',
    details: 'VIEWER role proposing deleteApplication MUST be rejected by Firewall.'
  });

  // Test 4: CRITICAL tool step-up authentication requirement
  const criticalRes = await evaluateToolCallFirewall(
    { toolName: 'changeOwner', payload: { newOwnerUserId: 'user-2' } },
    { userId: 'u1', workspaceId: 'w1', userRole: 'OWNER', stepUpAuthenticated: false }
  );
  results.push({
    name: 'CRITICAL tool step-up authentication requirement',
    passed: !criticalRes.allowed && criticalRes.action === 'REQUIRE_STEP_UP_AUTH',
    details: 'CRITICAL risk tool without step-up authentication must be denied.'
  });

  return results;
}
