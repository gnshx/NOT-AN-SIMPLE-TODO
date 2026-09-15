import { encryptToken, decryptToken, redactAuthorizationTokens } from '../../../web/src/lib/security/envelopeEncryption';

export function runTokenProtectionTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const secretToken = 'ya29.secret-gmail-access-token-999';
  const envelope = encryptToken(secretToken);
  const decrypted = decryptToken(envelope);

  results.push({
    name: 'OAuth Token AES-256-GCM Envelope Encryption',
    passed: decrypted === secretToken && envelope.algorithm === 'aes-256-gcm',
    details: 'OAuth refresh & access tokens must be encrypted at rest.'
  });

  const redacted = redactAuthorizationTokens(`Authorization: Bearer ${secretToken}`);
  results.push({
    name: 'OAuth Token Redaction in Logs and AI Prompts',
    passed: !redacted.includes(secretToken) && redacted.includes('[TOKEN_REDACTED]'),
    details: 'Authorization Bearer tokens must be stripped before logging or prompt generation.'
  });

  return results;
}
