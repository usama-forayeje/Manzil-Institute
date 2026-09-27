/**
 * Server-side reference data cache for Academic master records.
 * Drastically reduces Appwrite database round-trips for high-frequency reads.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const cacheStore: {
  departments?: CacheEntry<any[]>;
  classes?: CacheEntry<any[]>;
  sections?: CacheEntry<any[]>;
  sessions?: CacheEntry<any[]>;
  boardingTypes?: CacheEntry<any[]>;
} = {};

export function getCachedReference<T>(key: keyof typeof cacheStore): T | null {
  const entry = cacheStore[key];
  if (!entry) return null;
  const isFresh = Date.now() - entry.timestamp < CACHE_TTL_MS;
  if (!isFresh) {
    delete cacheStore[key];
    return null;
  }
  return entry.data as T;
}

export function setCachedReference<T>(key: keyof typeof cacheStore, data: T): void {
  cacheStore[key] = {
    data: data as any[],
    timestamp: Date.now(),
  };
}

export function invalidateAcademicCache(key?: keyof typeof cacheStore): void {
  if (key) {
    delete cacheStore[key];
  } else {
    delete cacheStore.departments;
    delete cacheStore.classes;
    delete cacheStore.sections;
    delete cacheStore.sessions;
    delete cacheStore.boardingTypes;
  }
}
