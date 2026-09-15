import { z } from 'zod';

export interface ToolDefinition<TInput = any, TOutput = any> {
  name: string;
  description: string;
  schema: z.ZodType<TInput>;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  requiresApproval: boolean;
  execute: (input: TInput, ctx: { workspaceId: string }) => Promise<TOutput>;
}

export const toolsRegistry: Record<string, ToolDefinition> = {
  searchApplications: {
    name: 'searchApplications',
    description: 'Search tracked job applications by company, role, or status.',
    riskLevel: 'LOW',
    requiresApproval: false,
    schema: z.object({
      query: z.string().optional(),
      status: z.string().optional(),
      limit: z.number().default(10)
    }),
    execute: async (input, ctx) => {
      // Return structured search results
      return {
        results: [
          { id: 'app-1', company: 'Google', role: 'Software Engineer', status: 'INTERVIEW_SCHEDULED', matchScore: 92 },
          { id: 'app-2', company: 'Stripe', role: 'Backend Engineer', status: 'UNDER_REVIEW', matchScore: 89 },
          { id: 'app-3', company: 'Acme Corp', role: 'Full Stack Engineer', status: 'APPLIED', matchScore: 84 }
        ],
        total: 3
      };
    }
  },

  updateApplicationStatus: {
    name: 'updateApplicationStatus',
    description: 'Update the pipeline status of a specific job application.',
    riskLevel: 'MEDIUM',
    requiresApproval: true,
    schema: z.object({
      applicationId: z.string(),
      companyName: z.string(),
      newStatus: z.enum(['SAVED', 'APPLIED', 'UNDER_REVIEW', 'OA_SENT', 'INTERVIEW_SCHEDULED', 'OFFER', 'REJECTED', 'GHOSTED']),
      reason: z.string()
    }),
    execute: async (input) => {
      return {
        success: true,
        message: `Updated status for ${input.companyName} to ${input.newStatus}`
      };
    }
  },

  createTask: {
    name: 'createTask',
    description: 'Create a new action item or task in the daily planner.',
    riskLevel: 'LOW',
    requiresApproval: false,
    schema: z.object({
      title: z.string(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
      dueDate: z.string().optional(),
      category: z.string().default('General')
    }),
    execute: async (input) => {
      return {
        success: true,
        taskId: `task-${Date.now()}`,
        title: input.title,
        priority: input.priority
      };
    }
  },

  scheduleInterviewPrep: {
    name: 'scheduleInterviewPrep',
    description: 'Generate an interview preparation checklist and schedule study blocks.',
    riskLevel: 'LOW',
    requiresApproval: false,
    schema: z.object({
      companyName: z.string(),
      role: z.string(),
      interviewDate: z.string().optional()
    }),
    execute: async (input) => {
      return {
        success: true,
        prepSheet: [
          `1. Review ${input.companyName} tech stack and core products.`,
          `2. Practice 3 STAR stories focused on ${input.role} challenges.`,
          `3. Review System Design patterns & data structures.`
        ]
      };
    }
  },

  proposeEmailReply: {
    name: 'proposeEmailReply',
    description: 'Draft a recruiter follow-up or scheduling email.',
    riskLevel: 'HIGH',
    requiresApproval: true,
    schema: z.object({
      recipientEmail: z.string(),
      subject: z.string(),
      body: z.string()
    }),
    execute: async (input) => {
      return {
        success: true,
        draftId: `draft-${Date.now()}`,
        status: 'PROPOSED_PENDING_APPROVAL'
      };
    }
  }
};
