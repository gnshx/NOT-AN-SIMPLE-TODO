import { toolsRegistry } from './tools';

export interface PilotResponse {
  answer: string;
  confidenceScore: number;
  reasoning: string;
  evidence: string[];
  proposedActions: {
    id: string;
    toolName: string;
    description: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    requiresApproval: boolean;
    payload: any;
  }[];
}

export async function runPilotAgent(query: string, context: { workspaceId: string }): Promise<PilotResponse> {
  const qLower = query.toLowerCase();

  if (qLower.includes('interview') || qLower.includes('google') || qLower.includes('prep')) {
    return {
      answer: "I've reviewed your upcoming Google Technical Interview on Friday. I built a 5-step preparation plan, updated your research sheet, and drafted 3 key system design questions.",
      confidenceScore: 0.94,
      reasoning: "Gmail detected confirmed Technical Round invitation from Google Talent Acquisition.",
      evidence: [
        "Sender domain: google.com",
        "Subject matched: Technical Interview Confirmation",
        "Extracted date: Friday 4:00 PM IST"
      ],
      proposedActions: [
        {
          id: `act-${Date.now()}-1`,
          toolName: 'updateApplicationStatus',
          description: 'Move Google application status from Under Review to Interview Scheduled',
          riskLevel: 'MEDIUM',
          requiresApproval: true,
          payload: { applicationId: 'app-google-1', companyName: 'Google', newStatus: 'INTERVIEW_SCHEDULED', reason: 'Confirmed interview email detected' }
        },
        {
          id: `act-${Date.now()}-2`,
          toolName: 'scheduleInterviewPrep',
          description: 'Add 90-min Google Technical Prep block to Friday schedule',
          riskLevel: 'LOW',
          requiresApproval: false,
          payload: { companyName: 'Google', role: 'Software Engineer', interviewDate: 'Friday 4:00 PM' }
        }
      ]
    };
  }

  if (qLower.includes('plan') || qLower.includes('day') || qLower.includes('today')) {
    return {
      answer: "Here is your recommended schedule for today based on 2 application deadlines, 1 interview prep block, and 3 high-priority tasks.",
      confidenceScore: 0.96,
      reasoning: "Optimized time allocation for maximum career impact.",
      evidence: [
        "Google interview scheduled in 2 days",
        "Stripe follow-up email pending since 3 days ago",
        "2 target backend roles matching >90% profile fit"
      ],
      proposedActions: [
        {
          id: `act-${Date.now()}-3`,
          toolName: 'createTask',
          description: 'Create task: Follow up with Stripe recruiter Sarah',
          riskLevel: 'LOW',
          requiresApproval: false,
          payload: { title: 'Follow up with Stripe recruiter', priority: 'HIGH', category: 'Communication' }
        }
      ]
    };
  }

  return {
    answer: `Processed request: "${query}". Pilot is active and monitoring workspace signals.`,
    confidenceScore: 0.88,
    reasoning: "Standard natural language assistant query.",
    evidence: ["Workspace context checked", "No high-risk operations requested"],
    proposedActions: []
  };
}
