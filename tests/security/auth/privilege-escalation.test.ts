import { hasPermission } from '../../../web/src/lib/security/rbac';

export function runPrivilegeEscalationTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: MEMBER attempting OWNER privilege (manage_billing)
  const memberBilling = hasPermission('MEMBER', 'manage_billing');
  results.push({
    name: 'MEMBER privilege escalation to billing',
    passed: !memberBilling,
    details: 'MEMBER role must NOT be granted manage_billing capability.'
  });

  // Test 2: VIEWER attempting ADMIN privilege (manage_users)
  const viewerManageUsers = hasPermission('VIEWER', 'manage_users');
  results.push({
    name: 'VIEWER privilege escalation to user management',
    passed: !viewerManageUsers,
    details: 'VIEWER role must NOT be granted manage_users capability.'
  });

  return results;
}
