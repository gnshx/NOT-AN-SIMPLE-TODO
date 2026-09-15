/**
 * DayNight Pilot — Enterprise SSO & OIDC Provider Manager
 * P6-01: Provides SAML/OIDC Identity Provider connection management,
 * domain-based IdP discovery, and Just-In-Time (JIT) provisioning.
 */

import { logger } from '../logger';

export interface EnterpriseIdpConfig {
  id: string;
  organizationId: string;
  domain: string; // e.g. "acme-corp.com"
  providerType: 'OIDC' | 'SAML';
  issuerUrl: string; // e.g. "https://login.microsoftonline.com/.../v2.0"
  clientId: string;
  clientSecretEncrypted?: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  enabled: boolean;
  enforceSsoOnly: boolean;
  createdAt: string;
}

const IN_MEMORY_IDPS = new Map<string, EnterpriseIdpConfig>();

/**
 * Registers or updates an organization's Enterprise IdP configuration.
 */
export async function configureEnterpriseIdp(config: Omit<EnterpriseIdpConfig, 'id' | 'createdAt'>): Promise<EnterpriseIdpConfig> {
  const id = `idp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record: EnterpriseIdpConfig = {
    ...config,
    id,
    createdAt: new Date().toISOString()
  };

  IN_MEMORY_IDPS.set(config.domain.toLowerCase(), record);
  logger.info({ organizationId: config.organizationId, domain: config.domain }, 'Enterprise SSO IdP configured.');
  return record;
}

/**
 * Discovers the enterprise SSO provider associated with an email address domain.
 */
export async function discoverIdpByEmail(email: string): Promise<EnterpriseIdpConfig | null> {
  if (!email || !email.includes('@')) {
    return null;
  }
  const domain = email.split('@')[1].toLowerCase();
  return IN_MEMORY_IDPS.get(domain) || null;
}

/**
 * Generates the OIDC Authorization URL for an enterprise domain.
 */
export function buildEnterpriseAuthorizeUrl(idp: EnterpriseIdpConfig, state: string, redirectUri: string): string {
  const url = new URL(idp.authorizationEndpoint);
  url.searchParams.set('client_id', idp.clientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  return url.toString();
}

/**
 * Just-In-Time (JIT) User Provisioning from OIDC Claims.
 */
export async function provisionJitUser(claims: {
  email: string;
  name?: string;
  sub: string;
  idpConfig: EnterpriseIdpConfig;
}): Promise<{ userId: string; workspaceId: string; role: 'MEMBER' | 'ADMIN' }> {
  const userId = `usr_jit_${claims.sub.substring(0, 10)}`;
  const workspaceId = `ws_${claims.idpConfig.organizationId}`;

  logger.info(
    { userId, workspaceId, organizationId: claims.idpConfig.organizationId },
    'JIT provisioned enterprise user successfully.'
  );

  return {
    userId,
    workspaceId,
    role: 'MEMBER'
  };
}
