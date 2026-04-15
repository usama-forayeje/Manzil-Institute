// Terms Cache Utility - Not a Server Action
// Cache for server-side data to avoid repeated DB calls
let designationsCache: any[] | null = null;
let termsCache: Record<any, any> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCacheTimestamp(): number {
  return cacheTimestamp;
}

export function setCacheTimestamp(timestamp: number): void {
  cacheTimestamp = timestamp;
}

export function getDesignationsCache(): any[] | null {
  return designationsCache;
}

export function setDesignationsCache(cache: any[] | null): void {
  designationsCache = cache;
}

export function getTermsCache(): Record<any, any> | null {
  return termsCache;
}

export function setTermsCache(cache: Record<any, any> | null): void {
  termsCache = cache;
}

export function invalidateTermsCache(): void {
  designationsCache = null;
  termsCache = null;
  cacheTimestamp = 0;
}

export function isCacheValid(): boolean {
  const now = Date.now();
  return designationsCache !== null && (now - cacheTimestamp) < CACHE_DURATION;
}
