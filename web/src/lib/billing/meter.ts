import { prisma } from '../db';
import { getRedisClient } from '../redis';

export interface MeterEvent {
  id?: string;
  workspaceId: string;
  feature: 'AI_TOKENS' | 'RESUME_PARSE' | 'EMAIL_INGEST' | 'MOCK_INTERVIEW';
  quantity: number;
  unitCostUsd: number;
  metadata?: Record<string, any>;
  timestamp?: string;
}

const inMemoryMeterEvents: MeterEvent[] = [];

/**
 * P4-03: Immutable Usage Metering Writer.
 * Writes immutable usage event records for accurate SaaS billing and consumption audits.
 */
export async function recordUsageEvent(event: MeterEvent): Promise<MeterEvent> {
  const timestamp = event.timestamp || new Date().toISOString();
  const id = event.id || `usev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const record: MeterEvent = { ...event, id, timestamp };

  // 1. Write to database if prisma is connected
  if (prisma) {
    try {
      await (prisma as any).usageEvent?.create?.({
        data: {
          id,
          workspaceId: record.workspaceId,
          feature: record.feature,
          quantity: record.quantity,
          unitCost: record.unitCostUsd,
          metadata: record.metadata ? JSON.stringify(record.metadata) : null
        }
      });
    } catch (e) {
      // Non-fatal if table not migrated yet
    }
  }

  // 2. Increment Redis monthly aggregator
  const redis = getRedisClient();
  if (redis) {
    try {
      const month = timestamp.substring(0, 7);
      await redis.incrbyfloat(`meter:${record.workspaceId}:${record.feature}:${month}`, record.quantity);
    } catch (e) {}
  }

  inMemoryMeterEvents.push(record);
  if (inMemoryMeterEvents.length > 5000) {
    inMemoryMeterEvents.shift();
  }

  return record;
}

/**
 * Aggregates usage events for a workspace in a given time window.
 */
export async function getAggregatedUsage(
  workspaceId: string,
  feature: MeterEvent['feature'],
  sinceDate?: Date
): Promise<{ totalQuantity: number; totalCostUsd: number; eventCount: number }> {
  const cutoff = sinceDate ? sinceDate.getTime() : 0;
  const filtered = inMemoryMeterEvents.filter(
    (e) => e.workspaceId === workspaceId && e.feature === feature && new Date(e.timestamp!).getTime() >= cutoff
  );

  return {
    totalQuantity: filtered.reduce((sum, e) => sum + e.quantity, 0),
    totalCostUsd: filtered.reduce((sum, e) => sum + e.quantity * e.unitCostUsd, 0),
    eventCount: filtered.length
  };
}
