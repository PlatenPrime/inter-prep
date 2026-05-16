export function invalidatePrefix(
  cache: Map<string, unknown>,
  prefix: readonly unknown[],
): string[] {
  const base = JSON.stringify(prefix);
  const childPrefix = base.slice(0, -1) + ',';
  const removed: string[] = [];
  for (const key of [...cache.keys()]) {
    if (key === base || key.startsWith(childPrefix)) {
      removed.push(key);
      cache.delete(key);
    }
  }
  return removed;
}