/**
 * @file aiFirewall.ts
 * @description OWASP Top 10 for LLM AI Gateway & Tool Execution Firewall.
 * Regulates agentic tool invocations through 5-tier risk taxonomy (READ_ONLY -> CRITICAL),
 * RBAC authorization checks, human-in-the-loop gates, step-up MFA challenge requirements,
 * prompt injection scanning, and parameter sanitization.
 * 
 * @module lib/security/aiFirewall
 */

import { Permission, Role, hasPermission } from './rbac';
import { detectPromptInjection } from './promptInjection';
import { redactPII } from './dataClassification';

/** Five-tier operational risk classification for AI tool executions */
export type ToolRiskLevel = 'READ_ONLY' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Security metadata definition for an autonomous AI tool invocation.
 */
export interface ToolDefinition {
  /** Canonical tool invocation name */
  name: string;
  /** Functional description */
  description: string;
  /** Security risk tier */
  riskLevel: ToolRiskLevel;
  /** Minimum RBAC permission required for caller */
  requiredPermission: Permission;
  /** Enforces human operator authorization prior to dispatch */
  requiresHumanApproval: boolean;
  /** Enforces re-authentication / MFA step-up challenge */
  requiresStepUpAuth: boolean;
  /** Argument schema validation specification */
  schema: Record<string, string>;
}

export interface ProposedToolCall {
  toolName: string;
  payload: Record<string, any>;
  rawPromptContext?: string;
}

export interface EvaluationContext {
  userId: string;
  workspaceId: string;
  userRole: Role;
  stepUpAuthenticated?: boolean;
}

export interface FirewallDecision {
  allowed: boolean;
  action: 'EXECUTE' | 'REQUIRE_HUMAN_APPROVAL' | 'REQUIRE_STEP_UP_AUTH' | 'REJECT';
  riskLevel: ToolRiskLevel;
  reason: string;
  sanitizedPayload?: Record<string, any>;
}

