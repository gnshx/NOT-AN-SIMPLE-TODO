import { getRedisClient } from '../redis';

export type FeatureFlagKey =
  | 'ai_pilot_chat'
  | 'background_email_ingestion'
  | 'distributed_rate_limiting'
  | 'advanced_system_design_prep'
  | 'automated_ats_resume_tailoring'
  | 'scam_detection_engine'
  | 'mock_interview_simulator'
  | 'multi_workspace_switch';

export interface FeatureFlagDefinition {
  key: FeatureFlagKey;
  description: string;
  defaultValue: boolean;
  minTier?: 'FREE' | 'PRO' | 'ENTERPRISE';
}

export const FEATURE_FLAG_DEFINITIONS: Record<FeatureFlagKey, FeatureFlagDefinition> = {
  ai_pilot_chat: {
    key: 'ai_pilot_chat',
    description: 'Autonomous AI Pilot chat agent for career workflow optimization',
    defaultValue: true
  },
  background_email_ingestion: {
    key: 'background_email_ingestion',
    description: 'BullMQ asynchronous recruiter email ingestion and status parser',
    defaultValue: true
  },
  distributed_rate_limiting: {
    key: 'distributed_rate_limiting',
    description: 'Redis sliding-window distributed rate limiting across API routes',
    defaultValue: true
  },
  scam_detection_engine: {
    key: 'scam_detection_engine',
    description: 'Machine learning and heuristic job scam risk analysis',
    defaultValue: true
  },
  advanced_system_design_prep: {
    key: 'advanced_system_design_prep',
    description: 'Interactive system design interview simulator and architectural review',
    defaultValue: false,
    minTier: 'PRO'
  },
  automated_ats_resume_tailoring: {
    key: 'automated_ats_resume_tailoring',
    description: 'Automatic keyword matching and resume version optimization for ATS',
    defaultValue: false,
    minTier: 'PRO'
  },
  mock_interview_simulator: {
    key: 'mock_interview_simulator',
    description: 'Real-time AI voice/text mock interview feedback engine',
    defaultValue: false,
    minTier: 'ENTERPRISE'
  },
  multi_workspace_switch: {
    key: 'multi_workspace_switch',
    description: 'Seamless multi-workspace organization switching',
    defaultValue: true
  }
};

// In-memory override cache for dev / fallback
const inMemoryFlagOverrides = new Map<string, Record<string, boolean>>();

/**
 * Checks whether a feature flag is enabled for the specified workspace and user context.
 */
export async function isFeatureEnabled(
  flagKey: FeatureFlagKey,
  context?: { workspaceId?: string; organizationTier?: 'FREE' | 'PRO' | 'ENTERPRISE' }
): Promise<boolean> {
  const definition = FEATURE_FLAG_DEFINITIONS[flagKey];
  if (!definition) return false;

  // 1. Environment Variable Override (e.g. FEATURE_FLAG_AI_PILOT_CHAT=false)
  const envKey = `FEATURE_FLAG_${flagKey.toUpperCase()}`;
  if (process.env[envKey] !== undefined) {
    return process.env[envKey] === 'true' || process.env[envKey] === '1';
  }

  // 2. Organization Tier Gate & Entitlement
  if (definition.minTier && context?.organizationTier) {
    const tierRanks = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
    if (tierRanks[context.organizationTier] < tierRanks[definition.minTier]) {
      return false;
    }
    return true;
  }

  // 3. Workspace-Specific Override in Redis
  if (context?.workspaceId) {
    const redis = getRedisClient();
    if (redis) {
      try {
        const val = await redis.get(`flag:${context.workspaceId}:${flagKey}`);
        if (val !== null) {
          return val === 'true' || val === '1';
        }
      } catch (e) {
        // Fallback to local map
      }
    }

    const localOverrides = inMemoryFlagOverrides.get(context.workspaceId);
    if (localOverrides && localOverrides[flagKey] !== undefined) {
      return localOverrides[flagKey];
    }
  }

  return definition.defaultValue;
}

/**
 * Retrieves the complete evaluated feature flag map for a workspace.
 */
export async function getEvaluatedFeatureFlags(
  context?: { workspaceId?: string; organizationTier?: 'FREE' | 'PRO' | 'ENTERPRISE' }
): Promise<Record<FeatureFlagKey, boolean>> {
  const result = {} as Record<FeatureFlagKey, boolean>;
  const keys = Object.keys(FEATURE_FLAG_DEFINITIONS) as FeatureFlagKey[];

  await Promise.all(
    keys.map(async (key) => {
      result[key] = await isFeatureEnabled(key, context);
    })
  );

  return result;
}

/**
 * Sets a dynamic feature flag override for a specific workspace (Admin only).
 */
export async function setWorkspaceFeatureFlagOverride(
  workspaceId: string,
  flagKey: FeatureFlagKey,
  enabled: boolean
): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(`flag:${workspaceId}:${flagKey}`, enabled ? 'true' : 'false', 'EX', 86400 * 30);
      return;
    } catch (e) {}
  }

  const current = inMemoryFlagOverrides.get(workspaceId) || {};
  current[flagKey] = enabled;
  inMemoryFlagOverrides.set(workspaceId, current);
}
