import { ScopedDb } from '../security/scopedDb';
import { detectPromptInjection } from '../security/promptInjection';
import { AppError } from '../errors';

export type MemoryCategory =
  | 'PREFERENCE'
  | 'SKILL'
  | 'TARGET_COMPANY'
  | 'INTERVIEW_STORY'
  | 'FEEDBACK';

export interface AiMemoryRecord {
  id?: string;
  workspaceId: string;
  category: MemoryCategory;
  key: string;
  value: string;
  confidence: number;
  source: string;
  createdAt?: string;
  updatedAt?: string;
}

// In-memory fallback for local dev when Postgres is offline
const inMemoryMemoryStore = new Map<string, AiMemoryRecord[]>();

/**
 * Service managing user & workspace long-term AI memories.
 */
export class AiMemoryService {
  constructor(private userId: string, private workspaceId: string) {}

  /**
   * Retrieves memories for the authenticated workspace, optionally filtered by category.
   */
  async listMemories(category?: MemoryCategory): Promise<AiMemoryRecord[]> {
    const scopedDb = new ScopedDb(this.userId, this.workspaceId);
    try {
      const records = await scopedDb.getAiMemories(category);
      return records as AiMemoryRecord[];
    } catch (err) {
      const stored = inMemoryMemoryStore.get(this.workspaceId) || [];
      if (category) {
        return stored.filter((m) => m.category === category);
      }
      return stored;
    }
  }

  /**
   * Upserts an AI memory item with strict prompt injection screening.
   */
  async saveMemory(item: {
    category: MemoryCategory;
    key: string;
    value: string;
    confidence?: number;
    source?: string;
  }): Promise<AiMemoryRecord> {
    // Defense-in-depth: Screen memory value against prompt injection before long-term persistence
    const check = detectPromptInjection(item.value);
    if (check.detected) {
      throw new AppError(
        `Memory rejected: Contains disallowed prompt directive (${check.category}).`,
        400,
        'PROMPT_INJECTION_DETECTED'
      );
    }

    const confidence = item.confidence ?? 95.0;
    const source = item.source || 'User Input';

    const scopedDb = new ScopedDb(this.userId, this.workspaceId);
    try {
      const saved = await scopedDb.upsertAiMemory(
        item.category,
        item.key,
        item.value,
        confidence,
        source
      );
      return saved as unknown as AiMemoryRecord;
    } catch (err) {
      // Memory fallback for dev
      const list = inMemoryMemoryStore.get(this.workspaceId) || [];
      const existingIdx = list.findIndex(
        (m) => m.category === item.category && m.key === item.key
      );

      const record: AiMemoryRecord = {
        id: `mem-${Date.now()}`,
        workspaceId: this.workspaceId,
        category: item.category,
        key: item.key,
        value: item.value,
        confidence,
        source,
        updatedAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        list[existingIdx] = record;
      } else {
        list.push(record);
      }
      inMemoryMemoryStore.set(this.workspaceId, list);
      return record;
    }
  }

  /**
   * Formats retrieved memories into a safe prompt context block for the LLM.
   */
  formatMemoriesForPrompt(memories: AiMemoryRecord[]): string {
    if (!memories || memories.length === 0) {
      return '';
    }

    const grouped: Record<string, string[]> = {};
    for (const mem of memories) {
      // Sanitize memory key/value to prevent prompt boundary escaping
      const safeKey = mem.key.replace(/[<>{}\[\]]/g, '');
      const safeValue = mem.value.replace(/[<>{}\[\]]/g, '');
      if (!grouped[mem.category]) grouped[mem.category] = [];
      grouped[mem.category].push(`- ${safeKey}: ${safeValue} (confidence: ${Math.round(mem.confidence)}%)`);
    }

    let output = 'USER CAREER CONTEXT & MEMORIES:\n';
    for (const [cat, lines] of Object.entries(grouped)) {
      output += `[${cat}]\n${lines.join('\n')}\n`;
    }
    return output.trim();
  }
}
