import { encryptToken, decryptToken, type EncryptedEnvelope } from '../security/envelopeEncryption';

export type IntegrationProvider = 'GMAIL' | 'GOOGLE_CALENDAR' | 'NOTION';

export interface OAuthConnectionRecord {
  id: string;
  workspaceId: string;
  provider: IntegrationProvider;
  accountEmail?: string;
  encryptedAccessToken: EncryptedEnvelope;
  encryptedRefreshToken?: EncryptedEnvelope;
  expiresAt: string;
  scopes: string[];
  connectedAt: string;
}

const inMemoryConnections = new Map<string, OAuthConnectionRecord>();

function buildConnectionKey(workspaceId: string, provider: IntegrationProvider): string {
  return `${workspaceId}:${provider}`;
}

/**
 * P4-06: OAuth Integration Abstraction.
 * Connects, stores, and decrypts external OAuth tokens with AES-256-GCM envelope encryption.
 */
export async function saveOAuthConnection(params: {
  workspaceId: string;
  provider: IntegrationProvider;
  accountEmail?: string;
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds?: number;
  scopes?: string[];
}): Promise<{ id: string; connectedAt: string }> {
  const encryptedAccessToken = await encryptToken(params.accessToken);
  const encryptedRefreshToken = params.refreshToken
    ? await encryptToken(params.refreshToken)
    : undefined;

  const expiresAt = new Date(Date.now() + (params.expiresInSeconds || 3600) * 1000).toISOString();
  const connectedAt = new Date().toISOString();
  const id = `conn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const record: OAuthConnectionRecord = {
    id,
    workspaceId: params.workspaceId,
    provider: params.provider,
    accountEmail: params.accountEmail,
    encryptedAccessToken,
    encryptedRefreshToken,
    expiresAt,
    scopes: params.scopes || [],
    connectedAt
  };

  inMemoryConnections.set(buildConnectionKey(params.workspaceId, params.provider), record);
  return { id, connectedAt };
}

/**
 * Checks if a specific OAuth provider is connected and valid.
 */
export async function isIntegrationConnected(
  workspaceId: string,
  provider: IntegrationProvider
): Promise<{ connected: boolean; accountEmail?: string; expiresAt?: string }> {
  const record = inMemoryConnections.get(buildConnectionKey(workspaceId, provider));
  if (!record) {
    return { connected: false };
  }

  const isExpired = new Date() > new Date(record.expiresAt);
  return {
    connected: !isExpired || !!record.encryptedRefreshToken,
    accountEmail: record.accountEmail,
    expiresAt: record.expiresAt
  };
}

/**
 * Retrieves and decrypts active access token for API calls.
 */
export async function getDecryptedAccessToken(
  workspaceId: string,
  provider: IntegrationProvider
): Promise<string | null> {
  const record = inMemoryConnections.get(buildConnectionKey(workspaceId, provider));
  if (!record) return null;

  return decryptToken(record.encryptedAccessToken);
}

/**
 * Disconnects an OAuth integration.
 */
export async function disconnectIntegration(
  workspaceId: string,
  provider: IntegrationProvider
): Promise<boolean> {
  return inMemoryConnections.delete(buildConnectionKey(workspaceId, provider));
}
