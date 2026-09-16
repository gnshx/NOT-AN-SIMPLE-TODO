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

    const rawHost = parsed.hostname.toLowerCase();
    const hostname = rawHost.replace(/^\[|\]$/g, '');

    // 3. Blocked Hostname Check
    if (BLOCKED_HOSTNAMES.has(rawHost) || BLOCKED_HOSTNAMES.has(hostname) || hostname === '::1') {
      return { safe: false, reason: `Access to internal host '${rawHost}' is blocked (SSRF Protection).` };
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

/**
 * P3-08: Safe HTTP fetch with strict SSRF re-validation across redirects.
 * Defends against open-redirect and DNS rebinding SSRF attacks.
 */
export async function safeFetchWithSsrfGuard(
  initialUrl: string,
  init?: RequestInit,
  maxRedirects = 3
): Promise<Response> {
  let currentUrl = initialUrl;
  let redirectsCount = 0;

  while (redirectsCount <= maxRedirects) {
    const check = validateExternalUrl(currentUrl);
    if (!check.safe) {
      throw new Error(`SSRF Blocked: ${check.reason} (Target: ${currentUrl})`);
    }

    const res = await fetch(currentUrl, {
      ...init,
      redirect: 'manual'
    });

    // Check for HTTP redirect codes (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get('location');
      if (!location) {
        throw new Error('Redirect response missing Location header.');
      }

      // Resolve relative redirect against current URL
      const resolved = new URL(location, currentUrl).toString();
      currentUrl = resolved;
      redirectsCount++;
      continue;
    }

    return res;
  }

  throw new Error(`SSRF Guard: Exceeded maximum allowed redirects (${maxRedirects}).`);
}
