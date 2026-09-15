import { prisma } from '@/lib/db';
import { requireWorkspaceResource } from './authz';
import { Permission } from './rbac';

/**
 * P1-04: Scoped Database Access Layer for DayNight Pilot.
 * Guarantees that every database operation is bound to a validated workspaceId
 * and authenticated user session, eliminating cross-tenant leakage (BOLA).
 * Filters out soft-deleted records (deletedAt: null).
 */
export class ScopedDb {
  constructor(private userId: string, private workspaceId: string) {}

  private checkDb() {
    if (!prisma) {
      throw new Error('Database client unavailable.');
    }
    return prisma;
  }

  // ── APPLICATIONS ────────────────────────────────────────────────────────────

  async getApplications(permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'application',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.application.findMany({
      where: { workspaceId: this.workspaceId, deletedAt: null },
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

    const db = this.checkDb();
    return db.application.findFirst({
      where: { id, workspaceId: this.workspaceId, deletedAt: null },
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

    const db = this.checkDb();
    return db.application.create({
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

    const db = this.checkDb();
    return db.application.update({
      where: { id },
      data
    });
  }

  async deleteApplication(id: string, hardDelete = false, permission: Permission = 'delete_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'application',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    if (hardDelete) {
      return db.application.delete({ where: { id } });
    }
    return db.application.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  // ── OPPORTUNITIES ───────────────────────────────────────────────────────────

  async getOpportunities(permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'opportunity',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.jobOpportunity.findMany({
      where: { workspaceId: this.workspaceId, deletedAt: null },
      include: { company: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ── RESUMES (P1-04) ─────────────────────────────────────────────────────────

  async getResumes(permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'resume',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.resumeVersion.findMany({
      where: { workspaceId: this.workspaceId, deletedAt: null },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getResumeById(id: string, permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'resume',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.resumeVersion.findFirst({
      where: { id, workspaceId: this.workspaceId, deletedAt: null },
      include: { applications: true }
    });
  }

  async createResume(data: any, permission: Permission = 'edit_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'resume',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.resumeVersion.create({
      data: {
        ...data,
        workspaceId: this.workspaceId
      }
    });
  }

  async updateResume(id: string, data: any, permission: Permission = 'edit_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'resume',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.resumeVersion.update({
      where: { id },
      data
    });
  }

  async deleteResume(id: string, hardDelete = false, permission: Permission = 'delete_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'resume',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    if (hardDelete) {
      return db.resumeVersion.delete({ where: { id } });
    }
    return db.resumeVersion.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  // ── INTERVIEWS (P1-04) ──────────────────────────────────────────────────────

  async getInterviews(permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'interview',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.interviewSession.findMany({
      where: { workspaceId: this.workspaceId, deletedAt: null },
      include: { application: true, mockInterviews: true },
      orderBy: { scheduledAt: 'asc' }
    });
  }

  async getInterviewById(id: string, permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'interview',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.interviewSession.findFirst({
      where: { id, workspaceId: this.workspaceId, deletedAt: null },
      include: { application: true, mockInterviews: true }
    });
  }

  async createInterview(data: any, permission: Permission = 'edit_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'interview',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.interviewSession.create({
      data: {
        ...data,
        workspaceId: this.workspaceId
      }
    });
  }

  async updateInterview(id: string, data: any, permission: Permission = 'edit_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'interview',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.interviewSession.update({
      where: { id },
      data
    });
  }

  async deleteInterview(id: string, hardDelete = false, permission: Permission = 'delete_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'interview',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    if (hardDelete) {
      return db.interviewSession.delete({ where: { id } });
    }
    return db.interviewSession.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  // ── TASKS ───────────────────────────────────────────────────────────────────

  async getTasks(permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'task',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.task.findMany({
      where: { workspaceId: this.workspaceId, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createTask(data: any, permission: Permission = 'edit_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'task',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.task.create({
      data: {
        ...data,
        workspaceId: this.workspaceId
      }
    });
  }

  // ── AI ACTIONS ──────────────────────────────────────────────────────────────

  async getAiActions(permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'aiAction',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.aiAction.findMany({
      where: { workspaceId: this.workspaceId, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ── AI MEMORY (P1-04) ───────────────────────────────────────────────────────

  async getAiMemories(permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'aiMemory',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.aiMemory.findMany({
      where: { workspaceId: this.workspaceId, deletedAt: null },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getAiMemoryByKey(category: string, key: string, permission: Permission = 'view_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'aiMemory',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.aiMemory.findFirst({
      where: { workspaceId: this.workspaceId, category, key, deletedAt: null }
    });
  }

  async upsertAiMemory(
    category: string,
    key: string,
    value: string,
    confidence = 95.0,
    source = 'User Input',
    permission: Permission = 'edit_applications'
  ) {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resource: 'aiMemory',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    return db.aiMemory.upsert({
      where: {
        workspaceId_category_key: {
          workspaceId: this.workspaceId,
          category,
          key
        }
      },
      update: { value, confidence, source, deletedAt: null },
      create: {
        workspaceId: this.workspaceId,
        category,
        key,
        value,
        confidence,
        source
      }
    });
  }

  async deleteAiMemory(id: string, hardDelete = false, permission: Permission = 'delete_applications') {
    const auth = await requireWorkspaceResource({
      userId: this.userId,
      workspaceId: this.workspaceId,
      resourceId: id,
      resource: 'aiMemory',
      permission
    });
    if (!auth.authorized) throw new Error(auth.reason);

    const db = this.checkDb();
    if (hardDelete) {
      return db.aiMemory.delete({ where: { id } });
    }
    return db.aiMemory.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
