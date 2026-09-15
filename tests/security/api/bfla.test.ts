import { hasPermission } from '../../../web/src/lib/security/rbac';

export function runBflaTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const bflaAttempt = hasPermission('MEMBER', 'manage_security_settings');

  results.push({
    name: 'Broken Function Level Authorization (BFLA) Prevention',
    passed: !bflaAttempt,
    details: 'MEMBER invoking privileged admin function endpoint must be DENIED.'
  });

  return results;
}
