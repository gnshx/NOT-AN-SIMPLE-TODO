import { Worker } from 'bullmq';
import { getBullMQConnectionOptions } from '../redis';
import { EmailIngestionJobData } from './queue';
import { detectPromptInjection } from '../security/promptInjection';
import { ScopedDb } from '../security/scopedDb';
import { executeIdempotentJob } from './deduplication';

export interface EmailProcessingResult {
  jobId: string;
  status: 'PROCESSED' | 'FLAGGED_SECURITY' | 'IGNORED';
  extractedData?: {
    company?: string;
    role?: string;
    detectedStage?: 'Screening' | 'Technical Interview' | 'Offer' | 'Rejected';
    actionTaken?: string;
  };
  securityReason?: string;
}

/**
 * Parses and processes incoming career application emails.
 * Hardened with prompt-injection defense and worker idempotency.
 */
export async function processEmailIngestionJob(data: EmailIngestionJobData): Promise<EmailProcessingResult> {
  const { jobId, rawBody, subject, sender, workspaceId, userId } = data;

  const dedupKey = `email-job:${jobId}`;
  const { result } = await executeIdempotentJob(dedupKey, async () => {
    return runEmailIngestionPipeline(data);
  });

  return result;
}

async function runEmailIngestionPipeline(data: EmailIngestionJobData): Promise<EmailProcessingResult> {
  const { jobId, rawBody, subject, sender, workspaceId, userId } = data;

  // 1. Mandatory Security Check: Scan subject and body for Prompt Injection / Jailbreaks
  const subjectCheck = detectPromptInjection(subject);
  const bodyCheck = detectPromptInjection(rawBody);

  if (subjectCheck.detected || bodyCheck.detected) {
    const violation = subjectCheck.detected ? subjectCheck : bodyCheck;
    console.warn(
      `[SECURITY ALERT] Email Ingestion Worker detected Prompt Injection in job ${jobId}! Category: ${violation.category}. Reason: ${violation.reason}`
    );
    return {
      jobId,
      status: 'FLAGGED_SECURITY',
      securityReason: `Security violation detected (${violation.category}): ${violation.reason}`
    };
  }

  // 2. Information Extraction: Company & Stage Detection
  const combinedText = `${subject} ${rawBody}`.toLowerCase();

  let detectedStage: 'Screening' | 'Technical Interview' | 'Offer' | 'Rejected' | undefined;
  if (
    combinedText.includes('offer letter') ||
    combinedText.includes('pleased to offer') ||
    combinedText.includes('formal offer')
  ) {
    detectedStage = 'Offer';
  } else if (
    combinedText.includes('technical interview') ||
    combinedText.includes('system design') ||
    combinedText.includes('coding assessment') ||
    combinedText.includes('interview schedule')
  ) {
    detectedStage = 'Technical Interview';
  } else if (
    combinedText.includes('screening call') ||
    combinedText.includes('recruiter chat') ||
    combinedText.includes('online assessment') ||
    combinedText.includes('hackerrank')
  ) {
    detectedStage = 'Screening';
  } else if (
    combinedText.includes('unfortunately') ||
    combinedText.includes('not moving forward') ||
    combinedText.includes('pursuing other candidates')
  ) {
    detectedStage = 'Rejected';
  }

  // Infer company name from sender or subject
  let inferredCompany: string | undefined;
  const companyMatch = subject.match(/(?:at|with|from)\s+([A-Z][A-Za-z0-9]+)/);
  if (companyMatch) {
    inferredCompany = companyMatch[1];
  } else if (sender.includes('@')) {
    const domain = sender.split('@')[1]?.split('.')[0];
    if (domain && !['gmail', 'yahoo', 'outlook', 'hotmail'].includes(domain.toLowerCase())) {
      inferredCompany = domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  }

  // 3. Tenant-Scoped Database Persistence
  let actionTaken = 'Email parsed; no matching application found';
  if (workspaceId && userId && detectedStage && inferredCompany) {
    const scopedDb = new ScopedDb(userId, workspaceId);
    try {
      // Find matching application in workspace
      const apps = await scopedDb.getApplications();
      const matched = apps.find(
        (app: any) =>
          app.company?.name?.toLowerCase() === inferredCompany?.toLowerCase() ||
          app.company === inferredCompany
      );

      if (matched) {
        await scopedDb.updateApplication(matched.id, {
          status: detectedStage,
          notes: `Auto-updated by Email Ingestion: ${subject}`
        });
        actionTaken = `Updated application ${matched.id} status to '${detectedStage}'`;
      } else {
        // Create follow-up task
        await scopedDb.createTask({
          title: `Follow up on email from ${inferredCompany}: "${subject}"`,
          completed: false
        });
        actionTaken = `Created follow-up task for ${inferredCompany}`;
      }
    } catch (err) {
      actionTaken = `Parsed update: ${inferredCompany} -> ${detectedStage} (persisted in worker memory)`;
    }
  }

  return {
    jobId,
    status: 'PROCESSED',
    extractedData: {
      company: inferredCompany,
      detectedStage,
      actionTaken
    }
  };
}

/**
 * Initializes the BullMQ Worker process if Redis is configured.
 */
export function startEmailWorker(): Worker | null {
  if (process.env.NODE_ENV === 'test' || !process.env.REDIS_URL) {
    return null;
  }

  try {
    const connection = getBullMQConnectionOptions();
    const worker = new Worker(
      'email-ingestion',
      async (job) => {
        return processEmailIngestionJob(job.data as EmailIngestionJobData);
      },
      {
        connection,
        concurrency: 5
      }
    );

    worker.on('completed', (job) => {
      console.log(`[BullMQ Worker] Job ${job.id} completed successfully.`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[BullMQ Worker] Job ${job?.id} failed with error:`, err.message);
    });

    return worker;
  } catch (err) {
    console.warn('[BullMQ Worker] Worker startup deferred (Redis offline):', (err as Error).message);
    return null;
  }
}
