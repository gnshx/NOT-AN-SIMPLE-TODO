import { getRedisClient } from '../redis';

export interface UsageRecord {
  id: string;
  workspaceId: string;
  userId: string;
  modelId: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  timestamp: string;
}

// Pricing per million tokens (USD)
const PRICING_TABLE: Record<string, { promptPerM: number; completionPerM: number }> = {
  'gemini-2.5-flash': { promptPerM: 0.075, completionPerM: 0.30 },
  'gemini-1.5-pro': { promptPerM: 1.25, completionPerM: 5.00 },
  'gpt-4o-mini': { promptPerM: 0.15, completionPerM: 0.60 },
  'gpt-4o': { promptPerM: 2.50, completionPerM: 10.00 },
  'heuristic-agent-v1': { promptPerM: 0, completionPerM: 0 }
};

export function calculateCostUsd(modelId: string, promptTokens: number, completionTokens: number): number {
  const pricing = PRICING_TABLE[modelId] || PRICING_TABLE['gemini-2.5-flash'];
  const promptCost = (promptTokens / 1_000_000) * pricing.promptPerM;
  const completionCost = (completionTokens / 1_000_000) * pricing.completionPerM;
  return Number((promptCost + completionCost).toFixed(6));
}

// In-memory ring buffer of recent usages
const inMemoryUsageLog: UsageRecord[] = [];

/**
 * Records an AI usage event for metering, observability, and billing.
 */
export async function recordAiUsage(usage: Omit<UsageRecord, 'id' | 'timestamp'>): Promise<UsageRecord> {
  const record: UsageRecord = {
    ...usage,
    id: `usg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString()
  };

  const redis = getRedisClient();
  if (redis) {
    try {
      const monthKey = new Date().toISOString().substring(0, 7); // YYYY-MM
      const redisKey = `usage:${record.workspaceId}:${monthKey}`;
      await redis.incrbyfloat(`${redisKey}:cost`, record.costUsd);
      await redis.incrby(`${redisKey}:tokens`, record.totalTokens);
      await redis.incr(`${redisKey}:requests`);
      // Expire after 90 days
      await redis.expire(`${redisKey}:cost`, 86400 * 90);
    } catch (e) {
      // Non-fatal
    }
  }

  inMemoryUsageLog.push(record);
  if (inMemoryUsageLog.length > 1000) {
    inMemoryUsageLog.shift();
  }

  return record;
}

/**
 * Retrieves total monthly usage spent for a given workspace.
 */
export async function getWorkspaceMonthlyUsage(workspaceId: string): Promise<{ totalCostUsd: number; totalTokens: number; requestCount: number }> {
  const monthKey = new Date().toISOString().substring(0, 7);
  const redis = getRedisClient();
  if (redis) {
    try {
      const redisKey = `usage:${workspaceId}:${monthKey}`;
      const [costStr, tokensStr, reqStr] = await Promise.all([
        redis.get(`${redisKey}:cost`),
        redis.get(`${redisKey}:tokens`),
        redis.get(`${redisKey}:requests`)
      ]);
      return {
        totalCostUsd: parseFloat(costStr || '0'),
        totalTokens: parseInt(tokensStr || '0', 10),
        requestCount: parseInt(reqStr || '0', 10)
      };
    } catch (e) {}
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const records = inMemoryUsageLog.filter((r) => {
    const d = new Date(r.timestamp);
    return r.workspaceId === workspaceId && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  return {
    totalCostUsd: records.reduce((sum, r) => sum + r.costUsd, 0),
    totalTokens: records.reduce((sum, r) => sum + r.totalTokens, 0),
    requestCount: records.length
  };
}
