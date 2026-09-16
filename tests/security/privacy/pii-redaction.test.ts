import { redactPII, CLASSIFICATION_POLICIES } from '../../../web/src/lib/security/dataClassification';

export function runPiiRedactionTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: Email redaction
  const emailSample = 'Please reach out to candidate at recruiter.alex@company.org regarding interview.';
  const emailRes = redactPII(emailSample);
  results.push({
    name: 'Privacy: Candidate email address redaction before LLM injection',
    passed: emailRes.redactedText.includes('[EMAIL_REDACTED]') && !emailRes.redactedText.includes('recruiter.alex@company.org'),
    details: 'Email addresses must be scrubbed with [EMAIL_REDACTED].'
  });

  // Test 2: Phone number redaction
  const phoneSample = 'Call me back at (415) 555-0199 or +1 800-555-1212.';
  const phoneRes = redactPII(phoneSample);
  results.push({
    name: 'Privacy: Phone number redaction before LLM injection',
    passed: phoneRes.redactedText.includes('[PHONE_REDACTED]') && !phoneRes.redactedText.includes('415') && !phoneRes.redactedText.includes('800'),
    details: 'Phone numbers must be masked with [PHONE_REDACTED].'
  });

  // Test 3: API Key & Secret redaction
  const secretSample = 'Connecting with OpenAI API key sk-abcdef1234567890abcdef123456 and token ya29.a0AfH6SMD_secret12345678901234567890.';
  const secretRes = redactPII(secretSample);
  results.push({
    name: 'Privacy: API key and OAuth token redaction',
    passed: secretRes.redactedText.includes('[SECRET_REDACTED]') && !secretRes.redactedText.includes('sk-abcdef') && !secretRes.redactedText.includes('ya29.'),
    details: 'High-entropy API keys and tokens must be scrubbed with [SECRET_REDACTED].'
  });

  // Test 4: SECRET classification tier prohibits LLM inclusion
  const secretPolicy = CLASSIFICATION_POLICIES.SECRET;
  results.push({
    name: 'Privacy: SECRET classification tier forbids LLM prompt inclusion',
    passed: secretPolicy.allowedInLlmPrompt === false,
    details: 'Data classified as SECRET must never be injected into model prompts.'
  });

  return results;
}
