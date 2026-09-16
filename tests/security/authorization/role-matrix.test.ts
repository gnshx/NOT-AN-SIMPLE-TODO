import { hasPermission, Role, Permission } from '../../../web/src/lib/security/rbac';

export function runRoleMatrixTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: OWNER role capabilities (must possess all permissions)
  const allPermissions: Permission[] = [
    'view_applications',
    'edit_applications',
    'delete_applications',
    'manage_users',
    'manage_security_settings',
    'view_audit_logs',
    'export_workspace',
    'manage_billing'
  ];


  let ownerHasAll = true;
  for (const perm of allPermissions) {
    if (!hasPermission('OWNER', perm)) {
      ownerHasAll = false;
    }
  }
  results.push({
    name: 'Authorization: OWNER role capability completeness',
    passed: ownerHasAll,
    details: 'OWNER role must have authorization across all permissions.'
  });

  // Test 2: Vertical Privilege Escalation (ADMIN cannot manage billing)
  const adminBilling = hasPermission('ADMIN', 'manage_billing');
  results.push({
    name: 'Authorization: ADMIN vertical privilege escalation prevention (manage_billing)',
    passed: !adminBilling,
    details: 'ADMIN role must NOT have manage_billing capability (reserved for OWNER).'
  });

  // Test 3: Vertical Privilege Escalation (MANAGER cannot manage users or billing)
  const managerUsers = hasPermission('MANAGER', 'manage_users');
  const managerBilling = hasPermission('MANAGER', 'manage_billing');
  results.push({
    name: 'Authorization: MANAGER vertical privilege escalation prevention',
    passed: !managerUsers && !managerBilling,
    details: 'MANAGER role must NOT have manage_users or manage_billing capabilities.'
  });

  // Test 4: Vertical Privilege Escalation (MEMBER cannot delete applications or export workspace)
  const memberDelete = hasPermission('MEMBER', 'delete_applications');
  const memberExport = hasPermission('MEMBER', 'export_workspace');
  results.push({
    name: 'Authorization: MEMBER vertical privilege escalation prevention',
    passed: !memberDelete && !memberExport,
    details: 'MEMBER role must NOT have delete_applications or export_workspace capabilities.'
  });

  // Test 5: VIEWER role restriction (read-only only)
  const viewerRead = hasPermission('VIEWER', 'view_applications');
  const viewerEdit = hasPermission('VIEWER', 'edit_applications');
  const viewerDelete = hasPermission('VIEWER', 'delete_applications');
  results.push({
    name: 'Authorization: VIEWER read-only enforcement',
    passed: viewerRead && !viewerEdit && !viewerDelete,
    details: 'VIEWER role must possess view_applications but NOT any mutation permissions.'
  });

  return results;
}
