import { runPromptInjectionBenchmark } from '../../lib/security/promptInjection';

export function runPromptInjectionTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const metrics = runPromptInjectionBenchmark();

  results.push({
    name: 'Prompt Injection Benchmark Detection Rate',
    passed: metrics.attackDetectionRate >= 95,
    details: `Achieved ${metrics.attackDetectionRate}% detection rate across ${metrics.totalCases} benchmark cases.`
  });

  results.push({
    name: 'Prompt Injection False Positive Rate',
    passed: metrics.falsePositiveRate === 0,
    details: `Achieved ${metrics.falsePositiveRate}% false positive rate on benign queries.`
  });

  return results;
}
