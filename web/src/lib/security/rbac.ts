export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER';

export type Permission =
  | 'view_applications'
  | 'create_applications'
  | 'edit_applications'
  | 'delete_applications'
  | 'view_analytics'
  | 'manage_ai_settings'
  | 'approve_ai_actions'
  | 'manage_users'
  | 'manage_billing'
  | 'export_workspace'
  | 'view_audit_logs'
  | 'manage_security_settings';

export interface CapabilityRule {
  capability: string;
  permission: Permission;
  OWNER: boolean;
  ADMIN: boolean;
  MANAGER: boolean;
  MEMBER: boolean;
  VIEWER: boolean;
}

export const CAPABILITY_MATRIX: CapabilityRule[] = [
  {
    capability: 'View applications',
    permission: 'view_applications',
    OWNER: true,
    ADMIN: true,
    MANAGER: true,
    MEMBER: true,
    VIEWER: true
  },
  {
    capability: 'Create applications',
    permission: 'create_applications',
    OWNER: true,
    ADMIN: true,
    MANAGER: true,
    MEMBER: true,
    VIEWER: false
  },
  {
    capability: 'Edit applications',
    permission: 'edit_applications',
    OWNER: true,
    ADMIN: true,
    MANAGER: true,
    MEMBER: true,
    VIEWER: false
  },
  {
    capability: 'Delete applications',
    permission: 'delete_applications',
    OWNER: true,
    ADMIN: true,
    MANAGER: false,
    MEMBER: false,
    VIEWER: false
  },
  {
    capability: 'Manage members',
    permission: 'manage_users',
    OWNER: true,
    ADMIN: true,
    MANAGER: false,
    MEMBER: false,
    VIEWER: false
  },
  {
    capability: 'Approve AI actions',
    permission: 'approve_ai_actions',
    OWNER: true,
    ADMIN: true,
    MANAGER: true,
    MEMBER: false,
    VIEWER: false
  },
  {
    capability: 'Export workspace',
    permission: 'export_workspace',
    OWNER: true,
    ADMIN: true,
    MANAGER: false,
    MEMBER: false,
    VIEWER: false
  },
  {
    capability: 'View audit logs',
    permission: 'view_audit_logs',
    OWNER: true,
    ADMIN: true,
    MANAGER: true,
    MEMBER: false,
    VIEWER: false
  },
  {
    capability: 'Change security settings',
    permission: 'manage_security_settings',
    OWNER: true,
    ADMIN: true,
    MANAGER: false,
    MEMBER: false,
    VIEWER: false
  },
  {
    capability: 'Manage billing',
    permission: 'manage_billing',
    OWNER: true,
    ADMIN: false,
    MANAGER: false,
    MEMBER: false,
    VIEWER: false
  }
];

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [
    'view_applications',
    'create_applications',
    'edit_applications',
    'delete_applications',
    'view_analytics',
    'manage_ai_settings',
    'approve_ai_actions',
    'manage_users',
    'manage_billing',
    'export_workspace',
    'view_audit_logs',
    'manage_security_settings'
  ],
  ADMIN: [
    'view_applications',
    'create_applications',
    'edit_applications',
    'delete_applications',
    'view_analytics',
    'manage_ai_settings',
    'approve_ai_actions',
    'manage_users',
    'export_workspace',
    'view_audit_logs',
    'manage_security_settings'
  ],
  MANAGER: [
    'view_applications',
    'create_applications',
    'edit_applications',
    'view_analytics',
    'approve_ai_actions',
    'view_audit_logs'
  ],
  MEMBER: [
    'view_applications',
    'create_applications',
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

export function getRoleCapabilitiesMatrix() {
  return CAPABILITY_MATRIX;
}
