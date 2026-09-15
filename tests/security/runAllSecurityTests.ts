import { runSessionSecurityTests } from './auth/session.test';
import { runPrivilegeEscalationTests } from './auth/privilege-escalation.test';

import { runCrossTenantReadTests } from './tenancy/cross-tenant-read.test';
import { runCrossTenantWriteTests } from './tenancy/cross-tenant-write.test';
import { runCrossTenantDeleteTests } from './tenancy/cross-tenant-delete.test';
import { runCrossTenantExportTests } from './tenancy/cross-tenant-export.test';
import { runCrossTenantAiTests } from './tenancy/cross-tenant-ai.test';

import { runBolaTests } from './api/bola.test';
import { runBflaTests } from './api/bfla.test';
import { runMassAssignmentTests } from './api/mass-assignment.test';
import { runPropertyAccessTests } from './api/property-access.test';
import { runResourceConsumptionTests } from './api/resource-consumption.test';
import { runSsrfTests } from './api/ssrf.test';

import { runPromptInjectionTestSuite } from './ai/prompt-injection.test';
import { runToolFirewallTestSuite } from './ai/tool-firewall.test';
import { runDataExfiltrationTests } from './ai/data-exfiltration.test';
import { runAiPrivilegeEscalationTests } from './ai/privilege-escalation.test';

import { runTokenProtectionTests } from './oauth/token-protection.test';

export async function runAllSecurityTests() {
  console.log('====================================================');
  console.log('🛡️ DAYNIGHT PILOT — REPOSITORY SECURITY VERIFICATION SUITE');
  console.log('====================================================\n');

  const allResults: { name: string; passed: boolean; details: string }[] = [];

  // 1. Auth & Session
  allResults.push(...(await runSessionSecurityTests()));
  allResults.push(...runPrivilegeEscalationTests());

  // 2. Tenancy Isolation
  allResults.push(...(await runCrossTenantReadTests()));
  allResults.push(...(await runCrossTenantWriteTests()));
  allResults.push(...(await runCrossTenantDeleteTests()));
  allResults.push(...(await runCrossTenantExportTests()));
  allResults.push(...(await runCrossTenantAiTests()));

  // 3. API Security & SSRF
  allResults.push(...(await runBolaTests()));
  allResults.push(...runBflaTests());
  allResults.push(...(await runMassAssignmentTests()));
  allResults.push(...runPropertyAccessTests());
  allResults.push(...runResourceConsumptionTests());
  allResults.push(...runSsrfTests());

  // 4. AI Security & Tool Firewall
  allResults.push(...runPromptInjectionTestSuite());
  allResults.push(...(await runToolFirewallTestSuite()));
  allResults.push(...runDataExfiltrationTests());
  allResults.push(...(await runAiPrivilegeEscalationTests()));

  // 5. OAuth & Encryption
  allResults.push(...runTokenProtectionTests());

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

  console.log('\n----------------------------------------------------');
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed out of ${allResults.length} Security Control Tests.`);
  console.log(`SECURITY VERIFICATION SCORE: ${Math.round((passed / allResults.length) * 100)}% Verified Alignment.`);
  console.log('====================================================\n');

  try {
    const fs = require('fs');
    const path = require('path');
    const scorecardPath = path.resolve(__dirname, '../../security/scorecard.json');
    if (fs.existsSync(scorecardPath)) {
      const data = JSON.parse(fs.readFileSync(scorecardPath, 'utf8'));
      data.timestamp = new Date().toISOString();
      data.scorecard = data.scorecard || {};
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
