import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * P0-01: Fail-fast master key resolution.
 * Never falls back to a hardcoded value — that would defeat envelope encryption entirely.
 * In production: throws immediately if ENCRYPTION_MASTER_KEY is absent.
 * In development: logs a prominent warning and uses a LOCAL-ONLY dev key.
 */
function resolveMasterKey(): string {
  const key = process.env.ENCRYPTION_MASTER_KEY;

  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[FATAL] ENCRYPTION_MASTER_KEY environment variable is not set. ' +
        'This is required in production. Set it to a random 32-byte hex string. ' +
        'Generate one with: openssl rand -hex 32'
      );
    }
    // Development only — clearly marked, never the same as any real key
    console.warn(
      '[SECURITY WARNING] ENCRYPTION_MASTER_KEY is not set. ' +
      'Using a local-dev-only fallback key. This key MUST be set in production and staging.'
    );
    return 'daynight-pilot-dev-only-do-not-use-in-production!!';
  }

  if (key.length < 32) {
    throw new Error(
      '[FATAL] ENCRYPTION_MASTER_KEY must be at least 32 characters. ' +
      'Generate a secure key with: openssl rand -hex 32'
    );
  }

  return key;
}

const MASTER_KEY_ENV = resolveMasterKey();

/**
 * Derives a 256-bit symmetric encryption key from master secret.
 */
function deriveKey(secret: string): Buffer {
  return crypto.createHash('sha256').update(secret).digest();
}

export interface EncryptedEnvelope {
  encryptedData: string;
  iv: string;
  authTag: string;
  algorithm: string;
  keyVersion: number;
}

/**
 * Encrypts sensitive credentials (OAuth Access & Refresh Tokens) at rest
 * using AES-256-GCM envelope encryption.
 */
export function encryptToken(plaintextToken: string): EncryptedEnvelope {
  if (!plaintextToken) throw new Error('Token string cannot be empty.');

  const key = deriveKey(MASTER_KEY_ENV);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintextToken, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag,
    algorithm: ALGORITHM,
    keyVersion: 1
  };
}

/**
 * Decrypts AES-256-GCM envelope-encrypted OAuth token.
 */
export function decryptToken(envelope: EncryptedEnvelope): string {
  const key = deriveKey(MASTER_KEY_ENV);
  const iv = Buffer.from(envelope.iv, 'hex');
  const authTag = Buffer.from(envelope.authTag, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(envelope.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Sanitizes headers or text strings, stripping Bearer tokens and Authorization headers.
 */
export function redactAuthorizationTokens(text: string): string {
  if (!text) return '';
  return text
    .replace(/Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/gi, 'Bearer [TOKEN_REDACTED]')
    .replace(/Authorization:\s*.*$/gim, 'Authorization: [REDACTED]')
    .replace(/(access_token|refresh_token|api_key)\s*[:=]\s*["']?[A-Za-z0-9\-_.]+/gi, '$1=[REDACTED]');
}
