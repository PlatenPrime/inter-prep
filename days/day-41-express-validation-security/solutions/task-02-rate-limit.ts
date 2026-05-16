export function rateLimitAllowed(count: number, limit: number): boolean {
  return count < limit;
}
