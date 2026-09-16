import { runAuthGuardTests } from './auth/auth-guard.test';
import { runSessionLifecycleTests } from './sessions/session-lifecycle.test';

import { runCrossTenantReadTests } from './tenancy/cross-tenant-read.test';
import { runCrossTenantCreateTests } from './tenancy/cross-tenant-create.test';
import { runCrossTenantUpdateTests } from './tenancy/cross-tenant-update.test';
import { runCrossTenantDeleteTests } from './tenancy/cross-tenant-delete.test';
import { runCrossTenantSearchTests } from './tenancy/cross-tenant-search.test';
import { runCrossTenantExportTests } from './tenancy/cross-tenant-export.test';
import { runCrossTenantBulkTests } from './tenancy/cross-tenant-bulk.test';
import { runCrossTenantDownloadTests } from './tenancy/cross-tenant-download.test';
import { runCrossTenantAiTests } from './tenancy/cross-tenant-ai.test';
import { runCrossTenantJobTests } from './tenancy/cross-tenant-job.test';
import { runCrossTenantWebhookTests } from './tenancy/cross-tenant-webhook.test';

import { runRoleMatrixTests } from './authorization/role-matrix.test';
import { runAiSelfGrantTests } from './authorization/ai-self-grant.test';

import { runBolaTests } from './api/bola.test';
import { runBflaTests } from './api/bfla.test';
import { runMassAssignmentTests } from './api/mass-assignment.test';
import { runPropertyAccessTests } from './api/property-access.test';
import { runResourceConsumptionTests } from './api/resource-consumption.test';

import { runPromptInjectionTestSuite } from './ai/prompt-injection.test';
import { runToolFirewallTestSuite } from './ai/tool-firewall.test';
import { runDataExfiltrationTests } from './ai/data-exfiltration.test';
import { runAiPrivilegeEscalationTests } from './ai/privilege-escalation.test';

import { runTokenProtectionTests } from './oauth/token-protection.test';
import { runSsrfGuardTests } from './ssrf/ssrf-guard.test';
import { runUploadSecurityTests } from './uploads/upload-security.test';
import { runRateLimiterTests } from './rate-limit/rate-limiter.test';
import { runSecurityHeadersTests } from './headers/security-headers.test';
import { runPiiRedactionTests } from './privacy/pii-redaction.test';
import { runAuditHashChainTests } from './audit/hash-chain.test';
import { runBillingSecurityTests } from './billing/entitlements.test';

export async function runAllSecurityTests() {
  console.log('================================================================');
  console.log('🛡️ DAYNIGHT PILOT — COMPREHENSIVE SECURITY REGRESSION SUITE (14/14)');
  console.log('================================================================\n');

  const allResults: { name: string; passed: boolean; details: string }[] = [];

  // 1. Auth Guard (Server Authentication)
  allResults.push(...(await runAuthGuardTests()));

  // 2. Session Lifecycle & Cookie Security
  allResults.push(...(await runSessionLifecycleTests()));

  // 3. Multi-Tenant Isolation (All 11 Scenarios)
  allResults.push(...(await runCrossTenantReadTests()));
  allResults.push(...(await runCrossTenantCreateTests()));
  allResults.push(...(await runCrossTenantUpdateTests()));
  allResults.push(...(await runCrossTenantDeleteTests()));
  allResults.push(...(await runCrossTenantSearchTests()));
  allResults.push(...(await runCrossTenantExportTests()));
  allResults.push(...(await runCrossTenantBulkTests()));
  allResults.push(...(await runCrossTenantDownloadTests()));
  allResults.push(...(await runCrossTenantAiTests()));
  allResults.push(...(await runCrossTenantJobTests()));
  allResults.push(...(await runCrossTenantWebhookTests()));

  // 4. Central Authorization & Role Matrix
  allResults.push(...runRoleMatrixTests());
  allResults.push(...(await runAiSelfGrantTests()));

  // 5. API Security (BOLA, BFLA, Mass Assignment, Resource Consumption)
  allResults.push(...(await runBolaTests()));
  allResults.push(...runBflaTests());
  allResults.push(...(await runMassAssignmentTests()));
  allResults.push(...runPropertyAccessTests());
  allResults.push(...runResourceConsumptionTests());

  // 6. AI Safety, Tool Firewall & Prompt Injection
  allResults.push(...(await runPromptInjectionTestSuite()));
  allResults.push(...(await runToolFirewallTestSuite()));
  allResults.push(...runDataExfiltrationTests());
  allResults.push(...(await runAiPrivilegeEscalationTests()));

  // 7. OAuth & Envelope Encryption
  allResults.push(...runTokenProtectionTests());

  // 8. SSRF Defense & URL Validation
  allResults.push(...(await runSsrfGuardTests()));

  // 9. File Upload Security
  allResults.push(...runUploadSecurityTests());

  // 10. Rate Limiting & DoS Protection
  allResults.push(...(await runRateLimiterTests()));

  // 11. Production Security Headers
  allResults.push(...(await runSecurityHeadersTests()));

  // 12. Privacy & PII Redaction
  allResults.push(...runPiiRedactionTests());

  // 13. Audit Logging & SHA-256 Hash Chain
  allResults.push(...runAuditHashChainTests());

  // 14. Billing, Entitlements & Metering
  allResults.push(...(await runBillingSecurityTests()));

  let passed = 0;
  let failed = 0;

  for (const r of allResults) {
    if (r.passed) {
      console.log(`  [PASS] ✓ ${r.name} — ${r.details}`);
      passed++;
    } else {
      console.log(`  [FAIL] ✗ ${r.name} — ${r.details}`);
      failed++;
    }
  }

  console.log('\n----------------------------------------------------------------');
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed out of ${allResults.length} Security Control Tests.`);
  console.log(`SECURITY VERIFICATION SCORE: ${Math.round((passed / allResults.length) * 100)}% Verified Alignment.`);
  console.log('================================================================\n');

  try {
    const fs = require('fs');
    const path = require('path');
    const scorecardPath = path.resolve(__dirname, '../../security/scorecard.json');
    if (fs.existsSync(scorecardPath)) {
      const data = JSON.parse(fs.readFileSync(scorecardPath, 'utf8'));
      data.timestamp = new Date().toISOString();
      data.scorecard = data.scorecard || {};
      data.scorecard.totalTests = allResults.length;
      data.scorecard.passed = passed;
      data.scorecard.failed = failed;
      data.scorecard.lastRunScore = `${Math.round((passed / allResults.length) * 100)}% (${passed}/${allResults.length})`;
      fs.writeFileSync(scorecardPath, JSON.stringify(data, null, 2));
    }
  } catch (e) {
    // Non-fatal if scorecard write fails
  }

  return { passed, failed, total: allResults.length };
}

if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('runAllSecurityTests'))) {
  runAllSecurityTests().then(({ failed }) => {
    if (failed > 0) {
      process.exit(1);
    }
  });
}
