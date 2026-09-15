/**
 * DayNight Pilot — Organization Domain Verification Service
 * P6-02: Validates ownership of corporate domains via DNS TXT records or HTML meta tags
 * before allowing Enterprise SSO enforcement or tenant auto-joining.
 */

import dns from 'dns';
import crypto from 'crypto';
import { logger } from './logger';
import { safeFetchWithSsrfGuard } from './security/ssrfGuard';

export interface DomainRecord {
  id: string;
  organizationId: string;
  domain: string;
  verificationToken: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  verificationMethod: 'DNS_TXT' | 'HTML_META';
  verifiedAt?: string;
  createdAt: string;
}

const IN_MEMORY_DOMAINS = new Map<string, DomainRecord>();

/**
 * Initiates verification for a corporate domain.
 */
export async function registerDomain(params: {
  organizationId: string;
  domain: string;
  method?: 'DNS_TXT' | 'HTML_META';
}): Promise<DomainRecord> {
  const normalizedDomain = params.domain.toLowerCase().trim();
  const token = `daynight-verify-${crypto.randomBytes(16).toString('hex')}`;
  const id = `dom_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  const record: DomainRecord = {
    id,
    organizationId: params.organizationId,
    domain: normalizedDomain,
    verificationToken: token,
    status: 'PENDING',
    verificationMethod: params.method || 'DNS_TXT',
    createdAt: new Date().toISOString()
  };

  IN_MEMORY_DOMAINS.set(normalizedDomain, record);
  logger.info({ organizationId: params.organizationId, domain: normalizedDomain }, 'Registered domain for verification.');
  return record;
}

/**
 * Attempts to verify ownership of the domain via DNS TXT record or HTML Meta Tag.
 */
export async function checkDomainVerification(domain: string): Promise<DomainRecord> {
  const record = IN_MEMORY_DOMAINS.get(domain.toLowerCase().trim());
  if (!record) {
    throw new Error(`Domain '${domain}' is not registered for verification.`);
  }

  if (record.status === 'VERIFIED') {
    return record;
  }

  let verified = false;

  // 1. DNS TXT Record Verification
  if (record.verificationMethod === 'DNS_TXT') {
    try {
      const records = await dns.promises.resolveTxt(`_daynight-challenge.${record.domain}`);
      const flattened = records.flat().join(' ');
      if (flattened.includes(record.verificationToken)) {
        verified = true;
      }
    } catch (err: any) {
      logger.info({ domain: record.domain, err: err.message }, 'DNS TXT lookup failed or record not yet propagated.');
    }
  }

  // 2. HTML Meta Tag Verification Fallback
  if (!verified && record.verificationMethod === 'HTML_META') {
    try {
      const targetUrl = `https://${record.domain}`;
      const response = await safeFetchWithSsrfGuard(targetUrl);
      if (response.ok) {
        const html = await response.text();
        const expectedMeta = `name="daynight-verification" content="${record.verificationToken}"`;
        if (html.includes(expectedMeta)) {
          verified = true;
        }
      }
    } catch (err: any) {
      logger.info({ domain: record.domain, err: err.message }, 'HTML meta tag verification failed.');
    }
  }

  if (verified) {
    record.status = 'VERIFIED';
    record.verifiedAt = new Date().toISOString();
    logger.info({ domain: record.domain, orgId: record.organizationId }, 'Domain successfully verified!');
  } else {
    record.status = 'PENDING';
  }

  return record;
}

/**
 * Simulates verification for testing or administrative override.
 */
export function setDomainVerificationStatus(domain: string, status: 'VERIFIED' | 'FAILED'): DomainRecord | null {
  const record = IN_MEMORY_DOMAINS.get(domain.toLowerCase().trim());
  if (!record) return null;
  record.status = status;
  if (status === 'VERIFIED') {
    record.verifiedAt = new Date().toISOString();
  }
  return record;
}
