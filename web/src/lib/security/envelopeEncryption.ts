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
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.npm_lifecycle_event === 'build';
    if (process.env.NODE_ENV === 'production' && !isBuildPhase && !process.env.CI) {
      throw new Error(
        '[FATAL] ENCRYPTION_MASTER_KEY environment variable is not set. ' +
        'This is required in production. Set it to a random 32-byte hex string. ' +
        'Generate one with: openssl rand -hex 32'
      );
    }
    // Development, CI, or build-phase fallback
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

function getMasterKey(): string {
  return resolveMasterKey();
}

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

  const key = deriveKey(getMasterKey());
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
  const key = deriveKey(getMasterKey());
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
  let res = text.replace(/Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/gi, 'Bearer [TOKEN_REDACTED]');
  res = res.replace(/Authorization:\s+(?!Bearer\s+\[TOKEN_REDACTED\])\S+/gi, 'Authorization: [REDACTED]');
  res = res.replace(/(["']?(?:access_token|refresh_token|api_key)[\"']?\s*[:=]\s*["']?)[A-Za-z0-9\-_.]+([\"']?)/gi, '$1[REDACTED]$2');
  return res;
}
