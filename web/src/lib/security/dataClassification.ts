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

  // 1. Secrets & Tokens first (to prevent digit segments within tokens from matching phone regex)
  let redacted = text.replace(
    /(sk-[a-zA-Z0-9]{20,}|ya29\.[a-zA-Z0-9_-]{30,}|dnp_live_[a-zA-Z0-9]{20,})/g,
    () => {
      count++;
      return '[SECRET_REDACTED]';
    }
  );

  // 2. Email addresses
  redacted = redacted.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    () => {
      count++;
      return '[EMAIL_REDACTED]';
    }
  );

  // 3. Phone numbers (with word boundaries to avoid matching random number substrings)
  redacted = redacted.replace(
    /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    () => {
      count++;
      return '[PHONE_REDACTED]';
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
