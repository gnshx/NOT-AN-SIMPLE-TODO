import { validateExternalUrl, safeFetchWithSsrfGuard } from '../../../web/src/lib/security/ssrfGuard';

export async function runSsrfGuardTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: Loopback addresses blocked
  const loopbacks = [
    'http://localhost:3000/metrics',
    'http://127.0.0.1/admin',
    'http://0.0.0.0:80',
    'http://[::1]/debug'
  ];
  let loopbackBlocked = true;
  for (const url of loopbacks) {
    if (validateExternalUrl(url).safe) {
      loopbackBlocked = false;
    }
  }
  results.push({
    name: 'SSRF: Loopback addresses (localhost, 127.0.0.1, ::1) blocked',
    passed: loopbackBlocked,
    details: 'All loopback destinations must be identified and rejected.'
  });

  // Test 2: RFC 1918 Private IP ranges blocked
  const privateIps = [
    'http://10.0.0.1/internal-api',
    'http://172.16.0.5/secrets',
    'http://172.31.255.255/db',
    'http://192.168.1.1/router'
  ];
  let privateBlocked = true;
  for (const url of privateIps) {
    if (validateExternalUrl(url).safe) {
      privateBlocked = false;
    }
  }
  results.push({
    name: 'SSRF: RFC 1918 Private IP ranges (10/8, 172.16/12, 192.168/16) blocked',
    passed: privateBlocked,
    details: 'Internal VPC and LAN address spaces must be blocked.'
  });

  // Test 3: Cloud instance metadata endpoints blocked
  const metadataEndpoints = [
    'http://169.254.169.254/latest/meta-data/',
    'http://metadata.google.internal/computeMetadata/v1/',
    'http://169.254.169.254/metadata/v1/maintenance'
  ];
  let metadataBlocked = true;
  for (const url of metadataEndpoints) {
    if (validateExternalUrl(url).safe) {
      metadataBlocked = false;
    }
  }
  results.push({
    name: 'SSRF: Cloud metadata endpoints (AWS, GCP, Azure) blocked',
    passed: metadataBlocked,
    details: 'Cloud metadata IP 169.254.169.254 and metadata domains must be blocked.'
  });

  // Test 4: Disallowed protocols / schemes blocked
  const badSchemes = [
    'ftp://files.example.com/dump.sql',
    'file:///etc/passwd',
    'gopher://evil.com:70/1',
    'javascript:alert(1)'
  ];
  let badSchemesBlocked = true;
  for (const url of badSchemes) {
    if (validateExternalUrl(url).safe) {
      badSchemesBlocked = false;
    }
  }
  results.push({
    name: 'SSRF: Non-HTTP/HTTPS schemes blocked (ftp, file, gopher)',
    passed: badSchemesBlocked,
    details: 'Only standard http: and https: protocols are permitted.'
  });

  // Test 5: Non-standard ports blocked
  const badPorts = [
    'http://example.com:22/ssh',
    'http://example.com:3306/mysql',
    'http://example.com:6379/redis',
    'http://example.com:9200/elasticsearch'
  ];
  let badPortsBlocked = true;
  for (const url of badPorts) {
    if (validateExternalUrl(url).safe) {
      badPortsBlocked = false;
    }
  }
  results.push({
    name: 'SSRF: Non-standard ports blocked (22, 3306, 6379, 9200)',
    passed: badPortsBlocked,
    details: 'Outbound fetch is restricted to standard HTTP/HTTPS ports (80, 443).'
  });

  // Test 6: Safe public URLs allowed
  const safeCheck = validateExternalUrl('https://api.github.com/repos/gnshx/NOT-AN-SIMPLE-TODO');
  results.push({
    name: 'SSRF: Valid public HTTPS URL permitted',
    passed: safeCheck.safe,
    details: 'Legitimate public API destinations must pass validation.'
  });

  return results;
}
