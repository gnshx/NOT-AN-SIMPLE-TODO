import { URL } from 'url';

export interface SsrfValidationResult {
  safe: boolean;
  reason?: string;
  sanitizedUrl?: string;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // AWS / GCP / Azure Instance Metadata Service
  'metadata.google.internal',
  'kubernetes.default.svc'
]);

const PRIVATE_IP_RANGES = [
  /^127\./,                 // Loopback
  /^10\./,                  // 10.0.0.0/8 Private
  /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12 Private
  /^192\.168\./,            // 192.168.0.0/16 Private
  /^169\.254\./,            // Link-local / Metadata
  /^fc00:/,                 // IPv6 Unique Local
  /^fe80:/                  // IPv6 Link-local
];

/**
 * Validates external URLs for server-side fetching, preventing SSRF attacks
 * against internal services, cloud metadata endpoints, and loopback devices.
 */
export function validateExternalUrl(urlString: string): SsrfValidationResult {
  if (!urlString || typeof urlString !== 'string') {
    return { safe: false, reason: 'URL string is empty or invalid.' };
  }

  try {
    const parsed = new URL(urlString);

    // 1. Scheme Check
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: `Invalid URL scheme '${parsed.protocol}'. Only http and https are allowed.` };
    }

    // 2. Port Check
    if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
      return { safe: false, reason: `Restricted port '${parsed.port}'. Only standard HTTP/HTTPS ports (80, 443) are allowed.` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 3. Blocked Hostname Check
    if (BLOCKED_HOSTNAMES.has(hostname)) {
      return { safe: false, reason: `Access to internal host '${hostname}' is blocked (SSRF Protection).` };
    }

    // 4. IP Range Check
    for (const range of PRIVATE_IP_RANGES) {
      if (range.test(hostname)) {
        return { safe: false, reason: `Access to private IP range '${hostname}' is blocked (SSRF Protection).` };
      }
    }

    return {
      safe: true,
      sanitizedUrl: parsed.toString()
    };
  } catch (err) {
    return { safe: false, reason: 'Malformed URL format.' };
  }
}
