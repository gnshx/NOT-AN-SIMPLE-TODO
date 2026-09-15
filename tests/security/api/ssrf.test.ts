import { validateExternalUrl } from '../../../web/src/lib/security/ssrfGuard';

export function runSsrfTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const targets = [
    { url: 'http://localhost:3000/internal', name: 'localhost' },
    { url: 'http://127.0.0.1/admin', name: '127.0.0.1' },
    { url: 'http://10.0.0.1/db', name: '10.0.0.0/8 Private IP' },
    { url: 'http://172.16.0.1/secret', name: '172.16.0.0/12 Private IP' },
    { url: 'http://192.168.1.1/router', name: '192.168.0.0/16 Private IP' },
    { url: 'http://169.254.169.254/latest/meta-data/', name: 'Cloud Metadata IP (169.254.169.254)' }
  ];

  let allBlocked = true;

  for (const t of targets) {
    const check = validateExternalUrl(t.url);
    if (check.safe) {
      allBlocked = false;
    }
  }

  results.push({
    name: 'SSRF Protection matrix across loopback, RFC 1918 & Cloud Metadata',
    passed: allBlocked,
    details: 'All internal, loopback, private, and metadata URLs MUST be blocked.'
  });

  return results;
}
