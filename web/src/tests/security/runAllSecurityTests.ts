import { runAuthTests } from './auth.test';
import { runTenancyTests } from './tenancy.test';
import { runApiSecurityTests } from './api.test';
import { runAiFirewallTests } from './aiFirewall.test';
import { runPromptInjectionTests } from './promptInjection.test';
import { runOAuthEncryptionTests } from './oauthEncryption.test';
import { runAuditHashChainTests } from './auditHashChain.test';

export async function runAllSecurityTests() {
  console.log('====================================================');
  console.log('🛡️ DAYNIGHT PILOT — AUTOMATED SECURITY TEST SUITE');
  console.log('====================================================\n');

  const allResults: { name: string; passed: boolean; details: string }[] = [];

  // 1. Auth & RBAC
  allResults.push(...runAuthTests());

  // 2. Multi-Tenant Isolation
  allResults.push(...(await runTenancyTests()));

  // 3. API Security (SSRF & Rate Limiting)
  allResults.push(...runApiSecurityTests());

  // 4. Pilot AI Tool Firewall
  allResults.push(...(await runAiFirewallTests()));

  // 5. Prompt Injection Benchmark
  allResults.push(...runPromptInjectionTests());

  // 6. Secrets & OAuth Envelope Encryption
  allResults.push(...runOAuthEncryptionTests());

  // 7. Audit Logging & Hash Chains
  allResults.push(...runAuditHashChainTests());

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
  console.log(`SECURITY SCORE: ${Math.round((passed / allResults.length) * 100)}% Verified Alignment.`);
  console.log('====================================================\n');

  return { passed, failed, total: allResults.length };
}

if (require.main === module) {
  runAllSecurityTests();
}
