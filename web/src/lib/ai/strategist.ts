export interface CareerDiagnosis {
  overallHealthScore: number; // 0 to 100
  bottleneck: string;
  bottleneckStage: 'APPLICATION' | 'RESUME_CONVERSION' | 'INTERVIEW_CONVERSION' | 'OFFER_CLOSING';
  funnelMetrics: {
    applicationsSubmitted: number;
    underReviewCount: number;
    interviewCount: number;
    offerCount: number;
    responseRate: number;
    interviewRate: number;
  };
  keyPatterns: string[];
  recommendedActions: {
    id: string;
    title: string;
    description: string;
    impact: 'HIGH' | 'MEDIUM';
    actionType: 'CREATE_RESUME_VARIANT' | 'DRAFT_FOLLOWUPS' | 'SCHEDULE_PREP';
  }[];
}

export async function analyzeCareerStrategy(workspaceId: string = 'ws-default-1'): Promise<CareerDiagnosis> {
  // In production, queries Prisma DB across applications, resumes, and interview feedback
  return {
    overallHealthScore: 84,
    bottleneck: "Your biggest bottleneck isn't application volume (42 submitted). It is resume → interview conversion.",
    bottleneckStage: 'RESUME_CONVERSION',
    funnelMetrics: {
      applicationsSubmitted: 42,
      underReviewCount: 28,
      interviewCount: 7,
      offerCount: 2,
      responseRate: 31.0,
      interviewRate: 16.6
    },
    keyPatterns: [
      "Applications mentioning TypeScript + React have a 2.3× higher response rate.",
      "Applications submitted within 48 hours of job posting have 64% higher interview conversion.",
      "AWS skill gap is causing 35% of high-match backend roles to stall at screening stage."
    ],
    recommendedActions: [
      {
        id: 'rec-1',
        title: 'Create React/TypeScript Resume Variant v3',
        description: 'Highlight frontend state management and API integration to boost conversion by estimated +18%.',
        impact: 'HIGH',
        actionType: 'CREATE_RESUME_VARIANT'
      },
      {
        id: 'rec-2',
        title: 'Follow Up with 3 Overdue Recruiters (Stripe, Acme, FinTech)',
        description: 'Send polite status inquiry emails for applications pending >10 days.',
        impact: 'HIGH',
        actionType: 'DRAFT_FOLLOWUPS'
      },
      {
        id: 'rec-3',
        title: 'Schedule AWS & Cloud Architecture Prep Block',
        description: 'Complete 2-hour intensive cloud architecture review before upcoming technical rounds.',
        impact: 'MEDIUM',
        actionType: 'SCHEDULE_PREP'
      }
    ]
  };
}
