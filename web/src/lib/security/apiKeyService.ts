import crypto from 'crypto';

export type ApiKeyScope = 'read_only' | 'full_access' | 'ai_pilot';

export interface ApiKeyRecord {
  id: string;
  workspaceId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  scopes: ApiKeyScope[];
  createdAt: string;
  expiresAt?: string | null;
  lastUsedAt?: string | null;
  revokedAt?: string | null;
}

// In-memory fallback key storage for dev/test
const inMemoryKeyStore = new Map<string, ApiKeyRecord>();

/**
 * Computes a deterministic SHA-256 hash of the API key for secure storage at rest.
 * Plaintext keys are NEVER stored in persistent storage.
 */
export function hashApiKey(plaintextKey: string): string {
  return crypto.createHash('sha256').update(plaintextKey).digest('hex');
}

/**
 * Generates a new cryptographically secure API key for developer integrations.
 * Returns the plaintext key ONCE to display to the user.
 */
export function generateApiKey(params: {
  workspaceId: string;
  name: string;
  scopes?: ApiKeyScope[];
  expiresInDays?: number;
}): { plaintextKey: string; keyRecord: ApiKeyRecord } {
  const entropy = crypto.randomBytes(24).toString('hex');
  const plaintextKey = `dnp_live_${entropy}`;
  const keyPrefix = plaintextKey.substring(0, 16) + '...';
  const keyHash = hashApiKey(plaintextKey);

  const expiresAt = params.expiresInDays
    ? new Date(Date.now() + params.expiresInDays * 86400 * 1000).toISOString()
    : null;

  const keyRecord: ApiKeyRecord = {
    id: `key-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    workspaceId: params.workspaceId,
    name: params.name,
    keyPrefix,
    keyHash,
    scopes: params.scopes || ['read_only'],
    createdAt: new Date().toISOString(),
    expiresAt,
    lastUsedAt: null,
    revokedAt: null
  };

  inMemoryKeyStore.set(keyHash, keyRecord);

  return {
    plaintextKey,
    keyRecord
  };
}

/**
 * Validates an incoming API key against stored cryptographic hashes.
 */
export async function validateApiKey(plaintextKey: string): Promise<{ valid: boolean; record?: ApiKeyRecord; reason?: string }> {
  if (!plaintextKey || !plaintextKey.startsWith('dnp_')) {
    return { valid: false, reason: 'Invalid API key format.' };
  }

  const hash = hashApiKey(plaintextKey);
  const record = inMemoryKeyStore.get(hash);

  if (!record) {
    return { valid: false, reason: 'API key not found or revoked.' };
  }

  if (record.revokedAt) {
    return { valid: false, reason: 'API key has been revoked.' };
  }

  if (record.expiresAt && new Date() > new Date(record.expiresAt)) {
    return { valid: false, reason: 'API key has expired.' };
  }

  record.lastUsedAt = new Date().toISOString();
  return { valid: true, record };
}

/**
 * Lists active API keys for a workspace (without revealing plaintext secrets).
 */
export async function listWorkspaceApiKeys(workspaceId: string): Promise<Omit<ApiKeyRecord, 'keyHash'>[]> {
  const results: Omit<ApiKeyRecord, 'keyHash'>[] = [];
  for (const record of inMemoryKeyStore.values()) {
    if (record.workspaceId === workspaceId && !record.revokedAt) {
      const { keyHash, ...safeRecord } = record;
      results.push(safeRecord);
    }
  }
  return results;
}

/**
 * Revokes an active API key immediately.
 */
export async function revokeApiKey(workspaceId: string, keyId: string): Promise<boolean> {
  for (const record of inMemoryKeyStore.values()) {
    if (record.id === keyId && record.workspaceId === workspaceId) {
      record.revokedAt = new Date().toISOString();
      return true;
    }
  }
  return false;
}
