export function cacheEntry<T>(data: T, updatedAt: number): { data: T; updatedAt: number } {
  return { data, updatedAt };
}