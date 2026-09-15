export type ModelTier = 'FLASH' | 'PRO';

export interface RouteDecision {
  tier: ModelTier;
  primaryProvider: 'GEMINI' | 'OPENAI' | 'MOCK_HEURISTIC';
  fallbackProvider?: 'GEMINI' | 'OPENAI' | 'MOCK_HEURISTIC';
  modelId: string;
  reason: string;
}

/**
 * P3-02: Intelligent Model Routing Policy Engine.
 * Analyzes request intent, query complexity, and configured API credentials
 * to select the optimal model tier (cost vs capability) and provider fallback order.
 */
export function routeModelRequest(query: string, options?: { forceTier?: ModelTier }): RouteDecision {
  const qLower = query.toLowerCase();

  // 1. Determine Tier based on complexity heuristics
  let tier: ModelTier = 'FLASH';
  let reason = 'Standard query: routed to fast, cost-efficient Flash tier.';

  if (options?.forceTier) {
    tier = options.forceTier;
    reason = `User forced ${tier} model tier.`;
  } else if (
    qLower.includes('system design') ||
    qLower.includes('architecture') ||
    qLower.includes('negotiat') ||
    qLower.includes('counter-offer') ||
    qLower.includes('rewrite my entire resume') ||
    qLower.includes('mock interview analysis')
  ) {
    tier = 'PRO';
    reason = 'Complex strategic/analytical request: routed to Pro reasoning tier.';
  }

  // 2. Select Provider based on environment configuration
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasOpenAi = !!process.env.OPENAI_API_KEY;

  let primaryProvider: 'GEMINI' | 'OPENAI' | 'MOCK_HEURISTIC' = 'MOCK_HEURISTIC';
  let fallbackProvider: 'GEMINI' | 'OPENAI' | 'MOCK_HEURISTIC' | undefined = undefined;

  if (hasGemini) {
    primaryProvider = 'GEMINI';
    if (hasOpenAi) fallbackProvider = 'OPENAI';
  } else if (hasOpenAi) {
    primaryProvider = 'OPENAI';
  }

  // 3. Resolve Model Identifier
  let modelId = 'heuristic-agent-v1';
  if (primaryProvider === 'GEMINI') {
    modelId = tier === 'PRO' ? 'gemini-1.5-pro' : 'gemini-2.5-flash';
  } else if (primaryProvider === 'OPENAI') {
    modelId = tier === 'PRO' ? 'gpt-4o' : 'gpt-4o-mini';
  }

  return {
    tier,
    primaryProvider,
    fallbackProvider,
    modelId,
    reason
  };
}
