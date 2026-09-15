export type PlanTier = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';

export interface PlanLimits {
  aiRequestsPerMonth: number;
  maxWorkspaceMembers: number;
  maxActiveApplications: number;
  maxIntegrations: number;
  advancedSystemDesign: boolean;
  atsTailoring: boolean;
  dedicatedSupport: boolean;
}

export const PLAN_LIMITS_MAP: Record<PlanTier, PlanLimits> = {
  FREE: {
    aiRequestsPerMonth: 50,
    maxWorkspaceMembers: 1,
    maxActiveApplications: 50,
    maxIntegrations: 1,
    advancedSystemDesign: false,
    atsTailoring: false,
    dedicatedSupport: false
  },
  PRO: {
    aiRequestsPerMonth: 500,
    maxWorkspaceMembers: 1,
    maxActiveApplications: 10_000,
    maxIntegrations: 3,
    advancedSystemDesign: true,
    atsTailoring: true,
    dedicatedSupport: false
  },
  TEAM: {
    aiRequestsPerMonth: 2_000,
    maxWorkspaceMembers: 10,
    maxActiveApplications: 100_000,
    maxIntegrations: 10,
    advancedSystemDesign: true,
    atsTailoring: true,
    dedicatedSupport: true
  },
  ENTERPRISE: {
    aiRequestsPerMonth: 1_000_000,
    maxWorkspaceMembers: 10_000,
    maxActiveApplications: 1_000_000,
    maxIntegrations: 100,
    advancedSystemDesign: true,
    atsTailoring: true,
    dedicatedSupport: true
  }
};

/**
 * P4-02: Server-Side Entitlements Engine.
 * Evaluates whether an organization or workspace has access to a specific capability.
 */
export function canUseFeature(feature: keyof PlanLimits, tier: PlanTier = 'FREE'): boolean {
  const limits = PLAN_LIMITS_MAP[tier] || PLAN_LIMITS_MAP.FREE;
  const val = limits[feature];
  if (typeof val === 'boolean') return val;
  return typeof val === 'number' && val > 0;
}

/**
 * Checks remaining quota for countable features.
 */
export function checkQuotaAllowance(
  feature: 'aiRequestsPerMonth' | 'maxWorkspaceMembers' | 'maxActiveApplications' | 'maxIntegrations',
  currentUsage: number,
  tier: PlanTier = 'FREE'
): { allowed: boolean; limit: number; remaining: number } {
  const limits = PLAN_LIMITS_MAP[tier] || PLAN_LIMITS_MAP.FREE;
  const limit = limits[feature] as number;
  const remaining = Math.max(0, limit - currentUsage);

  return {
    allowed: currentUsage < limit,
    limit,
    remaining
  };
}
