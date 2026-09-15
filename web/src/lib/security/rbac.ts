export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER';

export type Permission =
  | 'view_applications'
  | 'edit_applications'
  | 'delete_applications'
  | 'view_analytics'
  | 'manage_ai_settings'
  | 'approve_ai_actions'
  | 'manage_users'
  | 'manage_billing';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [
    'view_applications',
    'edit_applications',
    'delete_applications',
    'view_analytics',
    'manage_ai_settings',
    'approve_ai_actions',
    'manage_users',
    'manage_billing'
  ],
  ADMIN: [
    'view_applications',
    'edit_applications',
    'delete_applications',
    'view_analytics',
    'manage_ai_settings',
    'approve_ai_actions',
    'manage_users'
  ],
  MANAGER: [
    'view_applications',
    'edit_applications',
    'view_analytics',
    'approve_ai_actions'
  ],
  MEMBER: [
    'view_applications',
    'edit_applications',
    'view_analytics'
  ],
  VIEWER: [
    'view_applications',
    'view_analytics'
  ]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