// Global registry of AI tools and their security properties
export const TOOL_FIREWALL_REGISTRY: Record<string, ToolDefinition> = {
  // READ_ONLY Tools
  searchApplications: {
    name: 'searchApplications',
    description: 'Search target applications in workspace',
    riskLevel: 'READ_ONLY',
    requiredPermission: 'view_applications',
    requiresHumanApproval: false,
    requiresStepUpAuth: false,
    schema: { query: 'string' }
  },
  getResume: {
    name: 'getResume',
    description: 'Retrieve resume details for matching',
    riskLevel: 'READ_ONLY',
    requiredPermission: 'view_applications',
    requiresHumanApproval: false,
    requiresStepUpAuth: false,
    schema: { resumeId: 'string' }
  },
  getInterview: {
    name: 'getInterview',
    description: 'Fetch interview prep notes',
    riskLevel: 'READ_ONLY',
    requiredPermission: 'view_applications',
    requiresHumanApproval: false,
    requiresStepUpAuth: false,
    schema: { interviewId: 'string' }
  },
  getCompany: {
    name: 'getCompany',
    description: 'Fetch company background & trust rating',
    riskLevel: 'READ_ONLY',
    requiredPermission: 'view_applications',
    requiresHumanApproval: false,
    requiresStepUpAuth: false,
    schema: { companyId: 'string' }
  },

  // LOW Risk Tools
  createTask: {
    name: 'createTask',
    description: 'Create a new follow-up task',
    riskLevel: 'LOW',
    requiredPermission: 'edit_applications',
    requiresHumanApproval: false,
    requiresStepUpAuth: false,
    schema: { title: 'string', priority: 'string' }
  },
  updateNotes: {
    name: 'updateNotes',
    description: 'Update application notes',
    riskLevel: 'LOW',
    requiredPermission: 'edit_applications',
    requiresHumanApproval: false,
    requiresStepUpAuth: false,
    schema: { applicationId: 'string', notes: 'string' }
  },
  generateInterviewQuestions: {
    name: 'generateInterviewQuestions',
    description: 'Generate tailored mock interview questions',
    riskLevel: 'LOW',
    requiredPermission: 'view_applications',
    requiresHumanApproval: false,
    requiresStepUpAuth: false,
    schema: { companyName: 'string', role: 'string' }
  },
  scheduleInterviewPrep: {
    name: 'scheduleInterviewPrep',
    description: 'Generate interview preparation checklist and blocks',
    riskLevel: 'LOW',
    requiredPermission: 'view_applications',
    requiresHumanApproval: false,
    requiresStepUpAuth: false,
    schema: { companyName: 'string', role: 'string' }
  },

  // MEDIUM Risk Tools
  modifyApplicationStatus: {
    name: 'modifyApplicationStatus',
    description: 'Change job application pipeline status',
    riskLevel: 'MEDIUM',
    requiredPermission: 'edit_applications',
    requiresHumanApproval: true,
    requiresStepUpAuth: false,
    schema: { applicationId: 'string', newStatus: 'string' }
  },
  updateApplicationStatus: {
    name: 'updateApplicationStatus',
    description: 'Change job application pipeline status',
    riskLevel: 'MEDIUM',
    requiredPermission: 'edit_applications',
    requiresHumanApproval: true,
    requiresStepUpAuth: false,
    schema: { applicationId: 'string', newStatus: 'string' }
  },
  modifyResume: {
    name: 'modifyResume',
    description: 'Update targeted resume bullet points',
    riskLevel: 'MEDIUM',
    requiredPermission: 'edit_applications',
    requiresHumanApproval: true,
    requiresStepUpAuth: false,
    schema: { resumeId: 'string', bulletPoints: 'string' }
  },
  createFollowupDraft: {
    name: 'createFollowupDraft',
    description: 'Draft recruiter follow-up email',
    riskLevel: 'MEDIUM',
    requiredPermission: 'edit_applications',
    requiresHumanApproval: true,
    requiresStepUpAuth: false,
    schema: { applicationId: 'string', body: 'string' }
  },

  // HIGH Risk Tools
  sendEmail: {
    name: 'sendEmail',
    description: 'Send outgoing email to recruiter',
    riskLevel: 'HIGH',
    requiredPermission: 'edit_applications',
    requiresHumanApproval: true,
    requiresStepUpAuth: false,
    schema: { recipient: 'string', subject: 'string', body: 'string' }
  },
  deleteApplication: {
    name: 'deleteApplication',
    description: 'Permanently delete job application',
    riskLevel: 'HIGH',
    requiredPermission: 'delete_applications',
    requiresHumanApproval: true,
    requiresStepUpAuth: false,
    schema: { applicationId: 'string' }
  },
  exportWorkspace: {
    name: 'exportWorkspace',
    description: 'Export workspace career data archive',
    riskLevel: 'HIGH',
    requiredPermission: 'export_workspace',
    requiresHumanApproval: true,
    requiresStepUpAuth: false,
    schema: { format: 'string' }
  },
  changeOrganizationSettings: {
    name: 'changeOrganizationSettings',
    description: 'Modify organization security & AI thresholds',
    riskLevel: 'HIGH',
    requiredPermission: 'manage_security_settings',
    requiresHumanApproval: true,
    requiresStepUpAuth: false,
    schema: { key: 'string', value: 'string' }
  },

  // CRITICAL Risk Tools
  changeOwner: {
    name: 'changeOwner',
    description: 'Transfer organization ownership',
    riskLevel: 'CRITICAL',
    requiredPermission: 'manage_billing',
    requiresHumanApproval: true,
    requiresStepUpAuth: true,
    schema: { newOwnerUserId: 'string' }
  },
  removeAdmin: {
    name: 'removeAdmin',
    description: 'Revoke administrator access',
    riskLevel: 'CRITICAL',
    requiredPermission: 'manage_users',
    requiresHumanApproval: true,
    requiresStepUpAuth: true,
    schema: { targetUserId: 'string' }
  },
  deleteWorkspace: {
    name: 'deleteWorkspace',
    description: 'Completely destroy workspace data',
    riskLevel: 'CRITICAL',
    requiredPermission: 'manage_security_settings',
    requiresHumanApproval: true,
    requiresStepUpAuth: true,
    schema: { workspaceId: 'string' }
  },
  rotateSecurityCredentials: {
    name: 'rotateSecurityCredentials',
    description: 'Rotate integration secret encryption keys',
    riskLevel: 'CRITICAL',
    requiredPermission: 'manage_security_settings',
    requiresHumanApproval: true,
    requiresStepUpAuth: true,
    schema: { integrationType: 'string' }
  }
};

/**
 * Pilot Tool Firewall Engine.
 * Evaluates proposed AI tool calls through schema validation, prompt injection checks,
 * role authorization, and risk classification.
 *
 * PRINCIPLE: AI NEVER DECIDES AUTHORIZATION.
 */
