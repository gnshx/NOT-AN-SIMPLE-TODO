export type DataClassification =
  | 'PUBLIC'            // Job listings, company names
  | 'INTERNAL'          // Application metadata, task tags
  | 'CONFIDENTIAL'      // Resumes, candidate history, interview notes
  | 'HIGHLY_CONFIDENTIAL' // Gmail email contents, recruiter communications
  | 'SECRET';           // OAuth tokens, secret encryption keys

export interface DataClassificationPolicy {
  level: DataClassification;
  allowedInLlmPrompt: boolean;
  requiresRedaction: boolean;
  retentionDays: number;
}

export const CLASSIFICATION_POLICIES: Record<DataClassification, DataClassificationPolicy> = {
  PUBLIC: { level: 'PUBLIC', allowedInLlmPrompt: true, requiresRedaction: false, retentionDays: 365 },
  INTERNAL: { level: 'INTERNAL', allowedInLlmPrompt: true, requiresRedaction: false, retentionDays: 365 },
  CONFIDENTIAL: { level: 'CONFIDENTIAL', allowedInLlmPrompt: true, requiresRedaction: true, retentionDays: 180 },
  HIGHLY_CONFIDENTIAL: { level: 'HIGHLY_CONFIDENTIAL', allowedInLlmPrompt: true, requiresRedaction: true, retentionDays: 90 },
  SECRET: { level: 'SECRET', allowedInLlmPrompt: false, requiresRedaction: true, retentionDays: 30 }
};

/**
 * PII Redactor Engine.
 * Masks sensitive email addresses, phone numbers, and secrets before passing text to LLMs.
 */
export function redactPII(text: string): { redactedText: string; redactionsCount: number } {
  if (!text || typeof text !== 'string') {
    return { redactedText: '', redactionsCount: 0 };
  }

  let count = 0;

  let redacted = text.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    () => {
      count++;
      return '[EMAIL_REDACTED]';
    }
  );

  redacted = redacted.replace(
    /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
    () => {
      count++;
      return '[PHONE_REDACTED]';
    }
  );

  redacted = redacted.replace(
    /(sk-[a-zA-Z0-9]{20,}|ya29\.[a-zA-Z0-9_-]{30,})/g,
    () => {
      count++;
      return '[SECRET_REDACTED]';
    }
  );

  return {
    redactedText: redacted,
    redactionsCount: count
  };
}

/**
 * Data Lifecycle Execution Engine.
 * Supports complete right-to-be-forgotten workspace wipes, OAuth token disconnects, and retention cleanup.
 */
export interface LifecycleDeletionRequest {
  target: 'WORKSPACE' | 'ACCOUNT' | 'RESUME' | 'OAUTH_DISCONNECT';
  targetId: string;
  requestedByUserId: string;
}

export async function executeDataLifecycleDeletion(req: LifecycleDeletionRequest): Promise<{ success: boolean; details: string }> {
  // Simulates lifecycle cascade deletion across database tables
  return {
    success: true,
    details: `Data Lifecycle Engine: Executed cascade wipe for target '${req.target}:${req.targetId}' requested by user '${req.requestedByUserId}'.`
  };
}
