/**
 * DayNight Pilot — Enterprise IP Restriction Policy Engine
 * P6-03: Enforces corporate IP allowlists and CIDR subnet boundaries
 * to restrict workspace access to authorized VPNs and corporate offices.
 */

import { logger } from '../logger';

export interface OrganizationIpPolicy {
  organizationId: string;
  allowedCidrs: string[];
  enforced: boolean;
}

const IN_MEMORY_IP_POLICIES = new Map<string, OrganizationIpPolicy>();

/**
 * Parses client IP address from standard reverse-proxy headers.
 */
export function extractClientIp(headers: Headers): string {
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return '127.0.0.1';
}

/**
 * Converts an IPv4 string to a 32-bit unsigned integer.
 */
function ipToLong(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;

  let num = 0;
  for (let i = 0; i < 4; i++) {
    const part = parseInt(parts[i], 10);
    if (isNaN(part) || part < 0 || part > 255) return null;
    num = (num << 8) + part;
  }
  return num >>> 0;
}

/**
 * Evaluates whether a client IPv4 matches a single CIDR block or single IP.
 */
export function matchesCidr(ip: string, cidr: string): boolean {
  const cleanCidr = cidr.trim();
  if (cleanCidr === '*' || cleanCidr === '0.0.0.0/0') return true;

  if (!cleanCidr.includes('/')) {
    return ip.trim() === cleanCidr;
  }

  const [range, bitsStr] = cleanCidr.split('/');
  const bits = parseInt(bitsStr, 10);
  if (isNaN(bits) || bits < 0 || bits > 32) return false;

  const ipNum = ipToLong(ip);
  const rangeNum = ipToLong(range);

  if (ipNum === null || rangeNum === null) return false;

  if (bits === 0) return true;

  const mask = ((0xFFFFFFFF << (32 - bits)) >>> 0);
  return (ipNum & mask) === (rangeNum & mask);
}

/**
 * Evaluates whether a client IP is authorized against an allowlist.
 */
export function isIpAllowed(clientIp: string, allowedCidrs: string[]): boolean {
  if (!allowedCidrs || allowedCidrs.length === 0) {
    return true; // No restriction defined
  }

  for (const cidr of allowedCidrs) {
    if (matchesCidr(clientIp, cidr)) {
      return true;
    }
  }

  return false;
}

/**
 * Configures the IP restriction policy for an organization.
 */
export function setOrganizationIpPolicy(organizationId: string, allowedCidrs: string[], enforced: boolean = true): void {
  IN_MEMORY_IP_POLICIES.set(organizationId, {
    organizationId,
    allowedCidrs,
    enforced
  });
  logger.info({ organizationId, allowedCidrs, enforced }, 'Updated organization IP policy.');
}

/**
 * Evaluates whether an incoming HTTP request is permitted under the organization's IP policy.
 */
export async function evaluateOrganizationIpPolicy(
  organizationId: string,
  headers: Headers
): Promise<{ allowed: boolean; clientIp: string; reason?: string }> {
  const clientIp = extractClientIp(headers);
  const policy = IN_MEMORY_IP_POLICIES.get(organizationId);

  if (!policy || !policy.enforced) {
    return { allowed: true, clientIp };
  }

  const allowed = isIpAllowed(clientIp, policy.allowedCidrs);
  if (!allowed) {
    logger.warn({ organizationId, clientIp, allowedCidrs: policy.allowedCidrs }, 'Access blocked by IP restriction policy.');
    return {
      allowed: false,
      clientIp,
      reason: `Client IP ${clientIp} is not in the organization's authorized IP allowlist.`
    };
  }

  return { allowed: true, clientIp };
}