export async function evaluateToolCallFirewall(
  call: ProposedToolCall,
  context: EvaluationContext
): Promise<FirewallDecision> {
  const toolDef = TOOL_FIREWALL_REGISTRY[call.toolName];

  // 1. Unknown Tool Check
  if (!toolDef) {
    return {
      allowed: false,
      action: 'REJECT',
      riskLevel: 'CRITICAL',
      reason: `Pilot Firewall Rejected: Tool '${call.toolName}' is not registered in the security manifest.`
    };
  }

  // 2. Prompt Injection Check on Raw Context & Payloads
  if (call.rawPromptContext) {
    const injection = detectPromptInjection(call.rawPromptContext);
    if (injection.detected && injection.confidence > 0.7) {
      return {
        allowed: false,
        action: 'REJECT',
        riskLevel: toolDef.riskLevel,
        reason: `Pilot Firewall Rejected: Prompt injection attack detected in context (${injection.category}: ${injection.reason}).`
      };
    }
  }

  // Check payload values for indirect prompt injection
  const payloadStr = JSON.stringify(call.payload);
  const payloadInjection = detectPromptInjection(payloadStr);
  if (payloadInjection.detected && payloadInjection.confidence > 0.7) {
    return {
      allowed: false,
      action: 'REJECT',
      riskLevel: toolDef.riskLevel,
      reason: `Pilot Firewall Rejected: Indirect prompt injection detected inside tool payload arguments (${payloadInjection.category}).`
    };
  }

  // 3. User Role Capability Authorization Check
  // Note: AI CANNOT grant itself permissions!
  const hasRolePermission = hasPermission(context.userRole, toolDef.requiredPermission);
  if (!hasRolePermission) {
    return {
      allowed: false,
      action: 'REJECT',
      riskLevel: toolDef.riskLevel,
      reason: `Pilot Firewall Denied: User role '${context.userRole}' lacks required permission '${toolDef.requiredPermission}' for tool '${call.toolName}'.`
    };
  }

  // 4. Schema Validation & Argument Sanitization
  const sanitizedPayload: Record<string, any> = {};
  for (const [key, expectedType] of Object.entries(toolDef.schema)) {
    const val = call.payload[key];
    if (val === undefined || val === null) {
      return {
        allowed: false,
        action: 'REJECT',
        riskLevel: toolDef.riskLevel,
        reason: `Pilot Firewall Rejected: Missing required schema argument '${key}' for tool '${call.toolName}'.`
      };
    }
    // Sanitize string arguments for PII & control characters
    sanitizedPayload[key] = typeof val === 'string' ? redactPII(val).redactedText : val;
  }

  // 5. Risk Classification & Decision Routing
  if (toolDef.riskLevel === 'CRITICAL') {
    if (!context.stepUpAuthenticated) {
      return {
        allowed: false,
        action: 'REQUIRE_STEP_UP_AUTH',
        riskLevel: 'CRITICAL',
        reason: `Pilot Firewall Boundary: Tool '${call.toolName}' is CRITICAL risk. Elevated step-up authentication is required.`,
        sanitizedPayload
      };
    }
    return {
      allowed: true,
      action: 'REQUIRE_HUMAN_APPROVAL',
      riskLevel: 'CRITICAL',
      reason: `Pilot Firewall Boundary: CRITICAL tool '${call.toolName}' step-up verified. Pending final human approval.`,
      sanitizedPayload
    };
  }

  if (toolDef.riskLevel === 'HIGH' || toolDef.requiresHumanApproval) {
    return {
      allowed: true,
      action: 'REQUIRE_HUMAN_APPROVAL',
      riskLevel: toolDef.riskLevel,
      reason: `Pilot Firewall Boundary: Tool '${call.toolName}' classified as ${toolDef.riskLevel} risk. Added to AI Review Queue for human approval.`,
      sanitizedPayload
    };
  }

  // READ_ONLY & LOW risk tools execute automatically
  return {
    allowed: true,
    action: 'EXECUTE',
    riskLevel: toolDef.riskLevel,
    reason: `Pilot Firewall Approved: Tool '${call.toolName}' cleared policy checks (${toolDef.riskLevel} risk).`,
    sanitizedPayload
  };
}

export const evaluateToolCall = evaluateToolCallFirewall;
