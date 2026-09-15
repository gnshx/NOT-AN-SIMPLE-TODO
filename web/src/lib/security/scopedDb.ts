import { prisma } from '@/lib/db';
import { requireWorkspaceResource } from './authz';
import { Permission } from './rbac';

/**
 * Scoped Database Access Layer for DayNight Pilot.
 * Guarantees that every database operation is bound to a validated workspaceId
 * and authenticated user session, eliminating cross-tenant leakage.
 */
export class ScopedDb {
  constructor(private userId: string, private workspaceId: string) {}

  // --- APPLICATION OPERATIONS ---
  async getApplications(permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'application',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    return prisma.application.findMany({
      where: { workspaceId: this.workspaceId },
      include: { company: true, resumeVersion: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getApplicationById(id: string, permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'application',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    return prisma.application.findFirst({
      where: { id, workspaceId: this.workspaceId },
      include: { company: true, timeline: true, interviews: true }
    });
  }

  async createApplication(data: any, permission: Permission = 'edit_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'application',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    return prisma.application.create({
      data: {
        ...data,
        workspaceId: this.workspaceId
      }
    });
  }

  async updateApplication(id: string, data: any, permission: Permission = 'edit_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'application',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    return prisma.application.update({
      where: { id },
      data
    });
  }

  async deleteApplication(id: string, permission: Permission = 'delete_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'application',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    return prisma.application.delete({
      where: { id }
    });
  }

  // --- OPPORTUNITIES ---
  async getOpportunities() {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'opportunity',
      permission: 'view_applications'
    });
    if (!auth.authorized) throw new Error(auth.reason);

    return prisma.jobOpportunity.findMany({
      where: { workspaceId: this.workspaceId },
      include: { company: true }
    });
  }

  // --- TASKS ---
  async getTasks() {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'task',
      permission: 'view_applications'
    });
    if (!auth.authorized) throw new Error(auth.reason);

    return prisma.task.findMany({
      where: { workspaceId: this.workspaceId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createTask(data: any) {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'task',
      permission: 'edit_applications'
    });
    if (!auth.authorized) throw new Error(auth.reason);

    return prisma.task.create({
      data: {
        ...data,
        workspaceId: this.workspaceId
      }
    });
  }

  // --- AI ACTIONS ---
  async getAiActions() {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'aiAction',
      permission: 'view_applications'
    });
    if (!auth.authorized) throw new Error(auth.reason);

    return prisma.aiAction.findMany({
      where: { workspaceId: this.workspaceId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
