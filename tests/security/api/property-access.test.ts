import { redactAuthorizationTokens } from '../../../web/src/lib/security/envelopeEncryption';

export function runPropertyAccessTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const rawPayload = '{"userId":"u1", "access_token":"ya29.secret-token-12345"}';
  const redacted = redactAuthorizationTokens(rawPayload);

  results.push({
    name: 'Excessive property exposure prevention',
    passed: !redacted.includes('ya29.secret-token-12345'),
    details: 'Sensitive tokens must never be exposed in plaintext response strings.'
  });

  return results;
}
