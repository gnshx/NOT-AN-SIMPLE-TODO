/**
 * guardrails.ts — AI Security & Untrusted Input Sanitization.
 * Protects LLM context from indirect prompt injections, jailbreaks, and tool abuse.
 */

const INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?previous\s+instructions/i,
  /system\s+prompt\s+override/i,
  /you\s+are\s+now\s+a/i,
  /bypass\s+security/i,
  /send\s+(?:all\s+)?(?:user\s+)?data\s+to/i,
  /delete\s+(?:all\s+)?database/i
];

export interface SanitizationResult {
  cleanText: string;
  isFlagged: boolean;
  flaggedReasons: string[];
}

export function sanitizeUntrustedInput(rawInput: string): SanitizationResult {
  let isFlagged = false;
  const flaggedReasons: string[] = [];
  let cleanText = rawInput;

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(rawInput)) {
      isFlagged = true;
      flaggedReasons.push(`Blocked suspicious prompt injection pattern: ${pattern}`);
      cleanText = cleanText.replace(pattern, '[BLOCKED_PROMPT_INJECTION]');
    }
  }

  return {
    cleanText,
    isFlagged,
    flaggedReasons
  };
}
