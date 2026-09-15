import { Queue, QueueOptions } from 'bullmq';
import { getBullMQConnectionOptions } from '../redis';

export type JobQueueName = 'email-ingestion' | 'ai-actions' | 'notifications';

export interface EmailIngestionJobData {
  jobId: string;
  userId: string;
  workspaceId: string;
  sender: string;
  subject: string;
  rawBody: string;
  receivedAt: string;
}

export interface AiActionJobData {
  actionId: string;
  userId: string;
  workspaceId: string;
  toolName: string;
  parameters: Record<string, any>;
  promptContext: string;
}

// Queue registry to avoid re-instantiating BullMQ queues on every invocation
const activeQueues = new Map<string, Queue>();

export function getQueue(queueName: JobQueueName): Queue | null {
  if (process.env.NODE_ENV === 'test' && !process.env.REDIS_URL) {
    return null;
  }

  if (activeQueues.has(queueName)) {
    return activeQueues.get(queueName)!;
  }

  try {
    const connection = getBullMQConnectionOptions();
    const queueOptions: QueueOptions = {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        },
        removeOnComplete: {
          count: 100
        },
        removeOnFail: {
          count: 500
        }
      }
    };

    const queue = new Queue(queueName, queueOptions);
    activeQueues.set(queueName, queue);
    return queue;
  } catch (err) {
    console.warn(`[BullMQ] Failed to initialize queue '${queueName}':`, (err as Error).message);
    return null;
  }
}

/**
 * Enqueues an email ingestion job for asynchronous parsing and status extraction.
 */
export async function enqueueEmailIngestion(data: EmailIngestionJobData): Promise<{ enqueued: boolean; id: string }> {
  const queue = getQueue('email-ingestion');
  if (queue) {
    try {
      const job = await queue.add('ingest-email', data, {
        jobId: data.jobId
      });
      return { enqueued: true, id: job.id || data.jobId };
    } catch (err) {
      console.warn('[BullMQ] Failed to push to Redis queue, fallback to memory processing:', (err as Error).message);
    }
  }

  // Fallback for dev/test when Redis is not running
  return { enqueued: false, id: data.jobId };
}
