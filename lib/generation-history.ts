/**
 * Client-side generation history. Uses localStorage.
 * Persists factory id, prompt, result summary, timestamp.
 */

const STORAGE_KEY = "ai-factory-generation-history";
const MAX_ENTRIES = 50;

export interface HistoryEntry {
  id: string;
  factoryId: string;
  factoryName: string;
  prompt: string;
  resultPreview: string;
  timestamp: number;
  /** Optional: full result for copy/download */
  resultData?: unknown;
}

function getStored(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function setStored(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // ignore
  }
}

export function addToHistory(entry: Omit<HistoryEntry, "id" | "timestamp">): void {
  const entries = getStored();
  const newEntry: HistoryEntry = {
    ...entry,
    id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
  };
  setStored([newEntry, ...entries]);
}

export function getHistory(): HistoryEntry[] {
  return getStored();
}

export function clearHistory(): void {
  setStored([]);
}

export function removeHistoryEntry(id: string): void {
  setStored(getStored().filter((e) => e.id !== id));
}
