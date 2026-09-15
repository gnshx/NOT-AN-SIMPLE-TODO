import { getWorkspaceMonthlyUsage } from './metering';
import { AppError } from '../errors';

export const MAX_REQUEST_COST_CEILING_USD = 0.10; // $0.10 max cost per individual request

export const MONTHLY_BUDGET_BY_TIER: Record<'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE', number> = {
  FREE: 1.00,       // ~50-100 Flash requests
  PRO: 15.00,      // ~500-1000 requests + reasoning
  TEAM: 75.00,     // 2000+ requests
  ENTERPRISE: 10000.00 // Unlimited pooled capacity
};

export interface BudgetCheckResult {
  allowed: boolean;
  currentMonthlySpendUsd: number;
  monthlyLimitUsd: number;
  remainingSpendUsd: number;
}

/**
 * P3-03: AI Budget Enforcement Engine.
 * Protects organizations from runaway LLM loops and billing surprises.
 * Enforces both per-request hard caps and monthly plan limits before calling model providers.
 */
export async function enforceAiBudget(
  workspaceId: string,
  tier: 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE' = 'FREE',
  estimatedCostUsd = 0.005
): Promise<BudgetCheckResult> {
  // 1. Hard per-request ceiling guard
  if (estimatedCostUsd > MAX_REQUEST_COST_CEILING_USD) {
    throw new AppError(
      `Per-request AI cost ceiling ($${MAX_REQUEST_COST_CEILING_USD}) exceeded. Operation aborted for safety.`,
      400,
      'REQUEST_COST_CEILING_EXCEEDED'
    );
  }

  // 2. Monthly spend check
  const usage = await getWorkspaceMonthlyUsage(workspaceId);
  const monthlyLimitUsd = MONTHLY_BUDGET_BY_TIER[tier] || MONTHLY_BUDGET_BY_TIER.FREE;
  const projectedSpend = usage.totalCostUsd + estimatedCostUsd;

  if (projectedSpend > monthlyLimitUsd) {
    throw new AppError(
      `Monthly AI budget for ${tier} tier ($${monthlyLimitUsd.toFixed(2)}) reached ($${usage.totalCostUsd.toFixed(2)} spent). Please upgrade your plan to continue using AI Pilot.`,
      402,
      'AI_BUDGET_EXCEEDED',
      { currentSpend: usage.totalCostUsd, limit: monthlyLimitUsd }
    );
  }

  return {
    allowed: true,
    currentMonthlySpendUsd: usage.totalCostUsd,
    monthlyLimitUsd,
    remainingSpendUsd: Math.max(0, monthlyLimitUsd - projectedSpend)
  };
}
