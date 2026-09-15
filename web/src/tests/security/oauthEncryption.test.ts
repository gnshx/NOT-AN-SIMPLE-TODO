import { encryptToken, decryptToken, redactAuthorizationTokens } from '../../lib/security/envelopeEncryption';

export function runOAuthEncryptionTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: AES-256-GCM Envelope Encryption & Decryption
  const rawToken = 'ya29.a0Axoo-gmail-oauth-secret-token-12345';
  const envelope = encryptToken(rawToken);
  const decrypted = decryptToken(envelope);

  results.push({
    name: 'OAuth Envelope Encryption & Decryption integrity',
    passed: decrypted === rawToken && envelope.algorithm === 'aes-256-gcm',
    details: 'Encrypted OAuth token must decrypt back to original text securely.'
  });

  // Test 2: Token Redaction
  const logString = 'Header Authorization: Bearer ya29.a0Axoo-secret';
  const redacted = redactAuthorizationTokens(logString);

  results.push({
    name: 'Authorization token redaction in logs',
    passed: !redacted.includes('ya29.a0Axoo-secret') && redacted.includes('[TOKEN_REDACTED]'),
    details: 'Bearer tokens must be stripped from log outputs.'
  });

  return results;
}
