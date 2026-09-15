export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID';

export interface SubscriptionStateContext {
  id: string;
  organizationId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  pastDueSince?: Date | null;
  cancelAtPeriodEnd: boolean;
}

const GRACE_PERIOD_DAYS = 14;

/**
 * P4-08: Billing Subscription State Machine.
 * Manages deterministic state transitions, grace periods, and cancellation triggers.
 */
export class BillingStateMachine {
  /**
   * Determines if the organization is currently entitled to paid plan features.
   */
  static isAccessGranted(sub: SubscriptionStateContext): boolean {
    if (sub.status === 'ACTIVE' || sub.status === 'TRIALING') {
      return true;
    }

    if (sub.status === 'PAST_DUE' && sub.pastDueSince) {
      // Allow access during 14-day grace period
      const gracePeriodEnd = new Date(sub.pastDueSince.getTime() + GRACE_PERIOD_DAYS * 86400 * 1000);
      return new Date() < gracePeriodEnd;
    }

    return false;
  }

  /**
   * Evaluates next state upon receiving payment failure.
   */
  static onPaymentFailed(sub: SubscriptionStateContext): SubscriptionStatus {
    return 'PAST_DUE';
  }

  /**
   * Evaluates next state upon receiving successful payment.
   */
  static onPaymentSucceeded(sub: SubscriptionStateContext): SubscriptionStatus {
    return 'ACTIVE';
  }

  /**
   * Evaluates if past-due grace period has fully expired.
   */
  static isGracePeriodExpired(sub: SubscriptionStateContext): boolean {
    if (sub.status !== 'PAST_DUE' || !sub.pastDueSince) return false;
    const graceEnd = new Date(sub.pastDueSince.getTime() + GRACE_PERIOD_DAYS * 86400 * 1000);
    return new Date() >= graceEnd;
  }
}
