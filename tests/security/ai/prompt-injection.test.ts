import { detectPromptInjection, runPromptInjectionBenchmark } from '../../../web/src/lib/security/promptInjection';

export function runPromptInjectionTestSuite() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  const benchmark = runPromptInjectionBenchmark();

  results.push({
    name: 'Prompt Injection Benchmark Detection Rate',
    passed: benchmark.attackDetectionRate >= 95,
    details: `Achieved ${benchmark.attackDetectionRate}% detection rate across ${benchmark.totalCases} cases.`
  });

  results.push({
    name: 'Prompt Injection False Positive Rate',
    passed: benchmark.falsePositiveRate === 0,
    details: `Achieved ${benchmark.falsePositiveRate}% false positive rate on benign queries.`
  });

  return results;
}
