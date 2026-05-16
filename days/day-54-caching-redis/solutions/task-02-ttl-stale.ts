export function isStale(fetchedAt: number, now: number, ttlMs: number): boolean {
  return now - fetchedAt > ttlMs;
}
