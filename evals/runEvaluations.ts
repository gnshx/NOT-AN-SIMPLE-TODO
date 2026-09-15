import fs from 'fs';
import path from 'path';
import { executeAiGateway } from '../web/src/lib/ai/gateway';
import { detectPromptInjection } from '../web/src/lib/security/promptInjection';

export interface EvalCase {
  id: string;
  category: string;
  query: string;
  expectedTool?: string;
  shouldBlock?: boolean;
  minConfidence: number;
}

export async function runEvaluations() {
  console.log('====================================================');
  console.log('🧪 DAYNIGHT PILOT — AI EVALUATION & REGRESSION SUITE');
  console.log('====================================================\n');

  const datasetPath = path.resolve(__dirname, 'golden-dataset.json');
  const dataset: EvalCase[] = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const item of dataset) {
    const startTime = Date.now();
    try {
      if (item.shouldBlock) {
        const scan = detectPromptInjection(item.query);
        if (scan.detected) {
          passed++;
          console.log(`  [PASS] ✓ ${item.id} (${item.category}): Correctly blocked malicious query (${scan.category}).`);
          results.push({ id: item.id, status: 'PASSED', latencyMs: Date.now() - startTime });
        } else {
          failed++;
          console.log(`  [FAIL] ✗ ${item.id} (${item.category}): Expected attack to be blocked, but scanner allowed it.`);
          results.push({ id: item.id, status: 'FAILED', reason: 'Failed to block attack' });
        }
      } else {
        const res = await executeAiGateway({
          query: item.query,
          userId: 'eval-user',
          workspaceId: 'eval-workspace',
          tier: 'PRO'
        });

        const hasTool = item.expectedTool
          ? res.proposedActions.some((a) => a.toolName === item.expectedTool)
          : true;

        if (res.confidenceScore >= item.minConfidence && hasTool) {
          passed++;
          console.log(`  [PASS] ✓ ${item.id} (${item.category}): Passed inference with confidence ${res.confidenceScore}.`);
          results.push({ id: item.id, status: 'PASSED', latencyMs: Date.now() - startTime });
        } else {
          failed++;
          console.log(`  [FAIL] ✗ ${item.id} (${item.category}): Tool or confidence mismatch.`);
          results.push({ id: item.id, status: 'FAILED', reason: 'Mismatch' });
        }
      }
    } catch (err) {
      if (item.shouldBlock) {
        passed++;
        console.log(`  [PASS] ✓ ${item.id} (${item.category}): Gateway exception correctly raised for attack.`);
        results.push({ id: item.id, status: 'PASSED', latencyMs: Date.now() - startTime });
      } else {
        failed++;
        console.log(`  [FAIL] ✗ ${item.id} (${item.category}): Unexpected error:`, (err as Error).message);
        results.push({ id: item.id, status: 'FAILED', error: (err as Error).message });
      }
    }
  }

  const accuracy = Math.round((passed / dataset.length) * 100);
  console.log('\n----------------------------------------------------');
  console.log(`EVALUATION SUMMARY: ${passed} Passed, ${failed} Failed out of ${dataset.length} cases.`);
  console.log(`MODEL ACCURACY & SAFETY SCORE: ${accuracy}%`);
  console.log('====================================================\n');

  const reportPath = path.resolve(__dirname, 'report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        total: dataset.length,
        passed,
        failed,
        accuracyScore: `${accuracy}%`,
        results
      },
      null,
      2
    )
  );

  return { passed, failed, accuracy };
}

if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('runEvaluations'))) {
  runEvaluations().then(({ failed }) => {
    if (failed > 0) process.exit(1);
  });
}
