import { prisma } from '@/lib/db';
import { Permission, Role, hasPermission } from './rbac';

export interface AuthContext {
  userId: string;
  workspaceId: string;
  organizationId: string;
  role: Role;
}

export interface ResourceAuthParams {
  userId: string;
  workspaceId: string;
  resourceId?: string;
  resource:
    | 'application'
    | 'opportunity'
    | 'resume'
    | 'interview'
    | 'task'
    | 'aiAction'
    | 'aiMemory'
    | 'auditLog'
    | 'organization';
  permission: Permission;
}

export interface AuthResult {
  authorized: boolean;
  reason?: string;
  context?: AuthContext;
}

/**
 * Resolves user workspace membership and validates role permissions server-side.
 * Strictly prevents Broken Object Level Authorization (BOLA) and Broken Function Level Authorization (BFLA).
 */
export async function resolveAuthContext(userId: string, workspaceId: string): Promise<AuthContext | null> {
  if (!prisma) return null;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { id: true, organizationId: true }
  });

  if (!workspace) return null;

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: workspace.organizationId
      }
    },
    select: { role: true }
  });

  if (!membership) return null;

  return {
    userId,
    workspaceId: workspace.id,
    organizationId: workspace.organizationId,
    role: (membership.role as Role) || 'MEMBER'
  };
}

/**
 * Centralized authorization enforcement function.
 * Checks authentication, workspace membership, role permissions, and resource ownership.
 */
export async function requireWorkspaceResource(params: ResourceAuthParams): Promise<AuthResult> {
  const { userId, workspaceId, resourceId, resource, permission } = params;

  const authCtx = await resolveAuthContext(userId, workspaceId);
  if (!authCtx) {
    return {
      authorized: false,
      reason: 'Unauthorized: User does not belong to the target workspace or workspace does not exist.'
    };
  }

  // 1. Role capability check
  if (!hasPermission(authCtx.role, permission)) {
    return {
      authorized: false,
      reason: `Forbidden: Role '${authCtx.role}' lacks permission '${permission}'.`,
      context: authCtx
    };
  }

  // 2. Resource ownership & tenant boundary check (if resourceId provided)
  if (resourceId && resource !== 'organization') {
    const isOwned = await checkResourceBelongsToWorkspace(resource, resourceId, workspaceId);
    if (!isOwned) {
      return {
        authorized: false,
        reason: `Forbidden: Resource '${resource}:${resourceId}' does not belong to workspace '${workspaceId}'.`,
        context: authCtx
      };
    }
  }

  return {
    authorized: true,
    context: authCtx
  };
}

/**
 * Validates that a specific resource ID belongs to the target workspace ID.
 */
async function checkResourceBelongsToWorkspace(
  resource: string,
  resourceId: string,
  workspaceId: string
): Promise<boolean> {
  if (!prisma) return false;
  try {
    switch (resource) {
      case 'application': {
        const item = await prisma.application.findFirst({
          where: { id: resourceId, workspaceId },
          select: { id: true }
        });
        return !!item;
      }
      case 'opportunity': {
        const item = await prisma.jobOpportunity.findFirst({
          where: { id: resourceId, workspaceId },
          select: { id: true }
        });
        return !!item;
      }
      case 'resume': {
        const item = await prisma.resumeVersion.findFirst({
          where: { id: resourceId, workspaceId },
          select: { id: true }
        });
        return !!item;
      }
      case 'interview': {
        const item = await prisma.interviewSession.findFirst({
          where: { id: resourceId, workspaceId },
          select: { id: true }
        });
        return !!item;
      }
      case 'task': {
        const item = await prisma.task.findFirst({
          where: { id: resourceId, workspaceId },
          select: { id: true }
        });
        return !!item;
      }
      case 'aiAction': {
        const item = await prisma.aiAction.findFirst({
          where: { id: resourceId, workspaceId },
          select: { id: true }
        });
        return !!item;
      }
      case 'aiMemory': {
        const item = await prisma.aiMemory.findFirst({
          where: { id: resourceId, workspaceId },
          select: { id: true }
        });
        return !!item;
      }
      case 'auditLog': {
        const item = await prisma.auditLog.findFirst({
          where: { id: resourceId, workspaceId },
          select: { id: true }
        });
        return !!item;
      }
      default:
        return false;
    }
  } catch (err) {
    return false;
  }
}
