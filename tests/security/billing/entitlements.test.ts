import { canUseFeature, PLAN_LIMITS_MAP } from '../../../web/src/lib/billing/entitlements';
import { BillingStateMachine, SubscriptionStateContext } from '../../../web/src/lib/billing/state';
import { recordUsageEvent } from '../../../web/src/lib/billing/meter';

export async function runBillingSecurityTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: Centralized entitlement gating (FREE vs PRO vs ENTERPRISE)
  const freeAdvanced = canUseFeature('advancedSystemDesign', 'FREE');
  const proAdvanced = canUseFeature('advancedSystemDesign', 'PRO');
  const freeAts = canUseFeature('atsTailoring', 'FREE');
  const proAts = canUseFeature('atsTailoring', 'PRO');

  results.push({
    name: 'Billing: Centralized feature entitlement gating',
    passed: !freeAdvanced && proAdvanced && !freeAts && proAts,
    details: 'Centralized entitlement engine must gate advanced capabilities based on subscription plan tier.'
  });

  // Test 2: Subscription State Machine (14-day grace period enforcement)
  const now = new Date();
  const pastDueWithinGrace: SubscriptionStateContext = {
    id: 'sub-1',
    organizationId: 'org-1',
    status: 'PAST_DUE',
    currentPeriodEnd: now,
    pastDueSince: new Date(now.getTime() - 5 * 86400 * 1000), // 5 days ago (< 14 days)
    cancelAtPeriodEnd: false
  };

  const pastDueExpiredGrace: SubscriptionStateContext = {
    id: 'sub-2',
    organizationId: 'org-2',
    status: 'PAST_DUE',
    currentPeriodEnd: now,
    pastDueSince: new Date(now.getTime() - 15 * 86400 * 1000), // 15 days ago (> 14 days)
    cancelAtPeriodEnd: false
  };

  const withinGraceAccess = BillingStateMachine.isAccessGranted(pastDueWithinGrace);
  const expiredGraceAccess = BillingStateMachine.isAccessGranted(pastDueExpiredGrace);
  const isGraceExpired = BillingStateMachine.isGracePeriodExpired(pastDueExpiredGrace);

  results.push({
    name: 'Billing: Subscription state machine and 14-day grace period handling',
    passed: withinGraceAccess && !expiredGraceAccess && isGraceExpired,
    details: 'Past-due subscriptions must allow access for 14 days grace, then terminate access.'
  });

  // Test 3: Immutable usage event metering
  const meterEvent = await recordUsageEvent({
    workspaceId: 'ws-billing-test',
    feature: 'AI_TOKENS',
    quantity: 1500,
    unitCostUsd: 0.002,
    metadata: { model: 'gemini-2.5-flash', operation: 'resume-tailor' }
  });

  results.push({
    name: 'Billing: Immutable usage event recording and auditing',
    passed:
      typeof meterEvent.id === 'string' &&
      meterEvent.quantity === 1500 &&
      meterEvent.feature === 'AI_TOKENS' &&
      typeof meterEvent.timestamp === 'string',
    details: 'Every billable resource consumption must produce an immutable MeterEvent.'
  });

  return results;
}
